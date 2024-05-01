import { getProjectTreeAPI } from '@/api/project/project.api'
import { postEWEModelLoadAPI } from '@/api/model/model.api'
import { useMetaStore } from '@/store/metaStore'
import { WaterModelTypeType } from '@/type'
import { Select } from 'antd'
import EWE from '../model-ewe/Import'
import { eweFile } from '@/store/eweStore'
import { useState } from 'react'

interface OptionInterface {
  value: WaterModelTypeType
  label: string
}

interface ModelSelectProps {
  options: OptionInterface[]
}
export const ModelSelect = ({ options }: ModelSelectProps) => {
  const modelType = useMetaStore((state) => state.modelType)
  const projectID = useMetaStore((state) => state.projectID)
  const setModelType = useMetaStore((state) => state.setModelType)
  const [EWEresponse, setEWEresponse] = useState({})
  const [EWEflag, setEWEflag] = useState("")
  const setewefile = eweFile((state) => state.setData)
  const LoadEwEModel = async ()=>{
    let modelname = ""
    if(projectID)
      {
          const response = await getProjectTreeAPI(projectID)
          if(response['data']){
            response['data'].forEach(element=>{
              if(element["modelType"]==="ewe")
              {
                element.children.forEach(item=>{
                  if(item["layerName"].split(".")[1]==="eweaccdb" || item["layerName"].split(".")[1]==="EwEmdb")  
                  {
                    modelname = item["layerName"]
                  }
                })
              }
            })
          }
      }
    if(modelname !== "")
    {
      const LoadResponse = await postEWEModelLoadAPI({
        projectID: projectID as string,
        name: modelname,
      })
      setewefile(modelname)
      setEWEresponse(LoadResponse)
      setEWEflag("Load")
    }
  }
  return (
    <div className="flex h-10 items-center border border-slate-300 bg-white px-2">
      <div>模型类型</div>
      <Select
        className="relative left-4 text-blue-500"
        size="small"
        disabled={projectID === null}
        value={projectID === null ? null : modelType}
        style={{ width: 160 }}
        listHeight={600}
        onChange={(value) => {
          if(value==="ewe") LoadEwEModel()
          setModelType(value)
        }}
        options={options}
      />
      <EWE data={EWEresponse} flag={EWEflag} ></EWE>
    </div>
  )
}
