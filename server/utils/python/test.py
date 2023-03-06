# import json
# import os

# content = {
#     "input_url": "resource/data/",
#     "output_url": "resource/result/",
#     "column_num": 6,
#     "headings": ["id", "x", "y", "p", "u", "v"],
#     "coordinates": ["x", "y"],
#     "velocities": ["u", "v"],
#     "boundary": [455178, 2915175, 521670, 2984655],
#     "resolution": 1024,
#     "outlier": -99999.0,
#     "vector_mask": "mask/mask.shp",
#     "files": [
#     ]
# }

# for curDir, folds, files in os.walk(r"D:\dev\FlowField_Builder\resource\data"):
#     for file in files:
#         if file.endswith('txt'):
#             content['files'].append(
#                 {'in': file, 'sn': file.removesuffix('.txt').split('_')[-1]})
#         else:
#             continue


# with open(r"D:\dev\FlowField_Builder\resource\test.json", 'w', encoding='utf8') as f:
#     json.dump(content, f)


import cv2
