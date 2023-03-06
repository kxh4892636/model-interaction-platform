from osgeo import osr, ogr


path = r"D:\project\001_model_interaction_platform\data\case\test\input\mesh31.gr3"
info: list[list[str]] = []
with open(path, 'r', encoding='utf8')as f:
    for line in f:
        # NOTE split() 用法
        content = line.split()
        splitNum = len(content)
        if splitNum == 2:
            continue
        elif splitNum == 4:
            info.append(content)
        elif splitNum == 5:
            break

driver: ogr.Driver = ogr.GetDriverByName('ESRI Shapefile')
ds: ogr.DataSource = driver.CreateDataSource('../../../../temp.shp')
srs: osr.SpatialReference = osr.SpatialReference()
srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
srs.ImportFromEPSG(2437)
srs.SetTM(clat=0, clong=120, scale=1, fe=500000, fn=0)
dst: osr.SpatialReference = osr.SpatialReference()
dst.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
dst.ImportFromEPSG(4326)
layer: ogr.Layer = ds.CreateLayer(
    'mesh', dst, ogr.wkbPolygon, options=["ENCODING=UTF-8"])

ct: osr.CoordinateTransformation = osr.CoordinateTransformation(srs, dst)
featureDefn: ogr.FeatureDefn = layer.GetLayerDefn()
feature: ogr.Feature = ogr.Feature(featureDefn)
multiPoint: ogr.Geometry = ogr.Geometry(ogr.wkbMultiPoint)
for data in info:
    id = str(data[0])
    x = float(data[1])
    y = float(data[2])
    z = float(data[3])
    coords = ct.TransformPoint(x, y)
    # 生成 geometry
    point = ogr.Geometry(ogr.wkbPoint)
    point.AddPoint(coords[0], coords[1])
    # 赋值给矢量图层
    multiPoint.AddGeometry(point)
    del point

feature.SetGeometry(multiPoint.ConcaveHull(0.01,True))
layer.CreateFeature(feature)
