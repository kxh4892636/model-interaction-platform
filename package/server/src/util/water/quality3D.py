import os
import struct
import sys

from osgeo import gdal, ogr, osr


def resolveCSV(csvPath: str) -> dict:
    dataDict: dict = {"num": 0, "data": []}
    with open(csvPath, "r", encoding="utf8") as f:
        dataDict["num"] = int(f.readline().split(",")[1])
        data: list[tuple[str, str, str]] = []
        for line in f:
            content = line.split(",")
            if len(content) == 3:
                data.append(
                    (content[0], content[1], content[2].removesuffix("\n"))
                )
        dataDict["data"] = data

    return dataDict


def resolveDat(
    tndPath: str, dataDict: dict, hours: int
) -> list[tuple[str, float, float, float]]:
    dataList: list[tuple[str, float, float, float]] = []
    tinNum = dataDict["num"]
    data = dataDict["data"]
    # NOTE 二进制读取
    with open(tndPath, "rb") as f:
        f.seek((4 + 8 * tinNum) * hours)
        id: tuple = struct.unpack("i", f.read(4))
        for i in range(0, tinNum):
            value: tuple = struct.unpack("d", f.read(8))
            temp = (
                str(data[i][0]),
                float(data[i][1]),
                float(data[i][2]),
                float(value[0]),
            )
            dataList.append(temp)

    return dataList


def tnd2png(
    tndPath: str, dataDict: dict, hours: int, dstPath: str, maskPath: str
) -> tuple:
    dataList = resolveDat(tndPath, dataDict, hours)
    # create shp file from the csv file
    driver: ogr.Driver = ogr.GetDriverByName("ESRI Shapefile")
    ds: ogr.DataSource = driver.CreateDataSource("/vsimem/temp.shp")
    srs: osr.SpatialReference = osr.SpatialReference()
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    srs.ImportFromEPSG(4326)
    layer: ogr.Layer = ds.CreateLayer(
        "mesh", srs, ogr.wkbPoint, options=["ENCODING=UTF-8"]
    )
    # create fields of shp
    layer.CreateField(ogr.FieldDefn("ID", ogr.OFTString))
    layer.CreateField(ogr.FieldDefn("X", ogr.OFTReal))
    layer.CreateField(ogr.FieldDefn("Y", ogr.OFTReal))
    layer.CreateField(ogr.FieldDefn("Z", ogr.OFTReal))
    # create features
    featureDefn: ogr.FeatureDefn = layer.GetLayerDefn()
    for data in dataList:
        id = str(data[0])
        x = float(data[1])
        y = float(data[2])
        z = float(data[3])
        # create feature
        feature: ogr.Feature = ogr.Feature(featureDefn)
        feature.SetField("ID", id)
        feature.SetField("X", x)
        feature.SetField("Y", y)
        feature.SetField("Z", z)
        # create geometry
        point = ogr.Geometry(ogr.wkbPoint)
        point.AddPoint(x, y)
        # set geometry
        feature.SetGeometry(point)
        layer.CreateFeature(feature)
        del feature
    # get the meta of shp
    extent: tuple = layer.GetExtent()
    ratio = abs(((extent[3] - extent[2]) / (extent[1] - extent[0])))
    del driver, ds

    # shp2tif
    gridOptions = gdal.GridOptions(
        format="GTiff",
        outputType=gdal.GDT_Float32,
        algorithm="invdist:power=2.0:smoothing=0.0:radius1=0.0:radius2=0.0:angle=0.0:max_points=100:min_points=30:nodata=-9999",
        zfield="Z",
        width=1024,
        height=ratio * 1024,
    )
    gdal.Grid("/vsimem/temp_grid.tif", "/vsimem/temp.shp", options=gridOptions)
    ds: gdal.Dataset = gdal.Open("/vsimem/temp_grid.tif")
    band: gdal.Band = ds.GetRasterBand(1)
    minmax = band.ComputeRasterMinMax(0)
    # fix the error of spatial of gdal.Grid()
    warpOptions = gdal.WarpOptions(
        srcSRS=srs,
        dstSRS=srs,
        format="GTiff",
        cutlineDSName=maskPath,
        cropToCutline=True,
    )
    gdal.Warp(
        "/vsimem/temp_warp.tif", "/vsimem/temp_grid.tif", options=warpOptions
    )

    # normalize tif
    translateOptions = gdal.TranslateOptions(
        format="GTiff",
        outputType=gdal.GDT_Byte,
        scaleParams=[[minmax[0], minmax[1], 1, 255]],
    )
    gdal.Translate(
        "/vsimem/temp_normalize.tif",
        "/vsimem/temp_warp.tif",
        options=translateOptions,
    )
    del band, ds

    # false color composite image
    ds: gdal.Dataset = gdal.Open("/vsimem/temp_normalize.tif")
    band: gdal.Band = ds.GetRasterBand(1)
    [min, max, mean, std] = band.ComputeStatistics(0)
    # create color table
    colors = gdal.ColorTable()
    gap1 = mean - min
    gap2 = max - mean
    colors.CreateColorRamp(
        int(min), (122, 4, 3), int(mean - 0.7 * gap1), (227, 68, 10)
    )
    colors.CreateColorRamp(
        int(mean - 0.7 * gap1),
        (227, 68, 10),
        int(mean - 0.4 * gap1),
        (251, 185, 56),
    )
    colors.CreateColorRamp(
        int(mean - 0.4 * gap1), (251, 185, 56), int(mean), (164, 252, 60)
    )
    colors.CreateColorRamp(
        int(mean), (164, 252, 60), int(mean + 0.4 * gap2), (27, 229, 181)
    )
    colors.CreateColorRamp(
        int(mean + 0.4 * gap2),
        (27, 229, 181),
        int(mean + 0.7 * gap2),
        (70, 134, 251),
    )
    colors.CreateColorRamp(
        int(mean + 0.7 * gap2), (70, 134, 251), int(max), (48, 18, 59)
    )
    # set color table and color interpretation
    band.SetRasterColorTable(colors)
    # band.SetRasterColorInterpretation(gdal.GCI_PaletteIndex)
    del band, ds

    # tiff2png
    translateOptions = gdal.TranslateOptions(
        format="PNG",
    )
    gdal.Translate(
        dstPath, "/vsimem/temp_normalize.tif", options=translateOptions
    )

    return extent


if __name__ == "__main__":
    # os.environ['PROJ_LIB'] = r"C:\Users\kxh\AppData\Local\Programs\Python\Python310\Lib\site-packages\osgeo\data\proj"
    # sys.argv
    [modelFolderPath, hours, identifier] = sys.argv[1:4]
    # modelFolderPath = r"D:\project\fine-grained-simulation\data\test\tnd"
    # hours = "1"
    # identifier = "123456"
    csvPath = os.path.join(modelFolderPath, "f0.csv")
    dstPath = os.path.join(modelFolderPath)
    dataDict = resolveCSV(csvPath)
    maskPath = os.path.join(modelFolderPath, "f0.shp")
    suffixList = ["down", "middle", "up"]
    for i in range(1, 4):
        sndPath = os.path.join(modelFolderPath, f"snd{i}.dat")
        print(sndPath)
        for j in range(0, int(hours)):
            pngPath = os.path.join(
                dstPath,
                f"snd-{identifier}-{i}-{j}.png",
            )
            extent = tnd2png(sndPath, dataDict, j, pngPath, maskPath)
