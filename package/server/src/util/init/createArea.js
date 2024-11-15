const init = async (infoList) => {
  const promiseList = []
  for (let i = 0; i < infoList.length; i++) {
    const info = infoList[i]
    promiseList.push(
      fetch('http://localhost:3456/api/v1/project/action', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          action: 'create',
          projectID: null,
          projectName: info.name,
          projectExtent: info.extent,
          modelType: info.modelType,
        }),
      }),
    )
  }
  await Promise.all(promiseList)
}

const info = [
  {
    name: '三沙湾',
    extent: [
      119.15840599362434, 25.999931525501694, 120.45330804196885,
      27.278875622206073,
    ],
    modelType: 'water-2d',
  },
  {
    name: '北海',
    extent: [
      108.5040599362434, 20.8099315255016, 110.55330804196885,
      21.98875622206073,
    ],
    modelType: 'water-3d',
  },
  {
    name: '三沙湾',
    extent: [
      119.15840599362434, 25.999931525501694, 120.45330804196885,
      27.278875622206073,
    ],
    modelType: 'quality-wasp',
  },
  {
    name: '湄洲',
    extent: [
      118.8040599362434, 24.5099315255016, 119.55330804196885,
      25.38875622206073,
    ],
    modelType: 'quality-phreec',
  },
  {
    name: '湄洲',
    extent: [
      118.8040599362434, 24.5099315255016, 119.55330804196885,
      25.38875622206073,
    ],
    modelType: 'quality-phreec-3d',
  },
  {
    name: '三沙湾',
    extent: [
      119.15840599362434, 25.999931525501694, 120.45330804196885,
      27.278875622206073,
    ],
    modelType: 'sand',
  },
  {
    name: '三沙湾',
    extent: [
      119.15840599362434, 25.999931525501694, 120.45330804196885,
      27.278875622206073,
    ],
    modelType: 'mud',
  },
  {
    name: '三沙湾',
    extent: [
      119.15840599362434, 25.999931525501694, 120.45330804196885,
      27.278875622206073,
    ],
    modelType: 'ewe',
  },
  {
    name: '三沙湾',
    extent: [
      119.15840599362434, 25.999931525501694, 120.45330804196885,
      27.278875622206073,
    ],
    modelType: 'water-ewe',
  },
  {
    name: '斯基克达',
    extent: [7.0, 36.8, 7.40330804196885, 37.227822206073],
    modelType: 'spoil',
  },
]

init(info)
