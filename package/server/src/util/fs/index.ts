/* eslint-disable no-async-promise-executor */
import fs from 'fs'
import path from 'path'

export const existsPromise = async (filePath: string) => {
  try {
    await fs.promises.stat(filePath)
    return true
  } catch {
    return false
  }
}

export const copyFolder = async (source: string, target: string) => {
  const stats = await fs.promises.stat(source)
  if (stats.isFile()) throw Error('the path of source is the file')
  if (!(await existsPromise(target))) {
    await fs.promises.mkdir(target)
  }
  const files = await fs.promises.readdir(source)
  const promises = files.map(async (file) => {
    const sourcePath = path.join(source, file)
    const targetPath = path.join(target, file)
    const stats = await fs.promises.stat(sourcePath)
    if (stats.isDirectory()) {
      await copyFolder(sourcePath, targetPath)
    } else {
      await fs.promises.copyFile(sourcePath, targetPath)
    }
  })
  await Promise.all(promises)
}

export const copySelectFilesInFolder = async (
  source: string,
  target: string,
  fileNameList: string[] = [],
) => {
  const stats = await fs.promises.stat(source)
  if (stats.isFile()) throw Error('the path of source is the file')
  if (!(await existsPromise(target))) {
    await fs.promises.mkdir(target)
  }
  const files = await fs.promises.readdir(source)
  const promises = files.map(async (file) => {
    const sourcePath = path.join(source, file)
    const targetPath = path.join(target, file)
    const stats = await fs.promises.stat(sourcePath)
    if (stats.isDirectory()) {
      await copySelectFilesInFolder(sourcePath, targetPath, fileNameList)
    } else {
      for (const fileName of fileNameList) {
        if (path.basename(sourcePath).includes(fileName)) {
          await fs.promises.copyFile(sourcePath, targetPath)
        }
      }
    }
  })
  await Promise.all(promises)
}
