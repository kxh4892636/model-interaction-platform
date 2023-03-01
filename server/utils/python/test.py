from osgeo import osr
import os

path = r"D:\project\001_model_interaction_platform\data\case\test\transform"
num = 0

for cur_dir, folds, files in os.walk(path):
    for file in files:
        if file.endswith('.xml'):
            num += 1

print(num)
