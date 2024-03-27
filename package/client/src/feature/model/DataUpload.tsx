import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { WaterModelTypeType } from '@/type'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from 'antd'

interface UploadButtonPropsInterface {
  modelType: WaterModelTypeType
  datasetType: string
}
const UploadButton = ({
  modelType,
  datasetType,
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
    >
      <Button icon={<UploadOutlined />} className="w-60">
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

export const DataUpload = () => {
  const modelType = useMetaStore((state) => state.modelType)
  const closeModal = useModalStore((state) => state.closeModal)
  const componentMap: Record<WaterModelTypeType, JSX.Element> = {
    'water-2d': <Water2DUpload></Water2DUpload>,
    'water-3d': <></>,
    'quality-wasp': <></>,
    'quality-phreec': <></>,
    sand: <></>,
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
