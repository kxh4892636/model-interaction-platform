from osgeo import ogr
from typing import Union, Callable
import sys
import os
# NOTE python 类型注释如何表示一个函数


def getDataType(filePath: str) -> str:
    suffix: str = filePath.split('.')[-1]
    suffix2Type: dict[str, str] = {
        'gr3': 'mesh', 'dat': 'text', 'in': 'text', 'th': 'text', 'json': 'geojson', 'png': 'image'}

    if ('uvet' in filePath):
        return 'uvet'
    elif (suffix in suffix2Type):
        return suffix2Type[suffix]
    else:
        return 'text'


def getDataStyle(filePath: str) -> str:
    suffix: str = filePath.split('.')[-1]
    suffix2Type: dict[str, str] = {
        'gr3': 'raster', 'dat': 'text', 'in': 'text', 'th': 'text', 'json': 'text', 'png': 'raster'}
    if suffix == 'json' or suffix == 'shp':
        return getVectorStyle(filePath)
    elif ('uvet' in filePath):
        return 'uvet'
    elif (suffix in suffix2Type):
        return suffix2Type[suffix]
    else:
        return 'text'


def getVectorStyle(filePath: str) -> str:
    try:
        style = 'text'
        ds: ogr.DataSource = ogr.Open(filePath)
        layer: ogr.Layer = ds.GetLayer()
        geomTypecode = layer.GetGeomType()
        # TODO 0 和 100 以后或许会处理
        # NOTE code 对应意义yiji getGeomtype funciton
        code2Style = {0: 'text', 1: 'circle', 2: 'line', 3: 'fill',
                      4: 'circle', 5: 'line', 6: 'fill', 100: 'text'}
        if (geomTypecode in code2Style):
            style = code2Style[geomTypecode]
        return style
    except:
        return 'text'


if __name__ == '__main__':
    try:
        # sys.argv
        path = sys.argv[1]
        # path = r"D:\project\001_model_interaction_platform\data\case\test\input\mesh31.json"
        type = getDataType(path)
        style = getDataStyle(path)
        print(type, ',', style, sep='')
    except:
        print('输入参数错误, 请输入文件 url')
