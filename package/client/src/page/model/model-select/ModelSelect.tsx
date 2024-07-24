import { getProjectTreeAPI } from '@/api/project/project.api'
import { postEWEModelLoadAPI } from '@/api/model/model.api'
import { useMetaStore } from '@/store/metaStore'
import { WaterModelTypeType } from '@/type'
import EWE from '../model-ewe/Import'
import { eweFile } from '@/store/eweStore'
import { useEffect, useState } from 'react'

export const ModelSelect = () => {
  const modelType = useMetaStore((state) => state.modelType)
  const projectID = useMetaStore((state) => state.projectID)
  const [EWEresponse, setEWEresponse] = useState({})
  const [EWEflag, setEWEflag] = useState('')
  const setewefile = eweFile((state) => state.setData)
  const LoadEwEModel = async () => {
    let modelname = ''
    if (projectID) {
      const response = await getProjectTreeAPI(projectID)
      if (response.data) {
        response.data.forEach((element) => {
          if (element.modelType === 'ewe') {
            element.children.forEach((item) => {
              if (
                item.layerName.split('.')[1] === 'eweaccdb' ||
                item.layerName.split('.')[1] === 'EwEmdb'
              ) {
                modelname = item.layerName
              }
            })
          }
        })
      }
    }
    if (modelname !== '') {
      const LoadResponse = await postEWEModelLoadAPI({
        projectID: projectID as string,
        name: modelname,
      })
      setewefile(modelname)
      setEWEresponse(LoadResponse)
      setEWEflag('Load')
    }
  }

  const map: Record<WaterModelTypeType, string> = {
    'water-2d': '水动力2D模型',
    'water-3d': '水动力3D模型',
    'quality-wasp': '水质模型-wasp',
    'quality-phreec': '醋酸2D模型',
    'quality-phreec-3d': '醋酸3D模型',
    sand: '泥沙模型',
    mud: '抛泥模型',
    ewe: '生态模型',
    'water-ewe': '水环境ewe耦合模型',
  }

  useEffect(() => {
    if (modelType === 'ewe') LoadEwEModel()
  }, [])

  return (
    <div className="flex h-10 items-center border border-slate-300 bg-white px-2">
      <div>模型类型: </div>
      <div className="relative left-4 text-blue-500">{map[modelType!]}</div>
      <EWE data={EWEresponse} flag={EWEflag}></EWE>
    </div>
  )
}
