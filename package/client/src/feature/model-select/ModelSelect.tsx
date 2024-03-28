import { useMetaStore } from '@/store/metaStore'
import { WaterModelTypeType } from '@/type'
import { Select } from 'antd'

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

  return (
    <div className="flex h-10 items-center border border-slate-300 bg-white px-2">
      <div>模型类型</div>
      <Select
        className="relative left-4 text-blue-500"
        size="small"
        disabled={projectID === null}
        value={projectID === null ? null : modelType}
        style={{ width: 160 }}
        onChange={(value) => {
          setModelType(value)
        }}
        options={options}
      />
    </div>
  )
}
