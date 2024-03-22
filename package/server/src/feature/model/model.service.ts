/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DATA_FOLDER_PATH } from '@/config/env'
import { copyFolder } from '@/util/fs'
import { randomUUID } from 'crypto'
import { execa } from 'execa'
import { copyFile, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { datasetDao } from '../dataset/dataset.dao'
import { datasetService } from '../dataset/dataset.service'
import { dataDao } from '../modal-data/data.dao'
import { projectDao } from '../project/project.dao'
import { modelDao } from './model.dao'

const copyWaterModelData = async (paramsID: string[], datasetPath: string) => {
  let meshExtent: number[] = []
  let meshID = ''
  const promiseList = paramsID.map(async (dataID) => {
    const dataInfo = await dataDao.getDataInfo(dataID)
    if (!dataInfo) throw Error()
    if (dataInfo.data_type === 'mesh') {
      meshExtent = dataInfo.data_extent
      meshID = dataInfo.data_id
      await copyFolder(
        path.join(DATA_FOLDER_PATH, dataInfo.data_file_path, '../../output'),
        path.join(DATA_FOLDER_PATH, datasetPath, 'output'),
      )
    }
    const fileName = path.basename(dataInfo.data_file_path)
    const dstPath = path.join(datasetPath, 'model', fileName)
    if (dataInfo.data_file_path !== dstPath) {
      await copyFile(
        path.join(DATA_FOLDER_PATH, dataInfo.data_file_path),
        path.join(DATA_FOLDER_PATH, dstPath),
      )
    }
  })
  await Promise.all(promiseList)
  return {
    meshID,
    meshExtent,
  }
}

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
  const { meshExtent } = await copyWaterModelData(paramsID, datasetPath)
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

const water = async (
  modelName: string,
  projectID: string,
  modelID: string,
  paramsID: string[],
  hours: number,
) => {
  const timeStamp = Date.now().toString()
  const projectInfo = await projectDao.getProject(projectID)
  if (!projectInfo) return null
  const datasetPath = path.join(projectInfo.project_folder_path, timeStamp)
  const datasetID = await datasetService.createDataset(modelName, datasetPath)
  try {
    // preprocess water.exe
    const meshExtent = await preWater(
      modelID,
      projectID,
      timeStamp,
      datasetID,
      paramsID,
      datasetPath,
      hours,
    )

    const progress = {
      current: 0,
      per: 1,
      total: 33 * hours,
    }
    // run water model
    console.time('water')
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
  } catch (error) {
    stopModal(modelID as string)
    throw Error('')
  }
}

const quality = async (
  modelName: string,
  projectID: string,
  modelID: string,
  paramsID: string[],
  uvetID: string,
  hours: number,
) => {
  const timeStamp = Date.now().toString()
  const projectInfo = await projectDao.getProject(projectID)
  if (!projectInfo) return null
  const datasetPath = path.join(projectInfo.project_folder_path, timeStamp)
  const datasetID = await datasetService.createDataset(modelName, datasetPath)
  try {
  } catch (error) {
    stopModal(modelID as string)
    throw Error('')
  }
}

const stopModal = async (modelID: string) => {
  try {
    const modelInfo = await modelDao.getModal(modelID)
    if (!modelInfo) return false

    for (let index = 0; index < modelInfo!.model_pid.length; index++) {
      const pid = modelInfo!.model_pid[index]
      await execa(`taskkill /f /t /pid ${pid}`, {
        shell: true,
        windowsHide: true,
      })
    }

    await modelDao.deleteModal(modelID)
    await datasetService.deleteDataset(modelInfo!.model_dataset_id!)
    return true
  } catch (error) {
    return false
  }
}

export const modelService = {
  water,
}
