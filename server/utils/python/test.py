from osgeo import osr
import os

os.environ['PROJ_LIB'] = r'C:\Users\kxh48\AppData\Roaming\Python\Python39\site-packages\osgeo\data\proj'
srs: osr.SpatialReference = osr.SpatialReference()
srs.ImportFromEPSG(2437)
srs.SetTM(clat=0, clong=114, scale=1, fe=500000, fn=0)
print(srs.ExportToPrettyWkt())
