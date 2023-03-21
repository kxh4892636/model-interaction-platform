from osgeo import ogr
import sys
import os
# NOTE python 类型注释如何表示一个函数


def getDataType(filePath: str) -> str:
    type: dict = {
        'uvet.dat': 'uvet', '.gr3': 'mesh', '.json': 'json'
    }

    for key, value in type.items():
        if (filePath.endswith(key)):
            return value
        else:
            pass

    return 'text'


def getDataStyle(filePath: str) -> str:
    style: dict = {
        'uvet.dat': 'uvet', '.gr3': 'raster', '.json': getVectorStyle(filePath)}

    for key, value in style.items():
        if (filePath.endswith(key)):
            return value
        else:
            pass

    return 'text'


def getVectorStyle(filePath: str) -> str:
    try:
        style = 'text'
        ds: ogr.DataSource = ogr.Open(filePath)
        layer: ogr.Layer = ds.GetLayer()
        geomTypecode = layer.GetGeomType()
        # NOTE code 对应意义yiji getGeomtype funciton
        code2Style = {0: 'text', 1: 'circle', 2: 'line', 3: 'fill',
                      4: 'circle', 5: 'line', 6: 'fill', 100: 'text'}
        if (geomTypecode in code2Style):
            style = code2Style[geomTypecode]
        return style
    except:
        return 'text'


if __name__ == '__main__':
    # os.environ['PROJ_LIB'] = r"C:\Users\kxh\AppData\Local\Programs\Python\Python310\Lib\site-packages\osgeo\data\proj"
    try:
        # sys.argv
        path = sys.argv[1]
        type = getDataType(path)
        style = getDataStyle(path)
        print(type, ',', style, sep='')
        # paths = [r"d:\project\001_model_interaction_platform\data\test\get_data_type_and_style\uvet.dat",
        #          r"d:\project\001_model_interaction_platform\data\test\get_data_type_and_style\mesh31.gr3",
        #          r"d:\project\001_model_interaction_platform\data\test\get_data_type_and_style\mesh31.json",
        #          r"d:\project\001_model_interaction_platform\data\test\get_data_type_and_style\test.json",
        #          r"d:\project\001_model_interaction_platform\data\test\get_data_type_and_style\sanshawan.th",
        #          ]
        # for path in paths:
        #     type = getDataType(path)
        #     style = getDataStyle(path)
        #     print(type, ',', style, sep='')
    except:
        print('输入参数错误, 请输入文件 url')
