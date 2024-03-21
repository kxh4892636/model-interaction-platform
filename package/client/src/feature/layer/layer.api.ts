import { LayerType } from '@/type'
import { extendFetch } from '@/util/api'
import { ProjectTreeResponseType, ProjectTreeType } from './layer.type'

const getProjectTreeFromServer = async (projectID: string) => {
  const result = await extendFetch(`/api/v1/project/tree/${projectID}`, {
    method: 'GET',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        return null
      }
    })
    .then((result: ProjectTreeResponseType) => {
      if (result.code) {
        return result.data
      } else {
        return null
      }
    })
    .catch(() => null)

  return result
}

export const generateProjectTreeData = async (projectID: string) => {
  const response = await getProjectTreeFromServer(projectID)
  if (!response) return null

  const loop = (origin: ProjectTreeType) => {
    const result: LayerType[] = origin.map((value) => {
      let children: LayerType[] = []
      if (value.children) {
        children = loop(value.children)
      }
      const result: LayerType = {
        children: children,
        group: value.group,
        input: value.isInput,
        key: value.key,
        style: value.layerStyle,
        title: value.title,
        type: value.layerType,
      }

      return result
    })

    return result
  }

  const result = loop(response)

  return result
}
