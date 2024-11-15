import { postEWEModelImportAPI } from '@/api/model/model.api'
import EWE from '../model-ewe/Import'
import { eweFile } from '@/store/eweStore'
import { useLayersStore } from '@/store/layerStore'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { WaterModelTypeType } from '@/type'
import { CloseOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Upload, message } from 'antd'
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
        <div className="mb-3">上传水动力2D模型文件</div>
        <div className="max-h-[50vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="water-2d"
            datasetType="water-2d-input"
          ></UploadButton>
        </div>
      </div>
    </div>
  )
}

const Water3DUpload = () => {
  return (
    <div>
      <div className="m-3">
        <div className="mb-3">上传水动力3D模型文件</div>
        <div className="max-h-[50vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="water-3d"
            datasetType="water-3d-input"
          ></UploadButton>
        </div>
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
        <div className="max-h-[30vh] overflow-y-auto overflow-x-clip">
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
      </div>
      <div className="m-3">
        <div className="mb-3">上传水质wasp模型文件</div>
        <div className="max-h-[30vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="quality-wasp"
            datasetType="quality-wasp-input"
            disable={isMeshUpload}
          ></UploadButton>
        </div>
      </div>
    </div>
  )
}

const QualityPhreecUpload = () => {
  return (
    <div>
      <div className="m-3">
        <div className="mb-3">上传水质phreec模型文件</div>
        <div className="max-h-[50vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="quality-phreec"
            datasetType="quality-phreec-input"
          ></UploadButton>
        </div>
      </div>
    </div>
  )
}

const QualityPhreec3DUpload = () => {
  return (
    <div>
      <div className="m-3">
        <div className="mb-3">上传水质phreec模型文件</div>
        <div className="max-h-[50vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="quality-phreec-3d"
            datasetType="quality-phreec-3d-input"
          ></UploadButton>
        </div>
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
        <div className="max-h-[30vh] overflow-y-auto overflow-x-clip">
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
      </div>
      <div className="m-3">
        <div className="mb-3">上传泥沙模型文件</div>
        <div className="max-h-[30vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="sand"
            datasetType="sand-input"
            disable={isMeshUpload}
          ></UploadButton>
        </div>
      </div>
    </div>
  )
}

const MudUpload = () => {
  const [isMeshUpload, setIsWaterUpload] = useState(true)
  return (
    <div>
      <div className="m-3">
        <div className="mb-3">上传水动力模型文件</div>
        <div className="max-h-[30vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="mud"
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
      </div>
      <div className="m-3">
        <div className="mb-3">上传抛泥模型文件</div>
        <div className="max-h-[30vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="mud"
            datasetType="mud-input"
            disable={isMeshUpload}
          ></UploadButton>
        </div>
      </div>
    </div>
  )
}

const WaterEweUpload = () => {
  const [isMeshUpload, setIsWaterUpload] = useState(true)
  return (
    <div>
      <div className="m-3 ">
        <div className="mb-3">上传水动力模型文件</div>
        <div className="max-h-[30vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="water-ewe"
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
      </div>
      <div className="m-3">
        <div className="mb-3">上传水质wasp模型文件</div>
        <div className="max-h-[30vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="water-ewe"
            datasetType="quality-wasp-input"
            disable={isMeshUpload}
          ></UploadButton>
        </div>
      </div>
      <div className="m-3">
        <div className="mb-3">上传ewe模型文件</div>
        <div className="max-h-[30vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="water-ewe"
            datasetType="ewe-input"
            disable={isMeshUpload}
          ></UploadButton>
        </div>
      </div>
    </div>
  )
}

const EWEUpload = () => {
  const projectID = useMetaStore((state) => state.projectID)
  const setewefile = eweFile((state) => state.setData)
  const [EWEresponse, setEWEresponse] = useState({})
  const [EWEflag, setEWEflag] = useState('')
  return (
    <div>
      <div className="m-3">
        <div className="mb-3">上传生态模型文件</div>
        <div className="max-h-[30vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="ewe"
            datasetType="ewe-input"
            handleChange={async (info) => {
              if (info.file.status === 'done') {
                message.loading({
                  content: '模型加载中',
                  key: 'Mloading',
                  duration: 0,
                })
                setewefile(info.file.name)
                const result = await postEWEModelImportAPI({
                  projectID: projectID as string,
                  name: info.file.name,
                })
                setEWEresponse(result)
                setEWEflag('Import_' + info.file.name)
              }
            }}
          ></UploadButton>
        </div>
      </div>
      <EWE data={EWEresponse} flag={EWEflag}></EWE>
    </div>
  )
}

const SpoilUpload = () => {
  return (
    <div>
      <div className="m-3">
        <div className="mb-3">上传扩散模型文件</div>
        <div className="max-h-[50vh] overflow-y-auto overflow-x-clip">
          <UploadButton
            modelType="spoil"
            datasetType="spoil-input"
          ></UploadButton>
        </div>
      </div>
    </div>
  )
}

export const DataUpload = () => {
  const modelType = useMetaStore((state) => state.modelType)
  const closeModal = useModalStore((state) => state.closeModal)
  const forceUpdateLayerTree = useLayersStore(
    (state) => state.forceUpdateLayerTree,
  )
  const componentMap: Record<WaterModelTypeType, JSX.Element> = {
    'water-2d': <Water2DUpload></Water2DUpload>,
    'water-3d': <Water3DUpload></Water3DUpload>,
    'quality-wasp': <QualityWasmUpload></QualityWasmUpload>,
    'quality-phreec': <QualityPhreecUpload></QualityPhreecUpload>,
    'quality-phreec-3d': <QualityPhreec3DUpload></QualityPhreec3DUpload>,
    sand: <SandUpload></SandUpload>,
    mud: <MudUpload></MudUpload>,
    ewe: <EWEUpload></EWEUpload>,
    'water-ewe': <WaterEweUpload></WaterEweUpload>,
    spoil: <SpoilUpload></SpoilUpload>,
  }
  const uploadPanel = componentMap[modelType!]

  return (
    <div
      className="relative left-[15vw] top-[10vh] flex h-[80vh] w-[66vw] flex-col
        rounded-xl border border-slate-300 bg-white"
    >
      <div
        className="absolute right-4 top-3 text-xl"
        onClick={() => {
          closeModal()
          forceUpdateLayerTree()
        }}
      >
        <button className="px-1 hover:bg-slate-200">
          <CloseOutlined />
        </button>
      </div>

      <div
        className="flex h-12 items-center border-0 border-b border-slate-300
          px-4"
      >
        上传模型文件
      </div>
      <div
        className="m-8 h-[70vh] overflow-y-scroll rounded-2xl border
          border-slate-300 bg-slate-300/5 p-4 shadow-xl"
      >
        {uploadPanel}
      </div>
    </div>
  )
}
