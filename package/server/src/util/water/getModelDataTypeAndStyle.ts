import { ModelDataStyleType, ModelDataTypeType } from '@/type/model.type'

export const getModelDataTypeAndStyle = (
  fileName: string,
  extname: string,
): [ModelDataTypeType, ModelDataStyleType] => {
  const typeAndStyleMap: Map<string, [ModelDataTypeType, ModelDataStyleType]> =
    new Map([
      ['mesh31.gr3', ['mesh', 'raster']],
      ['paramhk.in', ['txt', 'txt']],
      ['gongkuang.dat', ['txt', 'txt']],
      ['sanshawan.th', ['txt', 'txt']],
      ['vgridhk.in', ['txt', 'txt']],
      ['wudaodi.dat', ['txt', 'txt']],
      ['wuran-gongkuang.dat', ['txt', 'txt']],
      ['初始浓度.dat', ['txt', 'txt']],
      ['wqm_para.dat', ['txt', 'txt']],
      ['vgridzsh.in', ['txt', 'txt']],
      ['tang_info.dat', ['geojson', 'circle']],
      ['in_node.dat', ['geojson', 'circle']],
      ['cedian.dat', ['geojson', 'circle']],
      ['toufang.dat', ['geojson', 'circle']],
      ['uvet.dat', ['uvet', 'uvet']],
      ['tcd.dat', ['tcd', 'raster']],
      ['tnd.dat', ['tnd', 'raster']],
      ['snd.dat', ['snd', 'raster']],
      ['yuji.dat', ['yuji', 'raster']],
      ['.png', ['png', 'raster']],
      ['.shp', ['shp', 'none']],
    ])

  const result0 = typeAndStyleMap.get(fileName)
  const result1 = typeAndStyleMap.get(extname)
  if (result0) {
    return result0
  } else {
    return result1 as [ModelDataTypeType, ModelDataStyleType]
  }
}
