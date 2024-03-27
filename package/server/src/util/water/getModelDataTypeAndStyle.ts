import { DATA_FOLDER_PATH } from '@/config/env'
import { WaterDataStyleType, WaterDataTypeType } from '@/type'
import { execa } from 'execa'
import path from 'path'

export const getModelDataTypeAndStyle = (
  relativeFilePath: string,
): [WaterDataTypeType, WaterDataStyleType] => {
  const typeAndStyleMap: Map<string, [WaterDataTypeType, WaterDataStyleType]> =
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
    ])

  const filePath = path.join(DATA_FOLDER_PATH, relativeFilePath)
  const fileName = path.basename(filePath)
  const result0 = typeAndStyleMap.get(fileName)
  if (result0) {
    return result0
  } else {
    return ['none', 'none']
  }
}

export const getModelDataExtentAndVisualization = async (
  relativeFilePath: string,
): Promise<[number[], string[]] | [[], []]> => {
  const filePath = path.join(DATA_FOLDER_PATH, relativeFilePath)
  const fileName = path.basename(filePath)

  const datToGeoJSON = async () => {
    await execa(
      `conda activate gis && python ${[
        path.join(process.cwd(), '/src/util/water/dat2json.py'),
        path.join(filePath),
      ].join(' ')}`,
      { shell: true, windowsHide: true },
    )
    return [[], [relativeFilePath.replace('.dat', '.json')]] as [
      number[],
      string[],
    ]
  }

  const fnMap: Record<string, () => Promise<[number[], string[]]>> = {
    'mesh31.gr3': async () => {
      const { stdout } = await execa(
        `conda activate gis && python ${[
          path.join(process.cwd(), '/src/util/water/mesh.py'),
          path.join(path.dirname(filePath)),
        ].join(' ')}`,
        { shell: true, windowsHide: true },
      )
      const extent = stdout
        .replace('(', '')
        .replace(')', '')
        .split(',')
        .map((value) => Number(value))
      return [extent, [relativeFilePath.replace('.gr3', '.png')]]
    },
    'tang_info.dat': datToGeoJSON,
    'in_node.dat': datToGeoJSON,
    'cedian.dat': datToGeoJSON,
    'toufang.dat': datToGeoJSON,
  }
  if (fileName in fnMap) {
    const result = await fnMap[fileName]()
    return result
  } else {
    return [[], []]
  }
}

// try {
//   const result = await getModelDataExtentAndVisualization(
//     'D:/project/fine-grained-simulation/data/project/1711453202195/water-2d/in_node.dat',
//   )
//   console.log(result)
// } catch (error) {
//   console.trace(error)
// }
