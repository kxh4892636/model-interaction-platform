import fs from "fs";
import path from "path";

export const existsPromise = async (filePath: string) => {
  try {
    await fs.promises.stat(filePath);
    return true;
  } catch {
    return false;
  }
};

/**
 * delete all files/folder in selected folder include selected folder
 * @param folderPath the path of folder
 */
export const deleteFolder = async (folderPath: string) => {
  try {
    const files = await fs.promises.readdir(folderPath);
    const promises = files.map((file) => {
      const promise = new Promise(async (resolve) => {
        const filePath = path.join(folderPath, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isDirectory()) {
          await deleteFolder(filePath);
          resolve(1);
        } else {
          await fs.promises.unlink(filePath);
          resolve(1);
        }
      });
      return promise;
    });
    await Promise.all(promises);
    await fs.promises.rmdir(folderPath);
    console.log("文件夹删除成功");
  } catch (error) {
    console.error("文件夹删除失败", error);
  }
};

/**
 * delete all files in selected fold exclude selected folder
 * @param folderPath the path of folder
 * @param filter the files (have suffix) that excluding delete eg. elcirc.exe
 */
export const deleteFolderFiles = async (folderPath: string, filter: string[] = []) => {
  try {
    const files = await fs.promises.readdir(folderPath);
    const promises = files.map((file) => {
      const filePath = path.join(folderPath, file);
      const promise = new Promise(async (resolve) => {
        const stat = await fs.promises.stat(filePath);
        if (stat.isDirectory()) {
          await deleteFolderFiles(filePath);
          resolve(1);
        } else {
          if (!filter.includes(file)) await fs.promises.unlink(filePath);
          else;
          resolve(1);
        }
      });
      return promise;
    });
    await Promise.all(promises);
    console.log("文件夹删除成功");
  } catch (error) {
    console.error("文件夹删除失败", error);
  }
};

/**
 * delete select files in selected fold
 * @param folderPath the path of folder
 * @param timeStamp the files timeStamp array that delete eg. 1680016885050
 */
export const deleteSelectFilesInFolder = async (folderPath: string, timeStamps: string[]) => {
  try {
    const files = await fs.promises.readdir(folderPath);
    const promises = files.map((file) => {
      const filePath = path.join(folderPath, file);
      const promise = new Promise(async (resolve) => {
        const stat = await fs.promises.stat(filePath);
        if (stat.isDirectory()) {
          await deleteSelectFilesInFolder(filePath, timeStamps);
          resolve(1);
        } else {
          for (let index = 0; index < timeStamps.length; index++) {
            const timeStamp = timeStamps[index];
            if (file.includes(timeStamp)) await fs.promises.unlink(filePath);
            else;
            resolve(1);
          }
        }
      });
      return promise;
    });
    await Promise.all(promises);
    console.log("文件夹删除成功");
  } catch (error) {
    console.error("文件夹删除失败", error);
  }
};

/**
 * copy selected folder to target path and auto create folder if folder is not exist
 * @param source the source path of folder
 * @param target the target path of folder
 */
export const copyFolder = async (source: string, target: string) => {
  try {
    if (!(await existsPromise(target))) {
      await fs.promises.mkdir(target);
    } else;
    const files = await fs.promises.readdir(source);
    const promises = files.map((file) => {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      const promise = new Promise(async (resolve) => {
        const stats = await fs.promises.stat(sourcePath);
        if (stats.isDirectory()) {
          await copyFolder(sourcePath, targetPath);
          resolve(1);
        } else {
          await fs.promises.copyFile(sourcePath, targetPath);
          resolve(1);
        }
      });
      return promise;
    });
    await Promise.all(promises);
    console.log("文件夹复制成功");
  } catch (error) {
    console.error("文件夹复制失败", error);
  }
};

/**
 * copy select files in selected fold and  create folder if folder is not exist
 * @param folderPath the path of folder
 * @param timeStamp the files timeStamp array that delete eg. 1680016885050
 */
export const copySelectFilesInFolder = async (
  source: string,
  target: string,
  timeStamps: string[] = []
) => {
  try {
    if (!(await existsPromise(target))) {
      await fs.promises.mkdir(target);
    } else;
    const files = await fs.promises.readdir(source);
    const promises = files.map((file) => {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      const promise = new Promise(async (resolve) => {
        const stats = await fs.promises.stat(sourcePath);
        if (stats.isDirectory()) {
          await copySelectFilesInFolder(sourcePath, targetPath);
          resolve(1);
        } else {
          for (let index = 0; index < timeStamps.length; index++) {
            const timeStamp = timeStamps[index];
            if (sourcePath.includes(timeStamp)) await fs.promises.copyFile(sourcePath, targetPath);
            else;
          }
          resolve(1);
        }
      });
      return promise;
    });
    await Promise.all(promises);
    console.log("文件夹复制成功");
  } catch (error) {
    console.error("文件夹复制失败", error);
  }
};
