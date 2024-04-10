import os
import sys


def resolveTriangleCsv(
    src: str,
) -> list[
    tuple[str, tuple[float, float], tuple[float, float], tuple[float, float]]
]:
    dataList: list[
        tuple[
            str, tuple[float, float], tuple[float, float], tuple[float, float]
        ]
    ] = []
    with open(src, "r", encoding="utf8") as f:
        f.readline()
        for line in f:
            content = line.split(",")
            dataList.append(
                (
                    str(content[0]),
                    (float(content[1]), float(content[2])),
                    (float(content[3]), float(content[4])),
                    (float(content[5]), float(content[6])),
                )
            )

    return dataList


def isInside(
    src: tuple[float, float],
    p1: tuple[float, float],
    p2: tuple[float, float],
    p3: tuple[float, float],
):
    def sign(p1, p2, p3):
        return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (
            p1[1] - p3[1]
        )

    d1 = sign(src, p1, p2)
    d2 = sign(src, p2, p3)
    d3 = sign(src, p3, p1)

    has_neg = (d1 < 0) or (d2 < 0) or (d3 < 0)
    has_pos = (d1 > 0) or (d2 > 0) or (d3 > 0)

    return not (has_neg and has_pos)


if __name__ == "__main__":
    [modelFolderPath, lng, lat] = sys.argv[1:4]
    trianglePath = os.path.join(modelFolderPath, "mesh31-triangle.csv")
    triangleData = resolveTriangleCsv(trianglePath)
    meshId = 0
    for data in triangleData:
        src = (float(lng), float(lat))
        p1 = data[1]
        p2 = data[2]
        p3 = data[3]
        tag = isInside(src, p1, p2, p3)
        if tag:
            meshId = p1[0]
            break
    print(meshId)
