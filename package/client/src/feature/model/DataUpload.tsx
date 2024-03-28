import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { WaterModelTypeType } from '@/type'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import { useState } from 'react'

interface UploadButtonPropsInterface {
  modelType: WaterModelTypeType
  datasetType: string
  disable?: boolean
  handleChange?: (info: UploadChangeParam) => void
}
const UploadButton = ({
  modelType,
  datasetType,
  disable = false,
  handleChange,
}: UploadButtonPropsInterface) => {
  const projectID = useMetaStore((state) => state.projectID)

  return (
    <Upload
      name="file"
      action={`/api/v1/data/upload`}
      data={{
        datasetType,
        projectID: projectID!,
        modelType,
      }}
      method="post"
      multiple
      disabled={disable}
      onChange={handleChange}
    >
      <Button icon={<UploadOutlined />} className="w-60" disabled={disable}>
        上传模型文件
      </Button>
    </Upload>
  )
}

const Water2DUpload = () => {
  return (
    <div>
      <div className="m-3">
        <div className="mb-3">上传水动力模型文件</div>
        <UploadButton
          modelType="water-2d"
          datasetType="water-2d-input"
        ></UploadButton>
      </div>
    </div>
  )
}

const QualityWasmUpload = () => {
  const [isMeshUpload, setIsWaterUpload] = useState(true)
  return (
    <div>
      <div className="m-3">
        <div className="mb-3">上传水动力模型文件</div>
        <UploadButton
          modelType="quality-wasp"
          datasetType="water-2d-input"
          handleChange={(info) => {
            if (
              info.file.status === 'done' &&
              info.file.name?.includes('mesh')
            ) {
              setIsWaterUpload(false)
            }
          }}
        ></UploadButton>
      </div>
      <div className="m-3">
        <div className="mb-3">上传水质wasp模型文件</div>
        <UploadButton
          modelType="quality-wasp"
          datasetType="quality-wasp-input"
          disable={isMeshUpload}
        ></UploadButton>
      </div>
    </div>
  )
}

const SandUpload = () => {
  const [isMeshUpload, setIsWaterUpload] = useState(true)
  return (
    <div>
      <div className="m-3">
        <div className="mb-3">上传水动力模型文件</div>
        <UploadButton
          modelType="sand"
          datasetType="water-2d-input"
          handleChange={(info) => {
            if (
              info.file.status === 'done' &&
              info.file.name?.includes('mesh')
            ) {
              setIsWaterUpload(false)
            }
          }}
        ></UploadButton>
      </div>
      <div className="m-3">
        <div className="mb-3">上传泥沙模型文件</div>
        <UploadButton
          modelType="sand"
          datasetType="sand-input"
          disable={isMeshUpload}
        ></UploadButton>
      </div>
    </div>
  )
}

export const DataUpload = () => {
  const modelType = useMetaStore((state) => state.modelType)
  const closeModal = useModalStore((state) => state.closeModal)
  const componentMap: Record<WaterModelTypeType, JSX.Element> = {
    'water-2d': <Water2DUpload></Water2DUpload>,
    'water-3d': <></>,
    'quality-wasp': <QualityWasmUpload></QualityWasmUpload>,
    'quality-phreec': <></>,
    sand: <SandUpload></SandUpload>,
    mud: <></>,
  }
  const uploadPanel = componentMap[modelType]

  return (
    <div
      className="relative left-[15vw] top-[10vh] flex h-[80vh] w-[66vw] flex-col
        rounded-xl border border-slate-300 bg-white shadow-lg shadow-slate-300"
    >
      <div className="absolute right-4 top-3 bg-slate-400" onClick={closeModal}>
        关闭
      </div>

      <div
        className="flex h-12 items-center border-0 border-b border-slate-300
          px-4"
      >
        上传模型文件
      </div>
      <div
        className="m-8 h-[70vh] rounded-2xl border border-slate-300
          bg-slate-300/5 p-4 shadow-xl"
      >
        {uploadPanel}
      </div>
    </div>
  )
}
