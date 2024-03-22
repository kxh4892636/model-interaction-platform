import json
import os
import struct
import sys
import traceback


def createDescription(
    dstPath: str,
    inputURL: str,
    outputURL: str,
    extent: list,
    maskURL: str,
    num: int,
) -> None:
    files = []
    for i in range(0, num):
        files.append({"in": f"\\uvet_{i}.txt", "sn": f"{i}"})
    with open(dstPath, "w", encoding="utf8") as f:
        jsonObject = {
            "input_url": inputURL + "\\",
            "output_url": outputURL + "\\",
            "column_num": 6,
            "headings": ["id", "x", "y", "p", "u", "v"],
            "coordinates": ["x", "y"],
            "velocities": ["u", "v"],
            "boundary": [
                float(extent[0]),
                float(extent[2]),
                float(extent[1]),
                float(extent[3]),
            ],
            "resolution": 512,
            "outlier": -99999.0,
            "vector_mask": maskURL,
            "files": files,
        }
        json.dump(jsonObject, f)


def resolveCSV(csvPath: str) -> dict:
    dataDict: dict = {"num": 0, "data": []}
    with open(csvPath, "r", encoding="utf8") as f:
        dataDict["num"] = int(f.readline().split(",")[-1])
        data: list[tuple[str, str, str, str]] = []
        for line in f:
            content = line.split(",")
            if len(content) != 3:
                data.append((content[0], content[1], content[2], content[3]))
        dataDict["data"] = data

    return dataDict


def uvet2txt(uvetPath: str, dstPath: str, dataDict: dict, num: int):
    gridNum = dataDict["num"]
    data = dataDict["data"]
    uvet: list[str] = []
    # NOTE 二进制读取
    with open(uvetPath, "rb") as f:
        f.seek((4 + 24 * gridNum) * num)
        id: tuple = struct.unpack("i", f.read(4))
        for i in range(0, gridNum):
            petak: tuple = struct.unpack("d", f.read(8))
            uu2k: tuple = struct.unpack("d", f.read(8))
            vv2k: tuple = struct.unpack("d", f.read(8))
            uvet.append(
                " ".join(
                    [
                        data[i][0],
                        data[i][1],
                        data[i][2],
                        str(round(petak[0], 6)),
                        str(round(uu2k[0], 6)),
                        str(round(vv2k[0], 6)),
                    ]
                )
                + "\n"
            )

    # # NOTE suffix:04d
    with open(dstPath, "w", encoding="utf8") as ff:
        ff.write(f"{gridNum}\n")
        ff.write("id x y p u v\n")
        ff.writelines(uvet)


if __name__ == "__main__":
    try:
        [datasetPath, extent, num] = sys.argv[1:4]
        csvPath = os.path.join(datasetPath, "output\\mesh31.csv")
        uvetPath = os.path.join(datasetPath, "model\\uvet.dat")
        dstPath = os.path.join(datasetPath, "output")
        dataDict = resolveCSV(csvPath)
        for i in range(0, int(num)):
            uvet2txt(
                uvetPath,
                os.path.join(datasetPath, f"output\\uvet_{i}.txt"),
                dataDict,
                i,
            )
            print(i)
        descriptionPath = os.path.join(datasetPath, "output\\description.json")
        maskPath = os.path.join(datasetPath, "output\\mesh31.shp")
        createDescription(
            descriptionPath,
            dstPath,
            dstPath,
            extent.split(","),
            maskPath,
            int(num),
        )
    except:
        traceback.print_exc()
        print("输入参数错误, 请输入文件 url")
