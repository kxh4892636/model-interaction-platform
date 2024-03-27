import { postModelActionAPI } from '@/api/model/model.api'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { Button } from 'antd'
import { AreaSelect } from './AreaSelect'
import { DataUpload } from './DataUpload'
import { ModelParamEditor } from './ModelParameterEditor'
import { useModeStore } from './model.store'

export const Model = () => {
  const projectID = useMetaStore((state) => state.projectID)
  const modelType = useMetaStore((state) => state.modelType)
  const modelArea = useModeStore((state) => state.modelArea)
  const openModal = useModalStore((state) => state.openModal)
  const toolList = (() => {
    const arr: {
      label: string
      action: () => void
    }[] = []
    if (modelArea === 'undefined') {
      arr.push({
        label: '确定研究区域',
        action: () => {
          openModal(<AreaSelect></AreaSelect>)
        },
      })
    } else {
      arr.push({
        label: '选择其他区域',
        action: () => {
          openModal(<AreaSelect></AreaSelect>)
        },
      })
      arr.push({
        label: '上传模型文件',
        action: () => {
          openModal(<DataUpload></DataUpload>)
        },
      })
      arr.push({
        label: '设置模型参数',
        action: () => {
          openModal(<ModelParamEditor></ModelParamEditor>)
        },
      })
      arr.push({
        label: '计算模型',
        action: async () => {
          if (!projectID) return
          await postModelActionAPI({
            modelID: null,
            action: 'run',
            modelInit: {
              modelName:
                modelType +
                `-输出数据-${new Date(Date.now()).toLocaleDateString().toString()}`,
              modelType,
              projectID,
            },
          })
        },
      })
    }

    const result = arr.map((value) => {
      return (
        <div key={value.label} className="flex justify-center">
          <Button
            size="small"
            type="primary"
            onClick={value.action}
            className="w-32"
          >
            {value.label}
          </Button>
        </div>
      )
    })

    return result
  })()
  return (
    <div
      className="grid grid-cols-2 gap-y-1 border border-slate-300 bg-white py-1"
    >
      {toolList}
    </div>
  )
}
