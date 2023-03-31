import fs from "fs";
import path from "path";

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

  files.forEach(function (file) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    } else {
      copyFolderSync(sourcePath, targetPath);
    }
  });
};
