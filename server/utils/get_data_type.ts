export const getDataType = (path: string) => {
  const pathSplited = path.split(".");
  const suffix: string = pathSplited[pathSplited.length - 1];

  const geomType = {
    gr3: "mesh",
  };

  if (suffix in geomType) {
    return geomType[suffix as keyof typeof geomType];
  } else {
    return "unknown";
  }
};
