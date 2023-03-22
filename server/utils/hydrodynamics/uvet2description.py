import sys
import json


def createDescription(dstPath: str, inputURL: str, outputURL: str, extent: list, maskURL: str, fileName: str) -> None:
    with open(dstPath, 'w', encoding='utf8') as f:
        jsonObject = {
            "input_url": inputURL,
            "output_url": outputURL,
            "column_num": 6,
            "headings": ["id", "x", "y", "p", "u", "v"],
            "coordinates": ["x", "y"],
            "velocities": ["u", "v"],
            "boundary": [float(extent[0]), float(extent[2]), float(extent[1]), float(extent[3])],
            "resolution": 512,
            "outlier": -99999.0,
            "vector_mask": maskURL,
            "files": [
                {
                    "in": fileName,
                    "sn": fileName.split('uvet_')[-1].split('.txt')[0]
                },
            ]
        }
        json.dump(jsonObject, f)


if __name__ == '__main__':
    # os.environ['PROJ_LIB'] = r"C:\Users\kxh\AppData\Local\Programs\Python\Python310\Lib\site-packages\osgeo\data\proj"
    try:
        # sys.argv
        [dst, inputURL, outputURL, extent, mask, fileName] = sys.argv[1:7]
        # dst = r"D:\project\001_model_interaction_platform\data\test\uvet2description\description.json"
        # mask = "../../mask/mesh31.shp"
        # inputURL = 'temp/model/hydrodynamics/transform/uvet/txt/'
        # outputURL = 'temp/model/hydrodynamics/transform/uvet/uv/'
        # fileName = 'uvet_0.txt'
        # extent = "119.5498985092223,120.21745091964257,26.34525050928077,26.972279065373204"
        createDescription(dst, inputURL, outputURL,
                          extent.split(','), mask, fileName)
    except:
        print('输入参数错误, 请输入文件 url')
    # TODO
