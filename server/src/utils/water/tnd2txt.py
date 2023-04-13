import os
import sys
import struct


def resolveCSV(csvPath: str) -> dict:
    dataDict: dict = {'num': 0, 'data': []}
    with open(csvPath, 'r', encoding='utf8') as f:
        dataDict['num'] = int(f.readline().split(',')[0])
        data: list[tuple[str, str, str]] = []
        for line in f:
            content = line.split(',')
            if len(content) == 3:
                data.append((content[0], content[1],
                            content[2].removesuffix('\n')))
        dataDict['data'] = data

    return dataDict


def tnd2txt(tndPath: str, dstPath: str, dataDict: dict, num: int):
    tinNum = dataDict['num']
    data = dataDict['data']
    tndData: list[str] = []
    # NOTE 二进制读取
    with open(tndPath, 'rb')as f:
        f.seek((4 + 8*tinNum)*num)
        id: tuple = struct.unpack('i', f.read(4))
        for i in range(0, tinNum):
            value: tuple = struct.unpack('d', f.read(8))
            tndData.append(' '.join(
                [data[i][0], data[i][1], data[i][2], str(round(value[0], 6))]) + '\n')

    # # NOTE suffix:04d
    with open(dstPath, 'w', encoding='utf8') as ff:
        ff.write(f'{tinNum}\n')
        ff.write("id x y z\n")
        ff.writelines(tndData)


if __name__ == '__main__':
    # os.environ['PROJ_LIB'] = r"C:\Users\kxh\AppData\Local\Programs\Python\Python310\Lib\site-packages\osgeo\data\proj"
    try:
        # sys.argv
        [tnd, dst, csv, num, timeStamp] = sys.argv[1:6]
        # tnd = r"d:\project\001_model_interaction_platform\data\test\tnd2txt\tnd1.dat"
        # csv = r"d:\project\001_model_interaction_platform\data\test\tnd2txt\mesh31.csv"
        # dst = r"d:\project\001_model_interaction_platform\data\test\tnd2txt"
        # num = "24"
        # timeStamp = '123456'
        dataDict = resolveCSV(csv)
        for i in range(0, int(num)):
            tnd2txt(
                tnd, dst + f"/{os.path.basename(tnd).split('.')[0]}_{timeStamp}_{i}.txt", dataDict, i)
    except:
        print('输入参数错误, 请输入文件 url')
