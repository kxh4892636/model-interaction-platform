import os
import sys
from osgeo import gdal, ogr, osr


def resolveMesh(path: str) -> list:
    data: list[list[str]] = []
    with open(path, 'r', encoding='utf8')as f:
        for line in f:
            # NOTE split() 用法
            content = line.split()
            splitNum = len(content)
            if splitNum == 2:
                continue
            elif splitNum == 4:
                data.append(content)
            elif splitNum == 5:
                break

    return data


def Mesh2PNG(dataList: list[list[str]], dstPath: str) -> tuple:
    # 生成 shp 文件
    driver: ogr.Driver = ogr.GetDriverByName('ESRI Shapefile')
    ds: ogr.DataSource = driver.CreateDataSource('/vsimem/temp.shp')
    srs: osr.SpatialReference = osr.SpatialReference()
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    srs.ImportFromEPSG(2437)
    srs.SetTM(clat=0, clong=120, scale=1, fe=500000, fn=0)
    dst: osr.SpatialReference = osr.SpatialReference()
    dst.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    dst.ImportFromEPSG(4326)
    layer: ogr.Layer = ds.CreateLayer(
        'mesh', dst, ogr.wkbPoint, options=["ENCODING=UTF-8"])
    # 创建字段
    layer.CreateField(ogr.FieldDefn('ID', ogr.OFTString))
    layer.CreateField(ogr.FieldDefn('X', ogr.OFTReal))
    layer.CreateField(ogr.FieldDefn('Y', ogr.OFTReal))
    layer.CreateField(ogr.FieldDefn('Z', ogr.OFTReal))

    featureDefn: ogr.FeatureDefn = layer.GetLayerDefn()
    ct: osr.CoordinateTransformation = osr.CoordinateTransformation(srs, dst)
    for data in dataList:
        id = str(data[0])
        x = float(data[1])
        y = float(data[2])
        z = float(data[3])
        coords = ct.TransformPoint(x, y)
        # 录入数据
        feature: ogr.Feature = ogr.Feature(featureDefn)
        feature.SetField("ID", id)
        feature.SetField("X", coords[0])
        feature.SetField("Y", coords[1])
        feature.SetField("Z", z)
        # 生成 geometry
        point = ogr.Geometry(ogr.wkbPoint)
        point.AddPoint(coords[0], coords[1])
        # 赋值给矢量图层
        feature.SetGeometry(point)
        layer.CreateFeature(feature)
        del feature

    extent: tuple = layer.GetExtent()
    ratio = abs(((extent[3]-extent[2])/(extent[1]-extent[0])))
    del driver, ds

    driver: ogr.Driver = ogr.GetDriverByName('ESRI Shapefile')
    ds: ogr.DataSource = driver.CreateDataSource('/vsimem/mask.shp')
    layer: ogr.Layer = ds.CreateLayer(
        'mask', dst, ogr.wkbPolygon, options=["ENCODING=UTF-8"])
    featureDefn: ogr.FeatureDefn = layer.GetLayerDefn()
    feature: ogr.Feature = ogr.Feature(featureDefn)
    multiPoint: ogr.Geometry = ogr.Geometry(ogr.wkbMultiPoint)
    for data in dataList:
        x = float(data[1])
        y = float(data[2])
        coords = ct.TransformPoint(x, y)
        # 生成 geometry
        point = ogr.Geometry(ogr.wkbPoint)
        point.AddPoint(coords[0], coords[1])
        # 赋值给矢量图层
        multiPoint.AddGeometry(point)
        del point

    feature.SetGeometry(multiPoint.ConcaveHull(0.01, True))
    layer.CreateFeature(feature)

    # shp2tif
    gridOptions = gdal.GridOptions(format="GTiff", outputType=gdal.GDT_Float32,
                                   algorithm="invdist:power=2.0:smoothing=0.0:radius1=0.0:radius2=0.0:angle=0.0:max_points=100:min_points=30:nodata=-9999", zfield="Z",
                                   width=1000, height=ratio*1000,
                                   )
    gdal.Grid('/vsimem/temp_grid.tif', '/vsimem/temp.shp', options=gridOptions)
    ds: gdal.Dataset = gdal.Open('/vsimem/temp_grid.tif')
    band: gdal.Band = ds.GetRasterBand(1)
    minmax = band.ComputeRasterMinMax(0)
    warpOptions = gdal.WarpOptions(
        srcSRS=dst, dstSRS=dst, format='GTiff', cutlineDSName='/vsimem/mask.shp', cropToCutline=True)
    gdal.Warp('/vsimem/temp_warp.tif',
              '/vsimem/temp_grid.tif', options=warpOptions)
    translateOptions = gdal.TranslateOptions(format='GTiff',
                                             outputType=gdal.GDT_Byte,
                                             scaleParams=[
                                                 [minmax[0], minmax[1], 1, 255]],
                                             )
    gdal.Translate('/vsimem/temp_normalize.tif',
                   '/vsimem/temp_warp.tif',
                   options=translateOptions
                   )
    del band, ds
    ds: gdal.Dataset = gdal.Open('/vsimem/temp_normalize.tif')
    band: gdal.Band = ds.GetRasterBand(1)
    [min, max, mean, std] = band.ComputeStatistics(0)
    # create color table
    colors = gdal.ColorTable()
    colors.CreateColorRamp(int(min), (48, 18, 59),
                           int(mean-1.5*std), (70, 134, 251))
    colors.CreateColorRamp(int(mean-1.5*std), (70, 134, 251),
                           int(mean-std), (27, 229, 181))
    colors.CreateColorRamp(int(mean-std), (27, 229, 181),
                           int(mean), (164, 252, 60))
    colors.CreateColorRamp(int(mean), (164, 252, 60),
                           int(mean+std), (251, 185, 56))
    colors.CreateColorRamp(int(mean+std), (251, 185, 56),
                           int(mean+1.5*std), (227, 68, 10))
    colors.CreateColorRamp(int(mean+1.5*std), (227, 68, 10),
                           int(max), (122, 4, 3))
    # set color table and color interpretation
    band.SetRasterColorTable(colors)
    # band.SetRasterColorInterpretation(gdal.GCI_PaletteIndex)
    del band, ds
    translateOptions = gdal.TranslateOptions(format='PNG',
                                             )
    gdal.Translate(dstPath,
                   '/vsimem/temp_normalize.tif',
                   options=translateOptions
                   )

    return extent


if __name__ == '__main__':
    try:
        # sys.argv
        [src, dst] = sys.argv[1:3]
        # src = r"D:\project\001_model_interaction_platform\data\case\test\input\mesh31.gr3"
        # dst = r"D:\project\001_model_interaction_platform\data\case\test\input\mesh31.png"
        dataList = resolveMesh(src)
        extent: tuple = Mesh2PNG(dataList, dst)
        print(extent)
    except:
        print('输入参数错误, 请输入文件 url')
    # TODO
