import { createReadStream } from 'fs'
import { createInterface } from 'readline'

const getMeshDataByCoord = async (
  lng: number,
  lat: number,
  meshPath: string,
): Promise<number | null> => {
  let minD2 = Infinity
  let res = null
  const rl = createInterface(createReadStream(meshPath))

  for await (const line of rl) {
    const list = line.split(',').map((value) => Number(value))
    if (list.length === 2) continue
    if (list.length === 3) break
    const curLng = list[1]
    const curLat = list[2]
    const value = list[3]
    const curD2 = (curLng - lng) ** 2 + (curLat - lat) ** 2
    if (curD2 < minD2) {
      res = value
      minD2 = curD2
    }
  }

  return res
}

const start = Date.now()
await getMeshDataByCoord(
  118.94,
  25.01,
  'D:/project/fine-grained-simulation/package/node/src/mesh31.csv',
)
console.log(Date.now() - start)
