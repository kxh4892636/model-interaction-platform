from osgeo import ogr
from osgeo import gdal
from typing import Union, Callable
import sys


def getJsonType(path: str) -> str:
    driver: ogr.Driver = ogr.GetDriverByName('GeoJSON')
    return 'unknown'


def getDataType(filePath: str):
    suffix: str = filePath.split('.')[-1]
    if ('uvet' in filePath):
        return 'uvet'
    # NOTE 如何表示一个函数
    suffix2Type: dict[str, Union[str, Callable[[str], str]]] = {
        'gr3': 'mesh', 'json': getJsonType(filePath)}

    if (suffix in suffix):
        return suffix2Type[suffix]
    else:
        return 'unknown'


if __name__ == '__main__':
    try:
        # sys.argv
        path = sys.argv[1]
        getDataType(path)
    except:
        print('输入参数错误, 请输入文件 url')
