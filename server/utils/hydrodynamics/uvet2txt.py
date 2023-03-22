import sys
import struct


def resolveCSV(csvPath: str) -> dict:
    dataDict: dict = {'num': 0, 'data': []}
    with open(csvPath, 'r', encoding='utf8') as f:
        dataDict['num'] = int(f.readline().split(',')[-1])
        data: list[tuple[str, str, str, str]] = []
        for line in f:
            content = line.split(',')
            data.append((content[0], content[1],
                        content[2], content[3]))
        dataDict['data'] = data

    return dataDict


def uvet2txt(uvetPath: str, dstPath: str, dataDict: dict, num: int):
    gridNum = dataDict['num']
    data = dataDict['data']
    uvet: list[str] = []
    # NOTE 二进制读取
    with open(uvetPath, 'rb')as f:
        f.seek((4 + 24*gridNum)*num + 4)
        for i in range(0, gridNum):
            petak: tuple = struct.unpack('d', f.read(8))
            uu2k: tuple = struct.unpack('d', f.read(8))
            vv2k: tuple = struct.unpack('d', f.read(8))
            uvet.append(' '.join(
                [data[i][0], data[i][1], data[i][2], str(round(petak[0], 6)), str(round(uu2k[0], 6)), str(round(vv2k[0], 6))])+'\n')

    # # NOTE suffix:04d
    with open(dst.replace('uvet.txt', f"uvet_{num}.txt"), 'w', encoding='utf8') as ff:
        ff.write(f'{gridNum}\n')
        ff.write("id x y p u v\n")
        ff.writelines(uvet)


if __name__ == '__main__':
    # os.environ['PROJ_LIB'] = r"C:\Users\kxh\AppData\Local\Programs\Python\Python310\Lib\site-packages\osgeo\data\proj"
    try:
        # sys.argv
        [uvet, dst, csv, num] = sys.argv[1:5]
        # csv = r"d:\project\001_model_interaction_platform\data\test\uvet2txt\mesh31.csv"
        # uvet = r"d:\project\001_model_interaction_platform\data\test\uvet2txt\uvet.dat"
        # dst = r"d:\project\001_model_interaction_platform\data\test\uvet2txt\uvet.txt"
        # for i in range(0, 120):
        #     dataDict = resolveCSV(csv)
        #     uvet2txt(uvet, dst.replace(
        #         'uvet.txt', f"uvet_{i}.txt"), dataDict, i)
        dataDict = resolveCSV(csv)
        uvet2txt(uvet, dst, dataDict, int(num))
    except:
        print('输入参数错误, 请输入文件 url')
    # TODO
