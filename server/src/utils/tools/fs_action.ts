import fs from "fs";
import path from "path";

/**
 * delete all files/folder in selected folder include selected folder
 * @param folderPath the path of folder
 */
export const deleteFolderSync = (folderPath: string) => {
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);
      const states = fs.statSync(filePath);
      if (states.isDirectory()) {
        //recurse
        deleteFolderSync(filePath);
      } else {
        //delete file
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(folderPath);
  } else;
};

/**
 * delete all files in selected fold
 * @param folderPath the path of folder
 * @param filter the files (have suffix) that excluding delete eg. model.exe
 */
export const deleteFolderFilesSync = (folderPath: string, filter: string[] = []) => {
  if (!fs.existsSync(folderPath)) {
    return;
  } else;

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    if (fs.statSync(filePath).isFile()) {
      if (!filter.includes(file)) fs.unlinkSync(filePath);
      else;
    } else {
      deleteFolderFilesSync(filePath, filter);
    }
  });
};

/**
 * delete select files in selected fold
 * @param folderPath the path of folder
 * @param timeStamp the files timeStamp array that delete eg. 1680016885050
 */
export const deleteSelectFilesInFolderSync = (folderPath: string, timeStamps: string[]) => {
  if (!fs.existsSync(folderPath)) {
    return;
  } else;

  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isFile()) {
      timeStamps.forEach((timeStamp) => {
        if (file.includes(timeStamp)) fs.unlinkSync(filePath);
        else;
      });
    } else {
      deleteSelectFilesInFolderSync(filePath, timeStamps);
    }
  });
};

/**
 * copy selected folder to target path
 * @param source the source path of folder
 * @param target the target path of folder
 */
export const copyFolderSync = (source: string, target: string) => {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }
  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    } else {
      copyFolderSync(sourcePath, targetPath);
    }
  });
};

/**
 * copy select files in selected fold
 * @param folderPath the path of folder
 * @param timeStamp the files timeStamp array that delete eg. 1680016885050
 */
export const copySelectFilesInFolderSync = (
  source: string,
  target: string,
  timeStamps: string[] = []
) => {
  if (!fs.existsSync(source)) {
    return;
  } else;

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    if (fs.statSync(sourcePath).isFile()) {
      timeStamps.forEach((timeStamp) => {
        if (file.includes(timeStamp)) fs.copyFileSync(sourcePath, targetPath);
        else;
      });
    } else {
      copySelectFilesInFolderSync(sourcePath, targetPath, timeStamps);
    }
  });
};
