import os
from osgeo import gdal, ogr, osr


def resolveMesh(path: str) -> dict:
    info: dict[str, list] = {'num': [], 'data': []}
    with open(path, 'r', encoding='utf8')as f:
        for line in f:
            # NOTE split() 用法
            content = line.split()
            splitNum = len(content)
            if splitNum == 2:
                info['num'] = content
            elif splitNum == 4:
                info['data'].append(content)
            elif splitNum == 5:
                break

    return info


def Mesh2PNG(info: dict[str, list]) -> None:
    # 生成 shp 文件
    driver: ogr.Driver = ogr.GetDriverByName('ESRI Shapefile')
    ds: ogr.DataSource = driver.CreateDataSource('/vsimem/temp.shp')
    srs: osr.SpatialReference = osr.SpatialReference()
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    srs.ImportFromEPSG(3857)
    dst: osr.SpatialReference = osr.SpatialReference()
    dst.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    dst.ImportFromEPSG(4326)
    layer: ogr.Layer = ds.CreateLayer(
        'messh', dst, ogr.wkbPoint, options=["ENCODING=UTF-8"])
    # 创建字段
    layer.CreateField(ogr.FieldDefn('ID', ogr.OFTString))
    layer.CreateField(ogr.FieldDefn('X', ogr.OFTReal))
    layer.CreateField(ogr.FieldDefn('Y', ogr.OFTReal))
    layer.CreateField(ogr.FieldDefn('Z', ogr.OFTReal))

    dataList = info['data']
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

    extent = layer.GetExtent()
    ratio = abs(((extent[3]-extent[2])/(extent[1]-extent[0])))
    del driver, ds

    # shp2tiff
    gridOptions = gdal.GridOptions(format="GTiff", outputType=gdal.GDT_Int32,
                                   algorithm="invdist:power=2.0:smoothing=0.0:radius1=0.0:radius2=0.0:angle=0.0:max_points=100:min_points=30:nodata=-9999", zfield="Z",
                                   width=1000, height=ratio*1000,)
    gdal.Grid('/vsimem/temp.tiff', '/vsimem/temp.shp', options=gridOptions)
    ds: gdal.Dataset = gdal.Open('/vsimem/temp.tiff')
    band: gdal.Band = ds.GetRasterBand(1)
    minmax = band.ComputeRasterMinMax()
    translateOptions = gdal.TranslateOptions(format='Gtiff',
                                             outputType=gdal.GDT_Byte,
                                             scaleParams=[
                                                 [minmax[0], minmax[1], 1, 255]],
                                             )
    gdal.Translate('/vsimem/temp2.tiff',
                   '/vsimem/temp.tiff',
                   options=translateOptions
                   )
    del band, ds
    ds: gdal.Dataset = gdal.Open('/vsimem/temp2.tiff')
    band: gdal.Band = ds.GetRasterBand(1)
    minmax = band.ComputeRasterMinMax()
    [min, max, mean, std] = band.ComputeStatistics(0)
    # create color table
    colors = gdal.ColorTable()
    colors.CreateColorRamp(int(min), (48, 18, 59),
                           int(mean-2*std), (70, 134, 251))
    colors.CreateColorRamp(int(mean-2*std), (70, 134, 251),
                           int(mean-std), (27, 229, 181))
    colors.CreateColorRamp(int(mean-std), (27, 229, 181),
                           int(mean), (164, 252, 60))
    colors.CreateColorRamp(int(mean), (164, 252, 60),
                           int(mean+std), (251, 185, 56))
    colors.CreateColorRamp(int(mean+std), (251, 185, 56),
                           int(mean+2*std), (227, 68, 10))
    colors.CreateColorRamp(int(mean+2*std), (227, 68, 10),
                           int(max), (122, 4, 3))
    # set color table and color interpretation
    band.SetRasterColorTable(colors)
    # band.SetRasterColorInterpretation(gdal.GCI_PaletteIndex)
    del band, ds
    translateOptions = gdal.TranslateOptions(format='PNG',
                                             outputType=gdal.GDT_Byte,
                                             )
    gdal.Translate('./test.png',
                   '/vsimem/temp2.tiff',
                   options=translateOptions
                   )


if __name__ == '__main__':
    os.environ['PROJ_LIB'] = r'C:\Users\kxh48\AppData\Roaming\Python\Python39\site-packages\osgeo\data\proj'
    path = r"D:\project\001_model_interaction_platform\data\mesh31.gr3"
    data = resolveMesh(path)
    Mesh2PNG(data)
