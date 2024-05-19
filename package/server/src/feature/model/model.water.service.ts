/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DATA_FOLDER_PATH } from '@/config/env'
import { orm } from '@/dao'
import { existsPromise } from '@/util/fs'
import { randomUUID } from 'crypto'
import { execa } from 'execa'
import {
  copyFile,
  readFile,
  readdir,
  rename,
  stat,
  writeFile,
} from 'fs/promises'
import path from 'path'
import { datasetService } from '../dataset/dataset.service'
import { dataDao } from '../model-data/data.dao'
import { modelDao } from './model.dao'
import { ModelInfoType, ModelParamResponseSchema } from './model.type'
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
    .replace(/.*3.5.*2.5/, `${hours / 24} 3.5 2.5`)
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
    .match(/[\d.]*(?=.*3.5.*2.5)/)
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

  console.time(identifier)
  // preprocess water.exe
  console.timeLog(identifier, 'preprocess water-2d.exe')
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
  console.timeLog(identifier, 'run water-2d.exe')
  await runWater2DEXE(modelFolderPath, modelID, progress)
  console.timeLog(identifier, 'water-2d.exe finish')

  // uvet-post
  await preUvetProcess(
    modelFolderPath,
    meshExtent,
    hours,
    identifier,
    modelID,
    progress,
  )
  console.timeLog(identifier, 'uvetPost.py finish')

  // uvet process
  await uvetProcess(modelFolderPath, modelID, identifier, progress)
  console.timeLog(identifier, 'process.exe finish')

  console.timeLog(identifier, 'model finish')

  console.log(progress)
  await orm.model.updateModelByModelID(modelID, {
    status: 'valid',
  })
  await orm.dataset.updateDatasetByDatasetID(datasetID, {
    status: 'valid',
  })
}

/**
 * Water-2d pre exe
 */
const preRunWater2DModel = async (
  modelID: string,
  modelFolderPath: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  // validate param
  const isMeshExist = await existsPromise(
    path.join(DATA_FOLDER_PATH, modelFolderPath, 'mesh31.gr3'),
  )
  if (!isMeshExist) throw Error()
  const meshInfo = await modelDao.getMeshInfo(
    path.join(modelFolderPath, 'mesh31.gr3'),
  )
  if (!meshInfo) throw Error()
  const paramhkPath = path.join(DATA_FOLDER_PATH, modelFolderPath, 'paramhk.in')
  const isExist = await existsPromise(paramhkPath)
  if (!isExist) throw Error()

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
      progress.current += progress.per * 17
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

/**
 * water-3d model
 */
const setWater3DParam = async (projectID: string, hours: number) => {
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  // modify model param by hours
  const watereDPath = path.join(
    DATA_FOLDER_PATH,
    projectInfo.project_folder_path,
    'water-3d',
  )
  const paramhkPath = path.join(watereDPath, 'inputfile', 'param.in')
  const isExist = await existsPromise(paramhkPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(paramhkPath))
    .toString()
    .replace(/.*rnday/, `${hours / 24}  rnday`)
  await writeFile(paramhkPath, paramContent)
}

const preWater3D = async (
  modelID: string,
  datasetID: string,
  modelFolderPath: string,
  identifier: string,
) => {
  // create model record
  await orm.model.createModel(modelID, datasetID, -9999, 0, 'pending')

  // get mesh extent
  const isMeshExist = await existsPromise(
    path.join(DATA_FOLDER_PATH, modelFolderPath, 'inputfile', 'f0.gr3'),
  )
  if (!isMeshExist) throw Error()
  const meshInfo = await modelDao.getMeshInfo(
    path.join(modelFolderPath, 'inputfile', 'f0.gr3'),
  )
  if (!meshInfo) throw Error()
  const extent = meshInfo.data_extent

  // get hours
  const paramhkPath = path.join(
    DATA_FOLDER_PATH,
    modelFolderPath,
    'inputfile',
    'param.in',
  )
  const isExist = await existsPromise(paramhkPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(paramhkPath))
    .toString()
    .match(/[\d.]*(?=.*rnday)/)
  if (!paramContent) throw Error()
  const hours = Math.round(Number(paramContent[0]) * 24)

  // create data record and dataset_data record
  const visualization = getModelDataVisualization(
    'water-3d',
    modelFolderPath,
    hours,
    identifier,
  )
  const titleList = ['uvet_down', 'uvet_middle', 'uvet_up']
  for (let index = 0; index < 3; index++) {
    // uvet
    const uvetID = randomUUID()
    const uvetPath = path.join(modelFolderPath, `${titleList[index]}.dat`)
    await dataDao.createData(
      datasetID,
      uvetID,
      `${titleList[index]} 流场数据`,
      'uvet',
      'uvet',
      extent,
      identifier,
      uvetPath,
      'water-3d',
      visualization.slice(
        (1 + 3 * hours) * index,
        (1 + 3 * hours) * index + 1 + 3 * hours,
      ),
      'valid',
    )

    // snd
    const sndID = randomUUID()
    const sndPath = path.join(modelFolderPath, `snd${index + 1}.dat`)
    await dataDao.createData(
      datasetID,
      sndID,
      `${titleList[index]} 水质数据`,
      'snd',
      'raster',
      extent,
      identifier,
      sndPath,
      'water-3d',
      visualization.slice(
        (1 + 3 * hours) * 3 + hours * index,
        (1 + 3 * hours) * 3 + hours * index + hours,
      ),
      'valid',
    )
  }

  return {
    meshExtent: extent,
    hours,
  }
}

const runWater3DEXE = async (
  modelFolderPath: string,
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const exePath = path.join(DATA_FOLDER_PATH, modelFolderPath, 'water-3d.exe')
  const cp = execa(`cd ${path.dirname(exePath)} && ${exePath}`, {
    shell: true,
    windowsHide: true,
  })
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stdout!.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('nt,it')) {
      progress.current += progress.per * 51
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const preUvetProcess3D = async (
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
      path.join(process.cwd(), '/src/util/water/uvetPost3D.py'),
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

const uvetProcess3D = async (
  modelFolderPath: string,
  modelID: string,
  identifier: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const suffixList = ['down', 'middle', 'up']
  for (let index = 0; index < 3; index++) {
    // run exe
    const flow = execa(
      [
        path.join(process.cwd(), '/src/util/flowField/process.exe'),
        path.join(
          DATA_FOLDER_PATH,
          modelFolderPath,
          `description-${suffixList[index]}-${identifier}.json`,
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
    // rename
    const fileNameList = await readdir(
      path.join(DATA_FOLDER_PATH, modelFolderPath),
    )
    const promiseList = fileNameList.map(async (fileName) => {
      const filePath = path.join(DATA_FOLDER_PATH, modelFolderPath, fileName)
      const fileStat = await stat(filePath)
      if (fileStat.isDirectory()) return
      if (!(fileName.includes('.png') || fileName.includes('.json'))) return
      if (
        !(
          fileName.includes(`flow-field-description-${identifier}`) ||
          fileName.includes(`uv-${identifier}`) ||
          fileName.includes(`valid-${identifier}`) ||
          fileName.includes(`mask-${identifier}`)
        )
      ) {
        return
      }
      const renamePath = path.join(
        DATA_FOLDER_PATH,
        modelFolderPath,
        fileName.replace(/-(?=\d)/, `-${suffixList[index]}-`),
      )
      await rename(filePath, renamePath)
    })
    await Promise.all(promiseList)
  }
}

const postWater3DModel = async (
  modelFolderPath: string,
  hours: number,
  identifier: string,
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  // tnd2png
  const cp = execa(
    `conda activate gis && python ${[
      path.join(process.cwd(), '/src/util/water/quality3D.py'),
      path.join(DATA_FOLDER_PATH, modelFolderPath),
      hours,
      identifier,
    ].join(' ')}`,
    {
      shell: true,
      windowsHide: true,
    },
  )
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stderr!.on('data', (chunk) => {
    if ((chunk.toString() as string).toLowerCase().includes('clamped')) {
      progress.current += progress.per * 7
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const runWater3DModel = async (
  modelName: string,
  projectID: string,
  modelID: string,
) => {
  const identifier = Date.now().toString()
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  const modelFolderPath = path.join(projectInfo.project_folder_path, 'water-3d')
  const datasetID = randomUUID()
  await datasetService.createDataset(
    projectID,
    'water-3d',
    'water-3d-output',
    datasetID,
    modelName,
    'pending',
  )

  console.time(identifier)
  // preprocess water.exe
  console.timeLog(identifier, 'preprocess water-3d.exe')
  const { meshExtent, hours } = await preWater3D(
    modelID,
    datasetID,
    modelFolderPath,
    identifier,
  )

  // run water model
  const progress = {
    current: 0,
    per: 1,
    total: 88 * hours,
  }
  console.timeLog(identifier, 'run water-3d.exe')
  await runWater3DEXE(modelFolderPath, modelID, progress)
  console.timeLog(identifier, 'water-3d.exe finish')

  // uvet-precess
  await preUvetProcess3D(
    modelFolderPath,
    meshExtent,
    hours,
    identifier,
    modelID,
    progress,
  )
  console.timeLog(identifier, 'uvetPost3D.py finish')

  // uvet process
  console.timeLog(identifier, 'run process.exe')
  await uvetProcess3D(modelFolderPath, modelID, identifier, progress)
  console.timeLog(identifier, 'process.exe finish')

  // snd process
  await postWater3DModel(modelFolderPath, hours, identifier, modelID, progress)
  console.timeLog(identifier, 'model finish')

  console.log(progress)
  await orm.model.updateModelByModelID(modelID, {
    status: 'valid',
  })
  await orm.dataset.updateDatasetByDatasetID(datasetID, {
    status: 'valid',
  })
}

/**
 * quality-wasp model
 */
const setQualityWaspParam = async (projectID: string, hours: number) => {
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  // modify model param by hours
  const qualityWaspPath = path.join(
    DATA_FOLDER_PATH,
    projectInfo.project_folder_path,
    'quality-wasp',
  )
  // modify water-2d
  const paramhkPath = path.join(qualityWaspPath, 'paramhk.in')
  const isPramhkExist = await existsPromise(paramhkPath)
  if (!isPramhkExist) throw Error()
  const paramhkContent = (await readFile(paramhkPath))
    .toString()
    .replace(/.*3.5.*2.5/, `${(hours + 24) / 24} 3.5 2.5`)
  await writeFile(paramhkPath, paramhkContent)

  // modify quality-wasp
  const wuRanGongKuangPath = path.join(qualityWaspPath, 'wuran-gongkuang.dat')
  const isExist = await existsPromise(wuRanGongKuangPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(wuRanGongKuangPath))
    .toString()
    .replace(/.*60.*31/, `${hours / 24} 60 31`)
  await writeFile(wuRanGongKuangPath, paramContent)
}

const preQualityWasp = async (
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
  const wuRanGongKuangPath = path.join(
    DATA_FOLDER_PATH,
    modelFolderPath,
    'wuran-gongkuang.dat',
  )
  const isExist = await existsPromise(wuRanGongKuangPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(wuRanGongKuangPath))
    .toString()
    .match(/[\d.]*(?=.*60.*31)/)
  if (!paramContent) throw Error()
  const hours = Math.round(Number(paramContent[0]) * 24)

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
  const visualization = getModelDataVisualization(
    'quality-wasp',
    modelFolderPath,
    hours,
    identifier,
  )
  for (let index = 1; index <= 8; index++) {
    const tndID = randomUUID()
    const tndPath = path.join(modelFolderPath, `tnd${index}.dat`)
    await dataDao.createData(
      datasetID,
      tndID,
      `${index}_${titles[index - 1]}`,
      'tnd',
      'raster',
      extent,
      identifier,
      tndPath,
      'quality-wasp',
      visualization.slice(0 + hours * (index - 1), hours + hours * (index - 1)),
      'valid',
    )
  }

  return { hours }
}

const runQualityWaspEXE = async (
  modelFolderPath: string,
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const modelPath = path.join(
    DATA_FOLDER_PATH,
    modelFolderPath,
    'quality-wasp.exe',
  )
  const cp = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
    shell: true,
    windowsHide: true,
  })
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stdout!.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('time')) {
      progress.current += progress.per * 20
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const postQualityWasp = async (
  modelFolderPath: string,
  hours: number,
  identifier: string,
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  // tnd2png
  const cp = execa(
    `conda activate gis && python ${[
      path.join(process.cwd(), '/src/util/water/qualityWasp.py'),
      path.join(DATA_FOLDER_PATH, modelFolderPath),
      hours,
      identifier,
    ].join(' ')}`,
    {
      shell: true,
      windowsHide: true,
    },
  )
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stderr!.on('data', (chunk) => {
    if ((chunk.toString() as string).toLowerCase().includes('clamped')) {
      progress.current += progress.per * 7
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const runQualityWaspModel = async (
  modelName: string,
  projectID: string,
  modelID: string,
) => {
  const identifier = Date.now().toString()
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  const modelFolderPath = path.join(
    projectInfo.project_folder_path,
    'quality-wasp',
  )
  const datasetID = randomUUID()
  await datasetService.createDataset(
    projectID,
    'quality-wasp',
    'quality-wasp-output',
    datasetID,
    modelName,
    'pending',
  )

  console.time(identifier)
  // preprocess quality-wasp.exe
  console.timeLog(identifier, 'preprocess quality-wasp.exe')
  const { hours } = await preQualityWasp(
    modelID,
    datasetID,
    modelFolderPath,
    identifier,
  )

  // pre water-2d.exe
  const progress = {
    current: 0,
    per: 1,
    total: 93 * hours + 408,
  }
  console.timeLog(identifier, 'preprocess water-2d.exe')
  await preRunWater2DModel(modelID, modelFolderPath, progress)

  // run quality model
  console.timeLog(identifier, 'run quality-wasp.exe')
  await runQualityWaspEXE(modelFolderPath, modelID, progress)
  console.timeLog(identifier, 'quality-wasp.exe finish')

  // postProcess quality
  console.timeLog(identifier, 'run qualityWasp.py')
  await postQualityWasp(modelFolderPath, hours, identifier, modelID, progress)
  console.timeLog(identifier, 'model finish')

  console.log(progress)
  await orm.model.updateModelByModelID(modelID, {
    status: 'valid',
  })
  await orm.dataset.updateDatasetByDatasetID(datasetID, {
    status: 'valid',
  })
}

/**
 * quality-phreec model
 */
const setQualityPhreecParam = async (projectID: string, hours: number) => {
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  // modify model param by hours
  const qualityPhreecPath = path.join(
    DATA_FOLDER_PATH,
    projectInfo.project_folder_path,
    'quality-phreec',
  )
  // modify water-2d
  const paramhkPath = path.join(qualityPhreecPath, 'paramhk.in')
  const isPramhkExist = await existsPromise(paramhkPath)
  if (!isPramhkExist) throw Error()
  const paramhkContent = (await readFile(paramhkPath))
    .toString()
    .replace(/.*3.5.*2.5/, `${hours / 24} 3.5 2.5`)
  await writeFile(paramhkPath, paramhkContent)
}

const preQualityPhreec = async (
  modelID: string,
  datasetID: string,
  modelFolderPath: string,
  identifier: string,
) => {
  // create model record
  await orm.model.createModel(modelID, datasetID, -9999, 0, 'pending')

  // get hours
  const paramhkPath = path.join(DATA_FOLDER_PATH, modelFolderPath, 'paramhk.in')
  const isExist = await existsPromise(paramhkPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(paramhkPath))
    .toString()
    .match(/[\d.]*(?=.*3.5.*2.5)/)
  if (!paramContent) throw Error()
  const hours = Math.round(Number(paramContent[0]) * 24)

  // create data record and dataset_data record
  const visualization = getModelDataVisualization(
    'quality-phreec',
    modelFolderPath,
    hours,
    identifier,
  )
  const phID = randomUUID()
  const phPath = path.join(modelFolderPath, `PH2D.DAT`)
  await dataDao.createData(
    datasetID,
    phID,
    `PH值`,
    'ph',
    'raster',
    [],
    identifier,
    phPath,
    'quality-phreec',
    visualization.slice(1, hours + 1),
    'valid',
  )
  const meshID = randomUUID()
  const meshPath = path.join(modelFolderPath, `mesh20231218.gr3`)
  await dataDao.createData(
    datasetID,
    meshID,
    'mesh',
    'mesh',
    'raster',
    [],
    identifier,
    meshPath,
    'quality-phreec',
    [visualization[0]],
    'valid',
  )

  return { hours, ids: [phID, meshID] }
}

const copyQualityPhreecResult = async (modelFolderPath: string) => {
  const meshPath = path.join(
    DATA_FOLDER_PATH,
    modelFolderPath,
    'mesh20231218.gr3',
  )
  const phPath = path.join(DATA_FOLDER_PATH, modelFolderPath, 'PH2D.DAT')
  if (!(await existsPromise(meshPath))) {
    await copyFile(
      path.join(DATA_FOLDER_PATH, 'template/quality-phreec/mesh20231218.gr3'),
      meshPath,
    )
  }
  if (!(await existsPromise(phPath))) {
    await copyFile(
      path.join(DATA_FOLDER_PATH, 'template/quality-phreec/PH2D.DAT'),
      phPath,
    )
  }
}

const postQualityPhreec = async (
  modelFolderPath: string,
  hours: number,
  identifier: string,
  modelID: string,
  ids: string[],
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  // process mesh
  const { stdout } = await execa(
    `conda activate gis && python ${[
      path.join(process.cwd(), '/src/util/water/mesh.py'),
      path.join(DATA_FOLDER_PATH, modelFolderPath),
      'mesh20231218',
    ].join(' ')}`,
    { shell: true, windowsHide: true },
  )
  const extent = stdout
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map((value) => Number(value))

  // update ph extent
  for (const id of ids) {
    await orm.data.updateDataByDataID(id, {
      dataExtent: extent,
    })
  }
  // tnd2png
  const cp = execa(
    `conda activate gis && python ${[
      path.join(process.cwd(), '/src/util/water/phreec.py'),
      path.join(DATA_FOLDER_PATH, modelFolderPath),
      hours <= 48 ? hours : 48,
      identifier,
    ].join(' ')}`,
    {
      shell: true,
      windowsHide: true,
    },
  )
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stderr!.on('data', (chunk) => {
    if ((chunk.toString() as string).toLowerCase().includes('clamped')) {
      progress.current += progress.per * 7
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const runQualityPhreecModel = async (
  modelName: string,
  projectID: string,
  modelID: string,
) => {
  const identifier = Date.now().toString()
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  const modelFolderPath = path.join(
    projectInfo.project_folder_path,
    'quality-phreec',
  )
  const datasetID = randomUUID()
  await datasetService.createDataset(
    projectID,
    'quality-phreec',
    'quality-phreec-output',
    datasetID,
    modelName,
    'pending',
  )

  console.time(identifier)
  // preprocess quality-phreec.exe
  console.timeLog(identifier, 'preprocess quality-phreec.exe')
  const { hours, ids } = await preQualityPhreec(
    modelID,
    datasetID,
    modelFolderPath,
    identifier,
  )

  // pre water-2d.exe
  const progress = {
    current: 0,
    per: 1,
    total: 17 * hours + 7 * hours,
  }
  console.timeLog(identifier, 'preprocess water-2d.exe')
  await preRunWater2DModel(modelID, modelFolderPath, progress)

  // copy Model Result
  await copyQualityPhreecResult(modelFolderPath)

  // postprocess quality-phreec.exe
  await postQualityPhreec(
    modelFolderPath,
    hours,
    identifier,
    modelID,
    ids,
    progress,
  )

  await orm.model.updateModelByModelID(modelID, {
    status: 'valid',
  })
  await orm.dataset.updateDatasetByDatasetID(datasetID, {
    status: 'valid',
  })
}

/**
 * quality-phreec-3d model
 */
const setQualityPhreec3DParam = async (projectID: string, hours: number) => {
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  // modify model param by hours
  const qualityPhreec3DPath = path.join(
    DATA_FOLDER_PATH,
    projectInfo.project_folder_path,
    'quality-phreec-3d',
  )
  // modify water-2d
  const paramhkPath = path.join(qualityPhreec3DPath, 'paramhk.in')
  const isPramhkExist = await existsPromise(paramhkPath)
  if (!isPramhkExist) throw Error()
  const paramhkContent = (await readFile(paramhkPath))
    .toString()
    .replace(/.*3.5.*2.5/, `${hours / 24} 3.5 2.5`)
  await writeFile(paramhkPath, paramhkContent)
}

const preQualityPhreec3D = async (
  modelID: string,
  datasetID: string,
  modelFolderPath: string,
  identifier: string,
) => {
  // create model record
  await orm.model.createModel(modelID, datasetID, -9999, 0, 'pending')

  // get hours
  const paramhkPath = path.join(DATA_FOLDER_PATH, modelFolderPath, 'paramhk.in')
  const isExist = await existsPromise(paramhkPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(paramhkPath))
    .toString()
    .match(/[\d.]*(?=.*3.5.*2.5)/)
  if (!paramContent) throw Error()
  const hours = Math.round(Number(paramContent[0]) * 24)

  // create data record and dataset_data record
  const visualization = getModelDataVisualization(
    'quality-phreec-3d',
    modelFolderPath,
    hours,
    identifier,
  )
  const phIDs = []
  const phPath = path.join(modelFolderPath, `PH3D.DAT`)
  const phNameMap = ['表层', '中层', '底层']
  for (let i = 0; i < 3; i++) {
    const phID = randomUUID()
    phIDs.push(phID)
    await dataDao.createData(
      datasetID,
      phID,
      `${phNameMap[i]}PH值`,
      'ph',
      'raster',
      [],
      identifier,
      phPath,
      'quality-phreec-3d',
      visualization.slice(hours * i + 1, 1 + hours * (i + 1)),
      'valid',
    )
  }
  const meshID = randomUUID()
  const meshPath = path.join(modelFolderPath, `mesh20231218.gr3`)
  await dataDao.createData(
    datasetID,
    meshID,
    'mesh',
    'mesh',
    'raster',
    [],
    identifier,
    meshPath,
    'quality-phreec',
    [visualization[0]],
    'valid',
  )

  return { hours, ids: [...phIDs, meshID] }
}

const copyQualityPhreec3DResult = async (modelFolderPath: string) => {
  const meshPath = path.join(
    DATA_FOLDER_PATH,
    modelFolderPath,
    'mesh20231218.gr3',
  )
  const phPath = path.join(DATA_FOLDER_PATH, modelFolderPath, 'PH3D.DAT')
  if (!(await existsPromise(meshPath))) {
    await copyFile(
      path.join(
        DATA_FOLDER_PATH,
        'template/quality-phreec-3d/mesh20231218.gr3',
      ),
      meshPath,
    )
  }
  if (!(await existsPromise(phPath))) {
    await copyFile(
      path.join(DATA_FOLDER_PATH, 'template/quality-phreec-3d/PH3D.DAT'),
      phPath,
    )
  }
}

const postQualityPhreec3D = async (
  modelFolderPath: string,
  hours: number,
  identifier: string,
  modelID: string,
  ids: string[],
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  // process mesh
  const { stdout } = await execa(
    `conda activate gis && python ${[
      path.join(process.cwd(), '/src/util/water/mesh.py'),
      path.join(DATA_FOLDER_PATH, modelFolderPath),
      'mesh20231218',
    ].join(' ')}`,
    { shell: true, windowsHide: true },
  )
  const extent = stdout
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map((value) => Number(value))

  // update ph extent
  for (const id of ids) {
    await orm.data.updateDataByDataID(id, {
      dataExtent: extent,
    })
  }
  // tnd2png
  const cp = execa(
    `conda activate gis && python ${[
      path.join(process.cwd(), '/src/util/water/phreec3D.py'),
      path.join(DATA_FOLDER_PATH, modelFolderPath),
      hours <= 48 ? hours : 48,
      identifier,
    ].join(' ')}`,
    {
      shell: true,
      windowsHide: true,
    },
  )
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stderr!.on('data', (chunk) => {
    if ((chunk.toString() as string).toLowerCase().includes('clamped')) {
      progress.current += progress.per * 7
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const runQualityPhreec3DModel = async (
  modelName: string,
  projectID: string,
  modelID: string,
) => {
  const identifier = Date.now().toString()
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  const modelFolderPath = path.join(
    projectInfo.project_folder_path,
    'quality-phreec-3d',
  )
  const datasetID = randomUUID()
  await datasetService.createDataset(
    projectID,
    'quality-phreec-3d',
    'quality-phreec-3d-output',
    datasetID,
    modelName,
    'pending',
  )

  console.time(identifier)
  // preprocess quality-phreec.exe
  console.timeLog(identifier, 'preprocess quality-phreec-3d.exe')
  const { hours, ids } = await preQualityPhreec3D(
    modelID,
    datasetID,
    modelFolderPath,
    identifier,
  )

  // pre water-2d.exe
  const progress = {
    current: 0,
    per: 1,
    total: 17 * hours + 7 * hours * 3,
  }
  console.timeLog(identifier, 'preprocess water-2d.exe')
  // await preRunWater2DModel(modelID, modelFolderPath, progress)

  // copy Model Result
  await copyQualityPhreec3DResult(modelFolderPath)

  // postprocess quality-phreec-3d.exe
  await postQualityPhreec3D(
    modelFolderPath,
    hours,
    identifier,
    modelID,
    ids,
    progress,
  )

  await orm.model.updateModelByModelID(modelID, {
    status: 'valid',
  })
  await orm.dataset.updateDatasetByDatasetID(datasetID, {
    status: 'valid',
  })
}

/**
 * sand model
 */
const setSandParam = async (projectID: string, hours: number) => {
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  // modify model param by hours
  const qualityWaspPath = path.join(
    DATA_FOLDER_PATH,
    projectInfo.project_folder_path,
    'sand',
  )
  // modify water-2d
  const paramhkPath = path.join(qualityWaspPath, 'paramhk.in')
  const isPramhkExist = await existsPromise(paramhkPath)
  if (!isPramhkExist) throw Error()
  const paramhkContent = (await readFile(paramhkPath))
    .toString()
    .replace(/.*3.5.*2.5/, `${(hours + 24) / 24} 3.5 2.5`)
  await writeFile(paramhkPath, paramhkContent)

  // modify sand
  const wuRanGongKuangPath = path.join(qualityWaspPath, 'wuran-gongkuang.dat')
  const isExist = await existsPromise(wuRanGongKuangPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(wuRanGongKuangPath))
    .toString()
    .replace(/.*60.*31/, `${hours / 24} 60 31`)
  await writeFile(wuRanGongKuangPath, paramContent)
}

const preSand = async (
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
  const wuRanGongKuangPath = path.join(
    DATA_FOLDER_PATH,
    modelFolderPath,
    'wuran-gongkuang.dat',
  )
  const isExist = await existsPromise(wuRanGongKuangPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(wuRanGongKuangPath))
    .toString()
    .match(/[\d.]*(?=.*60.*31)/)
  if (!paramContent) throw Error()
  const hours = Math.round(Number(paramContent[0]) * 24)

  // create data record and dataset_data record
  const visualization = getModelDataVisualization(
    'sand',
    modelFolderPath,
    hours,
    identifier,
  )
  const sndID = randomUUID()
  const sndPath = path.join(modelFolderPath, `snd.dat`)
  await dataDao.createData(
    datasetID,
    sndID,
    `泥沙`,
    'snd',
    'raster',
    extent,
    identifier,
    sndPath,
    'sand',
    visualization.slice(0, hours),
    'valid',
  )
  const yujiID = randomUUID()
  const yujiPath = path.join(modelFolderPath, `yuji.dat`)
  await dataDao.createData(
    datasetID,
    yujiID,
    `淤积`,
    'yuji',
    'raster',
    extent,
    identifier,
    yujiPath,
    'sand',
    visualization.slice(hours),
    'valid',
  )

  return { hours }
}

const runSandEXE = async (
  modelFolderPath: string,
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const modelPath = path.join(DATA_FOLDER_PATH, modelFolderPath, 'sand.exe')
  const cp = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
    shell: true,
    windowsHide: true,
  })
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stdout!.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('SED')) {
      progress.current += progress.per * 20
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const postSand = async (
  modelFolderPath: string,
  hours: number,
  identifier: string,
  modelID: string,
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
      path.join(DATA_FOLDER_PATH, modelFolderPath),
      hours,
      identifier,
    ].join(' ')}`,
    {
      shell: true,
      windowsHide: true,
    },
  )
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stderr!.on('data', (chunk) => {
    if ((chunk.toString() as string).toLowerCase().includes('clamped')) {
      progress.current += progress.per * 7
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const runSandModel = async (
  modelName: string,
  projectID: string,
  modelID: string,
) => {
  const identifier = Date.now().toString()
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  const modelFolderPath = path.join(projectInfo.project_folder_path, 'sand')
  const datasetID = randomUUID()
  await datasetService.createDataset(
    projectID,
    'sand',
    'sand-output',
    datasetID,
    modelName,
    'pending',
  )

  console.time(identifier)
  // preprocess sand.exe
  console.timeLog(identifier, 'preprocess sand.exe')
  const { hours } = await preSand(
    modelID,
    datasetID,
    modelFolderPath,
    identifier,
  )

  // pre water-2d.exe
  const progress = {
    current: 0,
    per: 1,
    total: 51 * hours + 408,
  }
  console.timeLog(identifier, 'preprocess water-2d.exe')
  await preRunWater2DModel(modelID, modelFolderPath, progress)

  // run sand model
  console.timeLog(identifier, 'run sand.exe')
  await runSandEXE(modelFolderPath, modelID, progress)
  console.timeLog(identifier, 'sand.exe finish')

  // postProcess quality
  console.timeLog(identifier, 'run sand.py')
  await postSand(modelFolderPath, hours, identifier, modelID, progress)
  console.timeLog(identifier, 'model finish')

  console.log(progress)
  await orm.model.updateModelByModelID(modelID, {
    status: 'valid',
  })
  await orm.dataset.updateDatasetByDatasetID(datasetID, {
    status: 'valid',
  })
}

/**
 * mud model
 */
const setMudParam = async (projectID: string, hours: number) => {
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  // modify model param by hours
  const qualityWaspPath = path.join(
    DATA_FOLDER_PATH,
    projectInfo.project_folder_path,
    'mud',
  )
  // modify water-2d
  const paramhkPath = path.join(qualityWaspPath, 'paramhk.in')
  const isPramhkExist = await existsPromise(paramhkPath)
  if (!isPramhkExist) throw Error()
  const paramhkContent = (await readFile(paramhkPath))
    .toString()
    .replace(/.*3.5.*2.5/, `${(hours + 12) / 24} 3.5 2.5`)
  await writeFile(paramhkPath, paramhkContent)

  // modify mud
  const wuRanGongKuangPath = path.join(qualityWaspPath, 'wuran-gongkuang.dat')
  const isExist = await existsPromise(wuRanGongKuangPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(wuRanGongKuangPath))
    .toString()
    .replace(/.*31.*day.*/, `${hours / 24},31,"day"`)
  await writeFile(wuRanGongKuangPath, paramContent)
}

const preMud = async (
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
  const wuRanGongKuangPath = path.join(
    DATA_FOLDER_PATH,
    modelFolderPath,
    'wuran-gongkuang.dat',
  )
  const isExist = await existsPromise(wuRanGongKuangPath)
  if (!isExist) throw Error()
  const paramContent = (await readFile(wuRanGongKuangPath))
    .toString()
    .match(/[\d.]*(?=,31,"day")/)
  if (!paramContent) throw Error()
  const hours = Math.round(Number(paramContent[0]) * 24)

  // create data record and dataset_data record
  const visualization = getModelDataVisualization(
    'mud',
    modelFolderPath,
    hours,
    identifier,
  )
  const titles: string[] = ['输出 - 1', '输出 - 2']
  for (let index = 1; index <= 2; index++) {
    const tndID = randomUUID()
    const tndPath = path.join(modelFolderPath, `tnd${index}.dat`)
    await dataDao.createData(
      datasetID,
      tndID,
      `${index}_${titles[index - 1]}`,
      'mud',
      'raster',
      extent,
      identifier,
      tndPath,
      'mud',
      visualization.slice(0 + hours * (index - 1), hours + hours * (index - 1)),
      'valid',
    )
  }

  return { hours }
}

const runMudEXE = async (
  modelFolderPath: string,
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  const modelPath = path.join(DATA_FOLDER_PATH, modelFolderPath, 'mud.exe')
  const cp = execa(`cd ${path.dirname(modelPath)} && ${modelPath}`, {
    shell: true,
    windowsHide: true,
  })
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stdout!.on('data', (chunk) => {
    if ((chunk.toString() as string).includes('time')) {
      progress.current += progress.per * 40
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const postMud = async (
  modelFolderPath: string,
  hours: number,
  identifier: string,
  modelID: string,
  progress: {
    current: number
    per: number
    total: number
  },
) => {
  // mud2png, same as quality-wasp.py
  const cp = execa(
    `conda activate gis && python ${[
      path.join(process.cwd(), '/src/util/water/mud.py'),
      path.join(DATA_FOLDER_PATH, modelFolderPath),
      hours,
      identifier,
    ].join(' ')}`,
    {
      shell: true,
      windowsHide: true,
    },
  )
  orm.model.updateModelByModelID(modelID, {
    modelPid: cp.pid,
  })
  cp.stderr!.on('data', (chunk) => {
    if ((chunk.toString() as string).toLowerCase().includes('clamped')) {
      progress.current += progress.per * 7
      orm.model.updateModelByModelID(modelID, {
        modelProgress: progress.current / progress.total,
      })
    }
  })
  await cp
}

const runMudModel = async (
  modelName: string,
  projectID: string,
  modelID: string,
) => {
  const identifier = Date.now().toString()
  const projectInfo = await orm.project.getProjectByProjectID(projectID)
  if (!projectInfo) throw Error()
  const modelFolderPath = path.join(projectInfo.project_folder_path, 'mud')
  const datasetID = randomUUID()
  await datasetService.createDataset(
    projectID,
    'mud',
    'mud-output',
    datasetID,
    modelName,
    'pending',
  )

  console.time(identifier)
  // preprocess mud.exe
  console.timeLog(identifier, 'preprocess mud.exe')
  const { hours } = await preMud(
    modelID,
    datasetID,
    modelFolderPath,
    identifier,
  )

  // pre water-2d.exe
  const progress = {
    current: 0,
    per: 1,
    total: 71 * hours + 204,
  }
  console.timeLog(identifier, 'preprocess water-2d.exe')
  await preRunWater2DModel(modelID, modelFolderPath, progress)

  // run mud model
  console.timeLog(identifier, 'run mud.exe')
  await runMudEXE(modelFolderPath, modelID, progress)
  console.timeLog(identifier, 'mud.exe finish')

  // postProcess quality
  console.timeLog(identifier, 'run mud.py')
  await postMud(modelFolderPath, hours, identifier, modelID, progress)
  console.timeLog(identifier, 'model finish')

  console.log(progress)
  await orm.model.updateModelByModelID(modelID, {
    status: 'valid',
  })
  await orm.dataset.updateDatasetByDatasetID(datasetID, {
    status: 'valid',
  })
}

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
    modelStatus: info.status as 'valid' | 'pending' | 'expire',
    modelProgress: info.model_progress,
  }
  return result
}

export const modelService = {
  setWater2DParam,
  setWater3DParam,
  setQualityWaspParam,
  setQualityPhreecParam,
  setQualityPhreec3DParam,
  setSandParam,
  setMudParam,
  runWater2DModel,
  runWater3DModel,
  runQualityWaspModel,
  runQualityPhreecModel,
  runQualityPhreec3DModel,
  runSandModel,
  runMudModel,
  stopModel,
  getModelInfo,
}
