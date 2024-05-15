import { useModalStore } from '@/store/modalStore'
import { useModelStore } from '@/store/modelStore'
import { WaterModelTypeType } from '@/type'
import { CloseOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Card, Progress } from 'antd'

const ModelStatusInfo = () => {
  const closeModal = useModalStore((state) => state.closeModal)
  const modelStatusRecord = useModelStore((state) => state.modelStatusRecord)

  const cardList = (() => {
    const result = []
    const nameMap: Record<WaterModelTypeType, string> = {
      'water-2d': '水动力2D模型',
      'water-3d': '水动力3D模型',
      'quality-wasp': '水质模型-wasp',
      'quality-phreec': '醋酸模型',
      'quality-phreec-3d': '醋酸模型-3d',
      sand: '泥沙模型',
      mud: '抛泥模型',
      ewe: 'ewe模型',
    }
    for (const modelName in modelStatusRecord) {
      if (Object.prototype.hasOwnProperty.call(modelStatusRecord, modelName)) {
        if (modelName === 'ewe') {
          continue
        }
        const info = modelStatusRecord[modelName as WaterModelTypeType]
        result.push(
          <Card
            title={nameMap[info.name]}
            className="w-full border border-slate-300"
          >
            {info.status === null && <div>模型尚未运行</div>}
            {info.status === 'pending' && (
              <Progress percent={Number((info.progress * 100).toFixed(2))} />
            )}
            {info.status === 'success' && (
              <>
                <Progress percent={100} className="pb-4" />
                <div>模型运行完成</div>
              </>
            )}
            {info.status === 'error' && <div>模型运行失败</div>}
          </Card>,
        )
      }
    }
    return result
  })()

  return (
    <div
      className="relative left-[35vw] top-[20vh] flex h-[50vh] w-[30vw] flex-col
        rounded-xl border border-slate-300 bg-white"
    >
      <div
        className="absolute right-4 top-3 text-xl"
        onClick={() => {
          closeModal()
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
        模型运行状态
      </div>
      <div
        className="m-6 my-4 h-[40vh] flex-col overflow-auto rounded-2xl border
          border-slate-300 bg-slate-300/5 p-6 shadow-xl *:mb-2"
      >
        {cardList}
      </div>
    </div>
  )
}

export const ModelStatus = () => {
  const openModal = useModalStore((state) => state.openModal)
  return (
    <button
      className="absolute left-4 top-4 z-10 rounded border border-slate-300
        bg-white p-2 px-4 hover:bg-slate-100"
      onClick={() => {
        openModal(<ModelStatusInfo></ModelStatusInfo>)
      }}
    >
      <PlayCircleOutlined />
      <span className="pl-2">模型运行状态</span>
    </button>
  )
}
