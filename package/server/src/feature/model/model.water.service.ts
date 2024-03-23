/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DATA_FOLDER_PATH } from '@/config/env'
import { copyFolder, copySelectFilesInFolder } from '@/util/fs'
import { randomUUID } from 'crypto'
import { execa } from 'execa'
import { copyFile, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { datasetDao } from '../dataset/dataset.dao'
import { datasetService } from '../dataset/dataset.service'
import { dataDao } from '../modal-data/data.dao'
import { projectDao } from '../project/project.dao'
import { modelDao } from './model.dao'
import { ModelInfoType } from './model.type'

/**
 * Water model
 */
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
    false,
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

const runWaterEXE = async (
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

const runWater = async (
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
  const datasetID = await datasetService.createDataset(
    modelName,
    datasetPath,
    false,
    'pending',
  )
  const dataIDS = await datasetDao.getDataIDListOfDataset(paramsID)
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
  await runWaterEXE(datasetPath, pids, modelID, progress)
  console.timeLog('water', 'water.exe finish')

  // uvet-post
  await preUvetProcess(datasetPath, meshExtent, hours, pids, modelID, progress)
  console.timeLog('water', 'uvetPost.py finish')

  // uvet process
  await uvetProcess(datasetPath, pids, modelID, progress)
  console.timeLog('water', 'process.exe finish')

  console.timeLog('water', 'model end')
  console.log(progress)
  await modelDao.updateModel(modelID, {
    modelStatus: 0,
  })
  await datasetDao.updateDatasetStatus(datasetID, 'active')
}

/**
 * quality model
 */
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
      false,
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

const runQualityEXE = async (
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

const runQuality = async (
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
  const datasetID = await datasetService.createDataset(
    modelName,
    datasetPath,
    false,
    'pending',
  )
  const dataIDS = await datasetDao.getDataIDListOfDataset(paramsID)
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
  await runQualityEXE(datasetPath, pids, modelID, progress)
  console.timeLog('quality', 'quality.exe finish')

  // postProcess quality
  await postQuality(modelID, datasetPath, hours, pids, progress)
  console.timeLog('quality', 'model end')
  console.log(progress)
  await modelDao.updateModel(modelID, {
    modelStatus: 0,
  })
  await datasetDao.updateDatasetStatus(datasetID, 'active')
}

/**
 * sand model
 */
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
    false,
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
    false,
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

const runSandEXE = async (
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

const runSand = async (
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
  const datasetID = await datasetService.createDataset(
    modelName,
    datasetPath,
    false,
    'pending',
  )
  const dataIDS = await datasetDao.getDataIDListOfDataset(paramsID)

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
  await runSandEXE(datasetPath, pids, modelID, progress)
  console.timeLog('sand', 'sand.exe finish')

  // postProcess quality
  await postSand(modelID, datasetPath, hours, pids, progress)
  console.timeLog('sand', 'model end')
  console.log(progress)
  await modelDao.updateModel(modelID, {
    modelStatus: 0,
  })
  await datasetDao.updateDatasetStatus(datasetID, 'active')
}

const copyModelData = async (
  paramsID: string[],
  dstDatasetPath: string,
  uvetInfo?: {
    data_id: string
    data_name: string
    data_type: string
    data_style: string
    data_extent: number[]
    data_timestamp: string
    data_file_path: string
    data_input: boolean
    data_visualization: string[]
  },
) => {
  let meshExtent: number[] = []
  // copy exe
  await copyFolder(
    path.join(DATA_FOLDER_PATH, dstDatasetPath, '../water/model'),
    path.join(DATA_FOLDER_PATH, dstDatasetPath, 'model'),
  )
  await copyFolder(
    path.join(DATA_FOLDER_PATH, dstDatasetPath, '../sand/model'),
    path.join(DATA_FOLDER_PATH, dstDatasetPath, 'model'),
  )
  await copyFolder(
    path.join(DATA_FOLDER_PATH, dstDatasetPath, '../quality/model'),
    path.join(DATA_FOLDER_PATH, dstDatasetPath, 'model'),
  )
  // copy water model result and mesh31
  if (uvetInfo) {
    const uvetModelFolderPath = path.dirname(uvetInfo.data_file_path)
    await copySelectFilesInFolder(
      path.join(DATA_FOLDER_PATH, uvetModelFolderPath),
      path.join(DATA_FOLDER_PATH, dstDatasetPath, 'model'),
      ['et', 'vn', 'vt', 'mesh31', 'vgrid'],
    )
    await copySelectFilesInFolder(
      path.join(DATA_FOLDER_PATH, uvetModelFolderPath, '../output'),
      path.join(DATA_FOLDER_PATH, dstDatasetPath, 'output'),
      ['mesh31'],
    )
  }
  const promiseList = paramsID.map(async (dataID) => {
    const dataInfo = await dataDao.getDataInfo(dataID)
    if (!dataInfo) throw Error()
    // only in water model
    if (dataInfo.data_type === 'mesh') {
      meshExtent = dataInfo.data_extent
      await copyFolder(
        path.join(DATA_FOLDER_PATH, dataInfo.data_file_path, '../../output'),
        path.join(DATA_FOLDER_PATH, dstDatasetPath, 'output'),
      )
    }
    // other params
    const fileName = path.basename(dataInfo.data_file_path)
    const dstPath = path.join(dstDatasetPath, 'model', fileName)
    if (dataInfo.data_file_path !== dstPath) {
      await copyFile(
        path.join(DATA_FOLDER_PATH, dataInfo.data_file_path),
        path.join(DATA_FOLDER_PATH, dstPath),
      )
    }
  })
  await Promise.all(promiseList)
  return meshExtent
}

const stopModel = async (modelID: string) => {
  try {
    const modelInfo = await modelDao.getModal(modelID)
    if (!modelInfo) return false

    for (let index = 0; index < modelInfo!.model_pid.length; index++) {
      const pid = modelInfo!.model_pid[index]
      await execa(`taskkill /f /t /pid ${pid}`, {
        shell: true,
        windowsHide: true,
      }).catch(() => {
        //
      })
    }

    await modelDao.deleteModal(modelID)
    datasetService.deleteDataset(modelInfo!.model_dataset_id!)
    return true
  } catch (error) {
    return false
  }
}

const getModelInfo = async (modelID: string): Promise<ModelInfoType | null> => {
  const info = await modelDao.getModal(modelID)
  if (!info) return null
  const result: ModelInfoType = {
    modelDatasetID: info.model_dataset_id,
    modelID: info.model_id,
    modelStatus: info.model_status,
    progress: info.model_progress,
  }
  return result
}

export const modelService = {
  runModel: async (
    model: 'water' | 'quality' | 'sand',
    modelName: string,
    projectID: string,
    modelID: string,
    paramsID: string,
    hours: number,
    uvetID: string | null,
  ) => {
    const fnMap = {
      water: runWater,
      quality: runQuality,
      sand: runSand,
    }
    const fn = fnMap[model]
    await fn(modelName, projectID, modelID, paramsID, hours, uvetID || '')
  },
  stopModal: stopModel,
  getModelInfo,
}
