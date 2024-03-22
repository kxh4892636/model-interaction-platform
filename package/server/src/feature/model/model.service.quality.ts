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

const preQuality = async (
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
  const titles: string[] = [
    '溶解氧',
    'BOD',
    '浮游植物',
    '氨氮',
    '硝酸盐氮',
    '有机氮',
    '无机磷',
    '有机磷',
  ]
  for (let index = 0; index < titles.length; index++) {
    const id = randomUUID()
    const tndPath = path.join(datasetPath, `model/tnd${index + 1}.dat`)
    await dataDao.createData(
      tndPath,
      `${index}_${titles[index]}`,
      id,
      'raster',
      'tnd',
      meshExtent,
      [],
      timeStamp,
    )
    await projectDao.createProjectDataset(projectID, datasetID, timeStamp)
    await datasetDao.createDatasetData(datasetID, id, timeStamp)
  }

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

const runQuality = async (
  datasetPath: string,
  pids: number[],
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const modelPath = path.join(
    DATA_FOLDER_PATH,
    datasetPath,
    '/model/quality.exe',
  )
  const cp = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
    shell: true,
    windowsHide: true,
  })
  pids.push(cp.pid!)
  modelDao.updateModel(modelID, {
    pids,
  })
  cp.stdout!.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('time')) {
      progress.current += progress.per * 20
      modelDao.updateModel(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
  pids.shift()
}

const postQuality = async (
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
      path.join(process.cwd(), '/src/util/water/tnd.py'),
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

export const quality = async (
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
    console.time('quality')
    // preprocess quality.exe
    console.timeLog('quality', 'model copy')
    await preQuality(
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
      total: 76 * hours,
    }
    // run quality model
    console.timeLog('quality', 'model start')
    const pids: number[] = []
    await runQuality(datasetPath, pids, modelID, progress)
    console.timeLog('quality', 'quality.exe finish')

    // postProcess quality
    await postQuality(modelID, datasetPath, hours, pids, progress)
    console.timeLog('quality', 'model end')
    console.log(progress)
    await modelDao.updateModel(modelID, {
      modelStatus: 0,
    })
  } catch (error) {
    console.trace(error)
    await stopModel(modelID as string)
  }
}
