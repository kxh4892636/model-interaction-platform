/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DATA_FOLDER_PATH } from '@/config/env'
import { orm } from '@/dao'
import { existsPromise } from '@/util/fs'
import { randomUUID } from 'crypto'
import { execa } from 'execa'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { datasetService } from '../dataset/dataset.service'
import { dataDao } from '../model-data/data.dao'
import { modelDao } from './model.dao'
import { ModelInfoType } from './model.type'
import { getModelDataVisualization } from './model.util'

/**
 * Water model
 */
const setWater2DParam = async (projectID: string, hours: number) => {
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  // modify model param by hours
  const water2DPath = path.join(
    DATA_FOLDER_PATH,
    projectInfo.project_folder_path,
    'water-2d',
  )
  const paramhkPath = path.join(water2DPath, 'paramhk.in')
  const isExist = await existsPromise(paramhkPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(paramhkPath))
    .toString()
    .replace(/.* {2}3.5 {3}2.5/, `${hours / 24}  3.5   2.5`)
  await writeFile(paramhkPath, paramContent)
}

const preWater2D = async (
  modelID: string,
  datasetID: string,
  modelFolderPath: string,
  identifier: string,
) => {
  // create model record
  await orm.model.createModel(modelID, datasetID, -9999, 0, 'pending')

  // get mesh extent
  const isMeshExist = await existsPromise(
    path.join(DATA_FOLDER_PATH, modelFolderPath, 'mesh31.gr3'),
  )
  if (!isMeshExist) throw Error()
  const meshInfo = await modelDao.getMeshInfo(
    path.join(modelFolderPath, 'mesh31.gr3'),
  )
  if (!meshInfo) throw Error()
  const extent = meshInfo.data_extent

  // get hours
  const paramhkPath = path.join(DATA_FOLDER_PATH, modelFolderPath, 'paramhk.in')
  const isExist = await existsPromise(paramhkPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(paramhkPath))
    .toString()
    .match(/.*(?= {2}3.5 {3}2.5)/)
  if (!paramContent) throw Error()
  const hours = Math.round(Number(paramContent[0]) * 24)

  // create data record and dataset_data record
  const uvetPath = path.join(modelFolderPath, `uvet.dat`)
  const uvetID = randomUUID()
  const visualization = getModelDataVisualization(
    'water-2d',
    modelFolderPath,
    hours,
    identifier,
  )
  await dataDao.createData(
    datasetID,
    uvetID,
    'uvet流场数据',
    'uvet',
    'uvet',
    extent,
    identifier,
    uvetPath,
    'water-2d',
    visualization,
    'valid',
  )

  return {
    meshExtent: extent,
    hours,
  }
}

const runWater2DEXE = async (
  modelFolderPath: string,
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const exePath = path.join(DATA_FOLDER_PATH, modelFolderPath, 'water-2d.exe')
  const cp = execa(`cd ${path.dirname(exePath)} && ${exePath}`, {
    shell: true,
    windowsHide: true,
  })
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stdout!.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('nt,it')) {
      progress.current += progress.per * 27
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const preUvetProcess = async (
  modelFolderPath: string,
  meshExtent: number[],
  hours: number,
  identifier: string,
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
      path.join(DATA_FOLDER_PATH, modelFolderPath),
      meshExtent.join(','),
      hours,
      identifier,
    ].join(' ')}`,
    { shell: true, windowsHide: true },
  )
  orm.model.updateModelByModelID(modelID, {
    modelPid: uvetPost.pid,
  })
  uvetPost.stdout?.on('data', () => {
    progress.current += progress.per * hours
    orm.model.updateModelByModelID(modelID, {
      modelProgress: progress.current / progress.total,
    })
  })
  await uvetPost
}

const uvetProcess = async (
  modelFolderPath: string,
  modelID: string,
  identifier: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const flow = execa(
    [
      path.join(process.cwd(), '/src/util/flowField/process.exe'),
      path.join(
        DATA_FOLDER_PATH,
        modelFolderPath,
        `description-${identifier}.json`,
      ),
    ].join(' '),
    {
      shell: true,
      windowsHide: true,
    },
  )
  orm.model.updateModelByModelID(modelID, {
    modelPid: flow.pid,
  })
  flow.stdout?.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('SUCCESSED')) {
      progress.current += progress.per * 5
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await flow
}

const runWater2DModel = async (
  modelName: string,
  projectID: string,
  modelID: string,
) => {
  const identifier = Date.now().toString()
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  const modelFolderPath = path.join(projectInfo.project_folder_path, 'water-2d')
  const datasetID = randomUUID()
  await datasetService.createDataset(
    projectID,
    'water-2d',
    'water-2d-output',
    datasetID,
    modelName,
    'pending',
  )

  console.time('water')
  // preprocess water.exe
  console.timeLog('water', 'preprocess water-2d.exe')
  const { meshExtent, hours } = await preWater2D(
    modelID,
    datasetID,
    modelFolderPath,
    identifier,
  )

  // run water model
  const progress = {
    current: 0,
    per: 1,
    total: 33 * hours,
  }
  console.timeLog('water', 'run water-2d.exe')
  await runWater2DEXE(modelFolderPath, modelID, progress)
  console.timeLog('water', 'water-2d.exe finish')

  // uvet-post
  await preUvetProcess(
    modelFolderPath,
    meshExtent,
    hours,
    identifier,
    modelID,
    progress,
  )
  console.timeLog('water', 'uvetPost.py finish')

  // uvet process
  await uvetProcess(modelFolderPath, modelID, identifier, progress)
  console.timeLog('water', 'process.exe finish')

  console.timeLog('water', 'model finish')
  await orm.model.updateModelByModelID(modelID, {
    status: 'valid',
  })
  await orm.dataset.updateDatasetByDatasetID(datasetID, {
    status: 'valid',
  })
}

// /**
//  * quality model
//  */
// const preQuality = async (
//   modelID: string,
//   timeStamp: string,
//   datasetID: string,
//   uvetID: string,
//   paramsID: string[],
//   datasetPath: string,
//   projectID: string,
//   hours: number,
// ) => {
//   // create model record
//   await modelDao.createModel(modelID, timeStamp, datasetID)

//   // copy model data
//   const uvetInfo = await dataDao.getDataInfo(uvetID)
//   if (!uvetInfo) throw Error()
//   const meshExtent = await copyModelData(paramsID, datasetPath, uvetInfo)

//   // create data record and dataset_data record
//   const titles: string[] = [
//     '溶解氧',
//     'BOD',
//     '浮游植物',
//     '氨氮',
//     '硝酸盐氮',
//     '有机氮',
//     '无机磷',
//     '有机磷',
//   ]
//   for (let index = 0; index < titles.length; index++) {
//     const id = randomUUID()
//     const tndPath = path.join(datasetPath, `model/tnd${index + 1}.dat`)
//     const visualization = getModelDataVisualization(
//       'quality',
//       datasetPath,
//       hours,
//       index,
//     )
//     await dataDao.createData(
//       tndPath,
//       `${index}_${titles[index]}`,
//       false,
//       id,
//       'raster',
//       'tnd',
//       meshExtent,
//       visualization,
//       timeStamp,
//     )
//     await projectDao.createProjectDataset(projectID, datasetID, timeStamp)
//     await datasetDao.createDatasetData(datasetID, id, timeStamp)
//   }

//   // modify model param by hours
//   const paramContent = (
//     await readFile(
//       path.join(DATA_FOLDER_PATH, datasetPath, '/model/wuran-gongkuang.dat'),
//     )
//   )
//     .toString()
//     .replace('56	60', `${hours / 24}	60`)
//   await writeFile(
//     path.join(DATA_FOLDER_PATH, datasetPath, '/model/wuran-gongkuang.dat'),
//     paramContent,
//   )
// }

// const runQualityEXE = async (
//   datasetPath: string,
//   pids: number[],
//   modelID: string,
//   progress: {
//     current: number
//     per: number
//     total: number
//   },
// ) => {
//   const modelPath = path.join(
//     DATA_FOLDER_PATH,
//     datasetPath,
//     '/model/quality.exe',
//   )
//   const cp = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
//     shell: true,
//     windowsHide: true,
//   })
//   pids.push(cp.pid!)
//   modelDao.updateModel(modelID, {
//     pids,
//   })
//   cp.stdout!.on('data', (chunk) => {
//     if ((chunk.toString() as string).includes('time')) {
//       progress.current += progress.per * 20
//       modelDao.updateModel(modelID, {
//         modelProgress: progress.current / progress.total,
//       })
//     }
//   })
//   await cp
//   pids.shift()
// }

// const postQuality = async (
//   modelID: string,
//   datasetPath: string,
//   hours: number,
//   pids: number[],
//   progress: {
//     current: number
//     per: number
//     total: number
//   },
// ) => {
//   // tnd2png
//   const cp = execa(
//     `conda activate gis && python ${[
//       path.join(process.cwd(), '/src/util/water/tnd.py'),
//       path.join(DATA_FOLDER_PATH, datasetPath),
//       hours,
//     ].join(' ')}`,
//     {
//       shell: true,
//       windowsHide: true,
//     },
//   )
//   pids.push(cp.pid!)
//   modelDao.updateModel(modelID, {
//     pids,
//   })
//   cp.stderr!.on('data', (chunk) => {
//     if ((chunk.toString() as string).includes('clamped')) {
//       progress.current += progress.per * 7
//       modelDao.updateModel(modelID, {
//         modelProgress: progress.current / progress.total,
//       })
//     }
//   })
//   await cp
//   pids.shift()
// }

// const runQuality = async (
//   modelName: string,
//   projectID: string,
//   modelID: string,
//   paramsID: string,
//   hours: number,
//   uvetID: string,
// ) => {
//   const timeStamp = Date.now().toString()
//   const projectInfo = await projectDao.getProject(projectID)
//   if (!projectInfo) return null
//   const datasetPath = path.join(projectInfo.project_folder_path, timeStamp)
//   const datasetID = await datasetService.createDataset(
//     modelName,
//     datasetPath,
//     false,
//     'pending',
//   )
//   const dataIDS = await datasetDao.getDataIDListOfDataset(paramsID)
//   console.time('quality')
//   // preprocess quality.exe
//   console.timeLog('quality', 'model copy')
//   await preQuality(
//     modelID,
//     timeStamp,
//     datasetID,
//     uvetID,
//     dataIDS,
//     datasetPath,
//     projectID,
//     hours,
//   )

//   const progress = {
//     current: 0,
//     per: 1,
//     total: 76 * hours,
//   }
//   // run quality model
//   console.timeLog('quality', 'model start')
//   const pids: number[] = []
//   await runQualityEXE(datasetPath, pids, modelID, progress)
//   console.timeLog('quality', 'quality.exe finish')

//   // postProcess quality
//   await postQuality(modelID, datasetPath, hours, pids, progress)
//   console.timeLog('quality', 'model end')
//   console.log(progress)
//   await modelDao.updateModel(modelID, {
//     modelStatus: 0,
//   })
//   await datasetDao.updateDatasetStatus(datasetID, 'active')
// }

// /**
//  * sand model
//  */
// const preSand = async (
//   modelID: string,
//   timeStamp: string,
//   datasetID: string,
//   uvetID: string,
//   paramsID: string[],
//   datasetPath: string,
//   projectID: string,
//   hours: number,
// ) => {
//   // create model record
//   await modelDao.createModel(modelID, timeStamp, datasetID)

//   // copy model data
//   const uvetInfo = await dataDao.getDataInfo(uvetID)
//   if (!uvetInfo) throw Error()
//   const meshExtent = await copyModelData(paramsID, datasetPath, uvetInfo)

//   // create data record and dataset_data record
//   const visualization = getModelDataVisualization('sand', datasetPath, hours)
//   const sndID = randomUUID()
//   const sndPath = path.join(datasetPath, `model/snd.dat`)
//   await dataDao.createData(
//     sndPath,
//     '泥沙',
//     false,
//     sndID,
//     'raster',
//     'snd',
//     meshExtent,
//     visualization.slice(0, hours),
//     timeStamp,
//   )
//   await projectDao.createProjectDataset(projectID, datasetID, timeStamp)
//   await datasetDao.createDatasetData(datasetID, sndID, timeStamp)
//   const yujiID = randomUUID()
//   const yujiPath = path.join(datasetPath, `model/yuji.dat`)
//   await dataDao.createData(
//     yujiPath,
//     '淤积',
//     false,
//     yujiID,
//     'raster',
//     'yuji',
//     meshExtent,
//     visualization.slice(hours),
//     timeStamp,
//   )
//   await projectDao.createProjectDataset(projectID, datasetID, timeStamp)
//   await datasetDao.createDatasetData(datasetID, yujiID, timeStamp)

//   // modify model param by hours
//   const paramContent = (
//     await readFile(
//       path.join(DATA_FOLDER_PATH, datasetPath, '/model/wuran-gongkuang.dat'),
//     )
//   )
//     .toString()
//     .replace('56	60', `${hours / 24}	60`)
//   await writeFile(
//     path.join(DATA_FOLDER_PATH, datasetPath, '/model/wuran-gongkuang.dat'),
//     paramContent,
//   )
// }

// const runSandEXE = async (
//   datasetPath: string,
//   pids: number[],
//   modelID: string,
//   progress: {
//     current: number
//     per: number
//     total: number
//   },
// ) => {
//   const modelPath = path.join(DATA_FOLDER_PATH, datasetPath, '/model/sand.exe')
//   const cp = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
//     shell: true,
//     windowsHide: true,
//   })
//   pids.push(cp.pid!)
//   modelDao.updateModel(modelID, {
//     pids,
//   })
//   cp.stdout!.on('data', (chunk) => {
//     if ((chunk.toString() as string).includes('SED')) {
//       progress.current += progress.per * 20
//       modelDao.updateModel(modelID, {
//         modelProgress: progress.current / progress.total,
//       })
//     }
//   })
//   await cp
//   pids.shift()
// }

// const postSand = async (
//   modelID: string,
//   datasetPath: string,
//   hours: number,
//   pids: number[],
//   progress: {
//     current: number
//     per: number
//     total: number
//   },
// ) => {
//   // tnd2png
//   const cp = execa(
//     `conda activate gis && python ${[
//       path.join(process.cwd(), '/src/util/water/sand.py'),
//       path.join(DATA_FOLDER_PATH, datasetPath),
//       hours,
//     ].join(' ')}`,
//     {
//       shell: true,
//       windowsHide: true,
//     },
//   )
//   pids.push(cp.pid!)
//   modelDao.updateModel(modelID, {
//     pids,
//   })
//   cp.stderr!.on('data', (chunk) => {
//     if ((chunk.toString() as string).includes('clamped')) {
//       progress.current += progress.per * 7
//       modelDao.updateModel(modelID, {
//         modelProgress: progress.current / progress.total,
//       })
//     }
//   })
//   await cp
//   pids.shift()
// }

// const runSand = async (
//   modelName: string,
//   projectID: string,
//   modelID: string,
//   paramsID: string,
//   hours: number,
//   uvetID: string,
// ) => {
//   const timeStamp = Date.now().toString()
//   const projectInfo = await projectDao.getProject(projectID)
//   if (!projectInfo) return null
//   const datasetPath = path.join(projectInfo.project_folder_path, timeStamp)
//   const datasetID = await datasetService.createDataset(
//     modelName,
//     datasetPath,
//     false,
//     'pending',
//   )
//   const dataIDS = await datasetDao.getDataIDListOfDataset(paramsID)

//   console.time('sand')
//   // preprocess quality.exe
//   console.timeLog('sand', 'model copy')
//   await preSand(
//     modelID,
//     timeStamp,
//     datasetID,
//     uvetID,
//     dataIDS,
//     datasetPath,
//     projectID,
//     hours,
//   )

//   const progress = {
//     current: 0,
//     per: 1,
//     total: 34 * hours,
//   }
//   // run quality model
//   console.timeLog('sand', 'model start')
//   const pids: number[] = []
//   await runSandEXE(datasetPath, pids, modelID, progress)
//   console.timeLog('sand', 'sand.exe finish')

//   // postProcess quality
//   await postSand(modelID, datasetPath, hours, pids, progress)
//   console.timeLog('sand', 'model end')
//   console.log(progress)
//   await modelDao.updateModel(modelID, {
//     modelStatus: 0,
//   })
//   await datasetDao.updateDatasetStatus(datasetID, 'active')
// }

const stopModel = async (modelID: string) => {
  try {
    const modelInfo = await orm.model.getModelByModelID(modelID)
    if (!modelInfo) return false

    const pid = modelInfo!.model_pid
    await execa(`taskkill /f /t /pid ${pid}`, {
      shell: true,
      windowsHide: true,
    }).catch(() => {
      //
    })

    await orm.model.deleteModelByModelID(modelID)
    await datasetService.deleteDataset(modelInfo!.model_dataset_id!, false)
    return true
  } catch (error) {
    return false
  }
}

const getModelInfo = async (modelID: string): Promise<ModelInfoType | null> => {
  const info = await orm.model.getModelByModelID(modelID)
  if (!info) return null
  const result: ModelInfoType = {
    modelDatasetID: info.model_dataset_id,
    modelID: info.model_id,
    modelStatus: info.status,
    modelProgress: info.model_progress,
  }
  return result
}

export const modelService = {
  setWater2DParam,
  runWater2DModel,
  stopModel,
  getModelInfo,
}
