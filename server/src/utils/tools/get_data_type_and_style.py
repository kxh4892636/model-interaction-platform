from osgeo import ogr
import sys
# NOTE python 类型注释如何表示一个函数


def getDataType(filePath: str) -> str:
    type: dict = {
        'uvet': 'uvet', '.gr3': 'mesh', '.json': 'json', '.eweaccdb': 'ewemodel', '.ewemdb': 'ewemodel',"tang_info":'point',"in_node":'point',"cedian":'point',"toufang":'point'
    }
    for key, value in type.items():
        if (key in filePath):
            return value
        else:
            pass

    return 'text'


def getDataStyle(filePath: str) -> str:
    style: dict = {
        'uvet': 'uvet', '.gr3': 'raster', '.json': getVectorStyle(filePath), '.eweaccdb': 'echarts', '.ewemdb': 'echarts',"tang_info":'circle',"in_node":'circle',"cedian":'circle',"toufang":'circle'}

    for key, value in style.items():
        if (key in filePath):
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


# def getDataTypeAndStyleAndKind(filePath: str) -> tuple[str, str]:
#     try:
#         type = ''
#         style = ''
#         with open(filePath, 'r', encoding='utf8') as f:
#             content = ''
#             for i in range(20):
#                 line = f.readline()
#                 if not line:
#                     break
#                 content += line
#             if ('gr3' in filePath):
#                 type = 'mesh'
#                 style = 'raster'

#         return (type, style)
#     except:
#         return ('text', 'text')


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
        #          r"d:\project\001_model_interaction_platform\data\test\get_data_type_and_style\New model.eweaccdb",
        #          r"d:\project\001_model_interaction_platform\data\test\get_data_type_and_style\tang_info.dat",
        #          r"d:\project\001_model_interaction_platform\data\test\get_data_type_and_style\in_node.dat",
        #          r"d:\project\001_model_interaction_platform\data\test\get_data_type_and_style\cedian.dat",
        #          r"d:\project\001_model_interaction_platform\data\test\get_data_type_and_style\toufang.dat",
        #          ]
        # for path in paths:  
        #     type = getDataType(path)
        #     style = getDataStyle(path)
        #     print(type, ',', style, sep='')
    except:
        print('输入参数错误, 请输入文件 url')
