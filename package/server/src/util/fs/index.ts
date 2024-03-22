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
  try {
    if (!(await existsPromise(target))) {
      await fs.promises.mkdir(target)
    }
    const files = await fs.promises.readdir(source)
    const promises = files.map((file) => {
      const sourcePath = path.join(source, file)
      const targetPath = path.join(target, file)
      const promise = new Promise(async (resolve) => {
        const stats = await fs.promises.stat(sourcePath)
        if (stats.isDirectory()) {
          await copyFolder(sourcePath, targetPath)
          resolve(1)
        } else {
          await fs.promises.copyFile(sourcePath, targetPath)
          resolve(1)
        }
      })
      return promise
    })
    await Promise.all(promises)
  } catch (error) {
    console.error('文件夹复制失败', error)
  }
}

export const copySelectFilesInFolder = async (
  source: string,
  target: string,
  timeStamps: string[] = [],
) => {
  try {
    if (!(await existsPromise(target))) {
      await fs.promises.mkdir(target)
    } else;
    const files = await fs.promises.readdir(source)
    const promises = files.map((file) => {
      const sourcePath = path.join(source, file)
      const targetPath = path.join(target, file)
      const promise = new Promise(async (resolve) => {
        const stats = await fs.promises.stat(sourcePath)
        if (stats.isDirectory()) {
          await copySelectFilesInFolder(sourcePath, targetPath)
          resolve(1)
        } else {
          for (let index = 0; index < timeStamps.length; index++) {
            const timeStamp = timeStamps[index]
            if (sourcePath.includes(timeStamp))
              await fs.promises.copyFile(sourcePath, targetPath)
            else;
          }
          resolve(1)
        }
      })
      return promise
    })
    await Promise.all(promises)
    console.log('文件夹复制成功')
  } catch (error) {
    console.error('文件夹复制失败', error)
  }
}
