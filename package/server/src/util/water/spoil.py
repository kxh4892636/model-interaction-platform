import os
import sys
import traceback

from osgeo import gdal, ogr, osr


def resolveTxt(csvPath: str) -> list[list[str]]:
    dataDict: list[list[str]] = []
    with open(csvPath, "r", encoding="utf8") as f:
        for line in f:
            content = line.split(" ")
            dataDict.append(content)

    return dataDict


def sand2png(dataList: list[list[str]], hours: int, dstPath: str) -> tuple:
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
    layer.CreateField(ogr.FieldDefn("Z", ogr.OFTReal))
    # create features
    featureDefn: ogr.FeatureDefn = layer.GetLayerDefn()
    for data in dataList:
        x = float(data[0])
        y = float(data[1])
        z = float(data[2 + hours])
        # create feature
        feature: ogr.Feature = ogr.Feature(featureDefn)
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
    with open(
        os.path.join(os.path.dirname(dstPath), "extent.txt"),
        "w",
        encoding="utf8",
    ) as f:
        f.write(str(extent))
    ratio = abs(((extent[3] - extent[2]) / (extent[1] - extent[0])))
    del driver, ds

    # shp2tif
    gridOptions = gdal.GridOptions(
        format="GTiff",
        outputType=gdal.GDT_Float32,
        algorithm="invdist:power=2.0:smoothing=0.0:radius1=0.0:radius2=0.0:angle=0.0:max_points=100:min_points=30:nodata=-9999",
        zfield="Z",
        width=1024,
        height=int(1024 * ratio),
    )
    gdal.Grid("/vsimem/temp_grid.tif", "/vsimem/temp.shp", options=gridOptions)
    ds: gdal.Dataset = gdal.Open("/vsimem/temp_grid.tif")
    band: gdal.Band = ds.GetRasterBand(1)
    minmax = band.ComputeRasterMinMax(0)
    print(minmax)
    # fix the error of spatial of gdal.Grid()
    warpOptions = gdal.WarpOptions(
        srcSRS=srs,
        dstSRS=srs,
        format="GTiff",
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


def dataToTextOfCoord(dstPath: str, dataDict: list[list[str]]):
    num = len(dataDict)
    dataList: list[str] = []
    index = 0
    for line in dataDict:
        index += 1
        dataList.append(f"{index} " + " ".join(line))

    with open(dstPath, "w", encoding="utf8") as ff:
        ff.write(f"{num}\n")
        ff.write("id x y value\n")
        ff.writelines(dataList)


if __name__ == "__main__":
    # os.environ['PROJ_LIB'] = r"C:\Users\kxh\AppData\Local\Programs\Python\Python310\Lib\site-packages\osgeo\data\proj"
    try:
        # sys.argv
        [modelFolderPath, hours, identifier] = sys.argv[1:4]
        cPath = os.path.join(
            modelFolderPath,
            f"outputC.txt",
        )
        dPath = os.path.join(
            modelFolderPath,
            f"outputD.txt",
        )

        dstPath = os.path.join(modelFolderPath)
        dataDict = resolveTxt(cPath)
        dataToTextOfCoord(
            os.path.join(
                dstPath,
                f"outputC-{identifier}-total.txt",
            ),
            dataDict,
        )
        for i in range(0, int(hours)):
            pngPath = os.path.join(dstPath, f"outputC-{identifier}-{i}.png")
            sand2png(dataDict, i, pngPath)
        dataDict = resolveTxt(dPath)
        dataToTextOfCoord(
            os.path.join(
                dstPath,
                f"outputD-{identifier}-total.txt",
            ),
            dataDict,
        )
        for i in range(0, int(hours)):
            pngPath = os.path.join(dstPath, f"outputD-{identifier}-{i}.png")
            sand2png(dataDict, i, pngPath)

    except:
        traceback.print_exc()
        print("输入参数错误, 请输入文件 url")
