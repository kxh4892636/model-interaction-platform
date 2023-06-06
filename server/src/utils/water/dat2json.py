import sys
from osgeo import ogr, osr


def resolveCSV(csvPath: str) -> dict:
    dataDict: dict = {'num': 0, 'data': []}
    with open(csvPath, 'r', encoding='utf8') as f:
        dataDict['num'] = int(f.readline().split(',')[-1])
        data: list[tuple[str, str, str]] = []
        for line in f:
            content = line.replace('\n', '').split(',')
            if len(content) == 3:
                data.append((content[0], content[1], content[2]))
        dataDict['data'] = data

    return dataDict


def resolveDat(txtPath: str) -> list:
    ids = []
    with open(txtPath, 'r', encoding='utf8') as f:
        if ('cedian' in txtPath or 'toufang' in txtPath):
            f.readline()
        else:
            pass
        for line in f:
            content = line.split()
            splitNum = len(content)
            if (splitNum != 0):
                ids.append(content[0])
            else:
                pass

    return ids


def dat2json(dataDict: dict, ids: list[str], dstPath) -> None:
    driver: ogr.Driver = ogr.GetDriverByName('GeoJSON')
    ds: ogr.DataSource = driver.CreateDataSource(dstPath)
    srs: osr.SpatialReference = osr.SpatialReference()
    srs.ImportFromEPSG(4326)
    srs.SetAxisMappingStrategy(osr.OAMS_TRADITIONAL_GIS_ORDER)
    layer: ogr.Layer = ds.CreateLayer('point', srs, ogr.wkbPoint)
    layer.CreateField(ogr.FieldDefn('id', ogr.OFTInteger))
    featureDefn: ogr.FeatureDefn = layer.GetLayerDefn()
    for i in ids:
        i = int(i)
        feature: ogr.Feature = ogr.Feature(featureDefn)
        feature.SetField("id", i)
        geometry: ogr.Geometry = ogr.Geometry(ogr.wkbPoint)
        coord = [float(dataDict['data'][i][1]), float(dataDict['data'][i][2])]
        geometry.AddPoint(coord[0], coord[1])
        feature.SetGeometry(geometry)
        layer.CreateFeature(feature)
        del feature

    print("finish")
    del driver, ds, layer, srs, featureDefn


if __name__ == '__main__':
    try:
        # sys.argv
        # [mesh, txt, dst] = sys.argv[1:4]
        mesh = r"d:\project\001_model_interaction_platform\data\test\dat2json\mesh31.csv"
        txt = [
            r"d:\project\001_model_interaction_platform\data\test\dat2json\tang_info.dat",
            r"d:\project\001_model_interaction_platform\data\test\dat2json\in_node.dat",
            r"d:\project\001_model_interaction_platform\data\test\dat2json\cedian.dat",
            r"d:\project\001_model_interaction_platform\data\test\dat2json\toufang.dat",]
        dst = [
            r"d:\project\001_model_interaction_platform\data\test\dat2json\tang_info.json",
            r"d:\project\001_model_interaction_platform\data\test\dat2json\in_node.json",
            r"d:\project\001_model_interaction_platform\data\test\dat2json\cedian.json",
            r"d:\project\001_model_interaction_platform\data\test\dat2json\toufang.json",]
        dataDict = resolveCSV(mesh)
        for i in range(4):
            ids = resolveDat(txt[i])
            dat2json(dataDict, ids, dst[i])

        print('success')
    except:
        print('failed')
