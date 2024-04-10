import json
import os
import struct
import sys


def createDescription(
    dstPath: str,
    inputURL: str,
    outputURL: str,
    extent: list,
    maskURL: str,
    hours: int,
    identifier: str,
    suffix: str,
) -> None:
    files = []
    for i in range(0, hours):
        files.append(
            {"in": f"uvet-{suffix}-{identifier}-{i}.txt", "sn": f"{i}"}
        )
    with open(dstPath, "w", encoding="utf8") as f:
        jsonObject = {
            "identifier": identifier,
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

    with open(dstPath, "w", encoding="utf8") as ff:
        ff.write(f"{gridNum}\n")
        ff.write("id x y p u v\n")
        ff.writelines(uvet)


if __name__ == "__main__":
    [modelFolderPath, extent, hours, identifier] = sys.argv[1:5]
    csvPath = os.path.join(modelFolderPath, "f0.csv")
    dstPath = os.path.join(modelFolderPath)
    dataDict = resolveCSV(csvPath)
    suffixList = ["down", "middle", "up"]
    for i in range(0, 3):
        uvetPath = os.path.join(modelFolderPath, f"uvet_{suffixList[i]}.dat")
        for j in range(0, int(hours)):
            uvet2txt(
                uvetPath,
                os.path.join(
                    modelFolderPath,
                    f"uvet-{suffixList[i]}-{identifier}-{j}.txt",
                ),
                dataDict,
                j,
            )
            print(j)
        descriptionPath = os.path.join(
            modelFolderPath, f"description-{suffixList[i]}-{identifier}.json"
        )
        maskPath = os.path.join(modelFolderPath, "f0.shp")
        createDescription(
            descriptionPath,
            dstPath,
            dstPath,
            extent.split(","),
            maskPath,
            int(hours),
            identifier,
            suffixList[i],
        )
