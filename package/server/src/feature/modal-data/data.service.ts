import { getModelDataTypeAndStyle } from '@/util/water'
import { getModelDataExtentAndVisualization } from '@/util/water/getModelDataTypeAndStyle'
import { randomUUID } from 'crypto'
import path from 'path'
import { dataDao } from './data.dao'

export const dataService = {
  createData: async (
    projectPath: string,
    projectTree: Record<string, string[]>,
    datasetIDMap: Record<string, string>,
  ) => {
    const result: Record<string, string[]> = {}
    const timeStamp = Date.now().toString()
    const datasetNameList = Object.keys(projectTree)
    for (const datasetName of datasetNameList) {
      const datasetID = datasetIDMap[datasetName]
      result[datasetID] = []
      const dataNameList = projectTree[datasetName]
      for (const dataName of dataNameList) {
        const dataPath = path.join(projectPath, datasetName, 'input', dataName)
        const extname = path.extname(dataName)
        const [type, style] = getModelDataTypeAndStyle(dataName, extname)
        const [extent, visualization] = getModelDataExtentAndVisualization(
          dataName,
          extname,
        )
        const visualizationPathList = visualization.map((fileName) =>
          path.join(projectPath, 'output', fileName),
        )

        // import dataset
        const uuid = randomUUID()
        result[datasetID].push(uuid)
        await dataDao.createData(
          dataPath,
          dataName,
          uuid,
          style,
          type,
          extent,
          visualizationPathList,
          timeStamp,
        )
      }
    }

    return result
  },
}
