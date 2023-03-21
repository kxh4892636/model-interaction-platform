import sys


def Mesh2CSV(src: str, dst) -> None:
    data: list[str] = []
    with open(src, 'r', encoding='utf8')as f:
        for line in f:
            # NOTE split() 用法
            content = line.split()
            splitNum = len(content)
            if splitNum == 2 or splitNum == 4:
                data.append(','.join(content)+'\n')
            elif splitNum == 5:
                break

    with open(dst, 'w', encoding='utf8') as f:
        f.writelines(data)


if __name__ == '__main__':
    try:
        # sys.argv
        [src, dst] = sys.argv[1:3]
        # src = r"d:\project\001_model_interaction_platform\data\test\mesh2csv\mesh31.gr3"
        # dst = r"d:\project\001_model_interaction_platform\data\test\mesh2csv\mesh31.csv"
        dataList = Mesh2CSV(src, dst)
        print('success')
    except:
        print('failed')
    # TODO
