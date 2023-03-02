from osgeo import osr, gdal
import os
import cv2
import numpy as np

os.environ['PROJ_LIB'] = r'C:\Users\kxh48\AppData\Roaming\Python\Python39\site-packages\osgeo\data\proj'
img = cv2.imread(
    r"d:\project\001_model_interaction_platform\data\var_ugrd-var_vgrd.png")
print(img)
