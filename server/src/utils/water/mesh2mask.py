import sys
from osgeo import ogr, osr


def resolveCSV(src: str, dst: str) -> list[tuple[str, float, float, float]]:
    dataList: list[tuple[str, float, float, float]] = []
    with open(src, 'r', encoding='utf8') as f:
        f.readline()
        for line in f:
            content = line.split(',')
            if len(content) != 3:
                dataList.append((str(content[0]), float(content[1]),
                                float(content[2]), float(content[3])))

    return dataList


def mesh2mask(srcPath, dstPath: str) -> None:
    dataList = resolveCSV(srcPath, dstPath)

    # create the mask shp
    driver: ogr.Driver = ogr.GetDriverByName('ESRI Shapefile')
    ds: ogr.DataSource = driver.CreateDataSource(dstPath)
    srs: osr.SpatialReference = osr.SpatialReference()
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    srs.ImportFromEPSG(4326)
    layer: ogr.Layer = ds.CreateLayer(
        'mask', srs, ogr.wkbPolygon, options=["ENCODING=UTF-8"])
    layer.CreateField(ogr.FieldDefn('id', ogr.OFTInteger))
    # create feature that type is multiPoint
    featureDefn: ogr.FeatureDefn = layer.GetLayerDefn()
    feature: ogr.Feature = ogr.Feature(featureDefn)
    multiPoint: ogr.Geometry = ogr.Geometry(ogr.wkbMultiPoint)
    for data in dataList:
        x = float(data[1])
        y = float(data[2])
        # create geometry
        point = ogr.Geometry(ogr.wkbPoint)
        point.AddPoint(x, y)
        # set geometry
        multiPoint.AddGeometry(point)
        del point
    feature.SetField('id', 0)
    # create concaveHull
    feature.SetGeometry(multiPoint.ConcaveHull(0.01, True))
    layer.CreateFeature(feature)
    del driver, ds


if __name__ == '__main__':
    # os.environ['PROJ_LIB'] = r"C:\Users\kxh\AppData\Local\Programs\Python\Python310\Lib\site-packages\osgeo\data\proj"
    try:
        # sys.argv
        [src, dst] = sys.argv[1:3]
        # src = r"d:\project\001_model_interaction_platform\data\test\mesh2mask\mesh31.csv"
        # dst = r"d:\project\001_model_interaction_platform\data\test\mesh2mask\mesh31.shp"
        mesh2mask(src, dst)
    except:
        print('输入参数错误, 请输入文件 url')
