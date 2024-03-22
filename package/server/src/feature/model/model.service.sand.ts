/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DATA_FOLDER_PATH } from '@/config/env'
import { randomUUID } from 'crypto'
import { execa } from 'execa'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { datasetDao } from '../dataset/dataset.dao'
import { datasetService } from '../dataset/dataset.service'
import { dataDao } from '../modal-data/data.dao'
import { projectDao } from '../project/project.dao'
import { modelDao } from './model.dao'
import { copyModelData, stopModel } from './model.service'

const preSand = async (
  modelID: string,
  timeStamp: string,
  datasetID: string,
  uvetID: string,
  paramsID: string[],
  datasetPath: string,
  projectID: string,
  hours: number,
) => {
  // create model record
  await modelDao.createModel(modelID, timeStamp, datasetID)

  // copy model data
  const uvetInfo = await dataDao.getDataInfo(uvetID)
  if (!uvetInfo) throw Error()
  const meshExtent = await copyModelData(paramsID, datasetPath, uvetInfo)

  // create data record and dataset_data record
  const sndID = randomUUID()
  const sndPath = path.join(datasetPath, `model/snd.dat`)
  await dataDao.createData(
    sndPath,
    '泥沙',
    sndID,
    'raster',
    'snd',
    meshExtent,
    [],
    timeStamp,
  )
  await projectDao.createProjectDataset(projectID, datasetID, timeStamp)
  await datasetDao.createDatasetData(datasetID, sndID, timeStamp)
  const yujiID = randomUUID()
  const yujiPath = path.join(datasetPath, `model/yuji.dat`)
  await dataDao.createData(
    yujiPath,
    '淤积',
    yujiID,
    'raster',
    'yuji',
    meshExtent,
    [],
    timeStamp,
  )
  await projectDao.createProjectDataset(projectID, datasetID, timeStamp)
  await datasetDao.createDatasetData(datasetID, yujiID, timeStamp)

  // modify model param by hours
  const paramContent = (
    await readFile(
      path.join(DATA_FOLDER_PATH, datasetPath, '/model/wuran-gongkuang.dat'),
    )
  )
    .toString()
    .replace('56	60', `${hours / 24}	60`)
  await writeFile(
    path.join(DATA_FOLDER_PATH, datasetPath, '/model/wuran-gongkuang.dat'),
    paramContent,
  )
}

const runSand = async (
  datasetPath: string,
  pids: number[],
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const modelPath = path.join(DATA_FOLDER_PATH, datasetPath, '/model/sand.exe')
  const cp = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
    shell: true,
    windowsHide: true,
  })
  pids.push(cp.pid!)
  modelDao.updateModel(modelID, {
    pids,
  })
  cp.stdout!.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('SED')) {
      progress.current += progress.per * 20
      modelDao.updateModel(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
  pids.shift()
}

const postSand = async (
  modelID: string,
  datasetPath: string,
  hours: number,
  pids: number[],
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  // tnd2png
  const cp = execa(
    `conda activate gis && python ${[
      path.join(process.cwd(), '/src/util/water/sand.py'),
      path.join(DATA_FOLDER_PATH, datasetPath),
      hours,
    ].join(' ')}`,
    {
      shell: true,
      windowsHide: true,
    },
  )
  pids.push(cp.pid!)
  modelDao.updateModel(modelID, {
    pids,
  })
  cp.stderr!.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('clamped')) {
      progress.current += progress.per * 7
      modelDao.updateModel(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
  pids.shift()
}

export const sand = async (
  modelName: string,
  projectID: string,
  modelID: string,
  paramsID: string,
  hours: number,
  uvetID: string,
) => {
  const timeStamp = Date.now().toString()
  const projectInfo = await projectDao.getProject(projectID)
  if (!projectInfo) return null
  const datasetPath = path.join(projectInfo.project_folder_path, timeStamp)
  const datasetID = await datasetService.createDataset(modelName, datasetPath)
  const dataIDS = await datasetDao.getDataIDListOfDataset(paramsID)
  try {
    console.time('sand')
    // preprocess quality.exe
    console.timeLog('sand', 'model copy')
    await preSand(
      modelID,
      timeStamp,
      datasetID,
      uvetID,
      dataIDS,
      datasetPath,
      projectID,
      hours,
    )

    const progress = {
      current: 0,
      per: 1,
      total: 34 * hours,
    }
    // run quality model
    console.timeLog('sand', 'model start')
    const pids: number[] = []
    await runSand(datasetPath, pids, modelID, progress)
    console.timeLog('sand', 'sand.exe finish')

    // postProcess quality
    await postSand(modelID, datasetPath, hours, pids, progress)
    console.timeLog('sand', 'model end')
    console.log(progress)
    await modelDao.updateModel(modelID, {
      modelStatus: 0,
    })
  } catch (error) {
    console.trace(error)
    await stopModel(modelID as string)
  }
}
