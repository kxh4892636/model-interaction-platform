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

const preWater = async (
  modelID: string,
  projectID: string,
  timeStamp: string,
  datasetID: string,
  paramsID: string[],
  datasetPath: string,
  hours: number,
) => {
  // create model record
  await modelDao.createModel(modelID, timeStamp, datasetID)

  // copy model data
  const meshExtent = await copyModelData(paramsID, datasetPath)

  // create data record and dataset_data record
  const uvetPath = path.join(datasetPath, '/model/uvet.dat')
  const uvetID = randomUUID()
  await dataDao.createData(
    uvetPath,
    'uvet流场数据',
    uvetID,
    'uvet',
    'uvet',
    meshExtent,
    [],
    timeStamp,
  )
  await projectDao.createProjectDataset(projectID, datasetID, timeStamp)
  await datasetDao.createDatasetData(datasetID, uvetID, timeStamp)

  // modify model param by hours
  const paramContent = (
    await readFile(
      path.join(DATA_FOLDER_PATH, datasetPath, '/model/paramhk.in'),
    )
  )
    .toString()
    .replace('3  3.5', `${hours / 24}  3.5`)
  await writeFile(
    path.join(DATA_FOLDER_PATH, datasetPath, '/model/paramhk.in'),
    paramContent,
  )

  return meshExtent
}

const runWater = async (
  datasetPath: string,
  pids: number[],
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const modelPath = path.join(DATA_FOLDER_PATH, datasetPath, '/model/water.exe')
  const cp = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
    shell: true,
    windowsHide: true,
  })
  pids.push(cp.pid!)
  modelDao.updateModel(modelID, {
    pids,
  })
  cp.stdout!.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('nt,it')) {
      progress.current += progress.per * 27
      modelDao.updateModel(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
  pids.shift()
}

const preUvetProcess = async (
  datasetPath: string,
  meshExtent: number[],
  hours: number,
  pids: number[],
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const uvetPost = execa(
    `conda activate gis && python ${[
      path.join(process.cwd(), '/src/util/water/uvetPost.py'),
      path.join(DATA_FOLDER_PATH, datasetPath),
      meshExtent.join(','),
      hours,
    ].join(' ')}`,
    { shell: true, windowsHide: true },
  )
  pids.push(uvetPost.pid!)
  modelDao.updateModel(modelID, {
    pids,
  })
  uvetPost.stdout?.on('data', () => {
    progress.current += progress.per * hours
    modelDao.updateModel(modelID, {
      modelProgress: progress.current / progress.total,
    })
  })
  await uvetPost
  pids.shift()
}

const uvetProcess = async (
  datasetPath: string,
  pids: number[],
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const flow = execa(
    [
      path.join(process.cwd(), '/src/util/flowField/process.exe'),
      path.join(DATA_FOLDER_PATH, datasetPath, 'output/description.json'),
    ].join(' '),
    {
      shell: true,
      windowsHide: true,
    },
  )
  pids.push(flow.pid!)
  modelDao.updateModel(modelID, {
    pids,
  })
  flow.stdout?.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('SUCCESSED')) {
      progress.current += progress.per * 5
      modelDao.updateModel(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await flow
  pids.shift()
}

export const water = async (
  modelName: string,
  projectID: string,
  modelID: string,
  paramsID: string,
  hours: number,
) => {
  const timeStamp = Date.now().toString()
  const projectInfo = await projectDao.getProject(projectID)
  if (!projectInfo) return null
  const datasetPath = path.join(projectInfo.project_folder_path, timeStamp)
  const datasetID = await datasetService.createDataset(modelName, datasetPath)
  const dataIDS = await datasetDao.getDataIDListOfDataset(paramsID)
  try {
    console.time('water')
    // preprocess water.exe
    console.timeLog('water', 'model copy')
    const meshExtent = await preWater(
      modelID,
      projectID,
      timeStamp,
      datasetID,
      dataIDS,
      datasetPath,
      hours,
    )

    const progress = {
      current: 0,
      per: 1,
      total: 33 * hours,
    }
    // run water model
    console.timeLog('water', 'model start')
    const pids: number[] = []
    await runWater(datasetPath, pids, modelID, progress)
    console.timeLog('water', 'water.exe finish')

    // uvet-post
    await preUvetProcess(
      datasetPath,
      meshExtent,
      hours,
      pids,
      modelID,
      progress,
    )
    console.timeLog('water', 'uvetPost.py finish')

    // uvet process
    await uvetProcess(datasetPath, pids, modelID, progress)
    console.timeLog('water', 'process.exe finish')

    console.timeLog('water', 'model end')
    console.log(progress)
    await modelDao.updateModel(modelID, {
      modelStatus: 0,
    })
  } catch (error) {
    console.trace(error)
    await stopModel(modelID as string)
  }
}
