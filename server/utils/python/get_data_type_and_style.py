from osgeo import ogr
from typing import Union, Callable
import sys
# NOTE python 类型注释如何表示一个函数
# geojson, image, video, mesh, uvet, model


def getDataType(filePath: str) -> str:
    suffix: str = filePath.split('.')[-1]

    suffix2Type: dict[str, str] = {
        'gr3': 'mesh', 'dat': 'model', 'in': 'model', 'th': 'model', 'json': 'geojson', 'png': 'image'}

    if (suffix in suffix2Type):
        return suffix2Type[suffix]
    else:
        return 'unknown'


def getDataStyle(filePath: str) -> str:
    suffix: str = filePath.split('.')[-1]
    if suffix != 'json':
        return ''
    else:
        style: str = ''
        return style


if __name__ == '__main__':
    try:
        # sys.argv
        path = sys.argv[1]
        type = getDataType(path)
        style = getDataStyle(path)
        print(type, ',', style, sep='')
    except:
        print('输入参数错误, 请输入文件 url')
