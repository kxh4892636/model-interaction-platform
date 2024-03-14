import { ModelDataStyleType, ModelDataTypeType } from '@/type/model.type'

export const getModelDataTypeAndStyle = (
  fileName: string,
  extname: string,
): [ModelDataTypeType, ModelDataStyleType] => {
  const typeAndStyleMap: Map<string, [ModelDataTypeType, ModelDataStyleType]> =
    new Map([
      ['mesh31.gr3', ['mesh', 'raster']],
      ['paramhk.in', ['text', 'text']],
      ['gongkuang.dat', ['text', 'text']],
      ['sanshawan.th', ['text', 'text']],
      ['vgridhk.in', ['text', 'text']],
      ['wudaodi.dat', ['text', 'text']],
      ['wuran-gongkuang.dat', ['text', 'text']],
      ['初始浓度.dat', ['text', 'text']],
      ['wqm_para.dat', ['text', 'text']],
      ['vgridzsh.in', ['text', 'text']],
      ['tang_info.dat', ['geojson', 'circle']],
      ['in_node.dat', ['geojson', 'circle']],
      ['cedian.dat', ['geojson', 'circle']],
      ['toufang.dat', ['geojson', 'circle']],
      ['uvet.dat', ['uvet', 'uvet']],
      ['tcd.dat', ['tcd', 'raster']],
      ['tnd.dat', ['tnd', 'raster']],
      ['snd.dat', ['snd', 'raster']],
      ['yuji.dat', ['yuji', 'raster']],
      ['.image', ['image', 'raster']],
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

export const getModelDataExtentAndVisualization = (
  fileName: string,
  extname: string,
): [[number, number, number, number], string[]] | [[], []] => {
  const extentAndVisualization: Map<
    string,
    [[number, number, number, number], string[]]
  > = new Map([
    ['mesh31.gr3', [[119.54, 120.21, 26.34, 26.94], ['mesh31.image']]],
  ])

  const result = extentAndVisualization.get(fileName)

  return result || [[], []]
}
