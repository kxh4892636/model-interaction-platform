import {
  postMudParamAPI,
  postQualityPhreec3DParamAPI,
  postQualityPhreecParamAPI,
  postQualityWaspParamAPI,
  postSandParamAPI,
  postSpoilParamAPI,
  postWater2DParamAPI,
  postWater3DParamAPI,
  postWaterEweParamAPI,
} from '@/api/model/model.api'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { WaterModelTypeType } from '@/type'
import { CloseOutlined } from '@ant-design/icons'
import { Button, InputNumber, message } from 'antd'
import { useState } from 'react'

const Water2DParamEditor = () => {
  const [hours, setHours] = useState<null | number>(null)
  const projectID = useMetaStore((state) => state.projectID)
  const closeModal = useModalStore((state) => state.closeModal)

  const handleClick = async () => {
    const result = await postWater2DParamAPI({
      projectID: projectID!,
      hours: hours!,
    })
    if (result.status === 'success') {
      message.info('设置参数成功', 5)
      closeModal()
    } else {
      message.error('设置参数失败', 5)
      closeModal()
    }
  }

  return (
    <div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="">模拟时间 (小时)</div>
        <InputNumber
          defaultValue={undefined}
          step={24}
          min={0}
          value={hours}
          onChange={(value: any) => {
            setHours(Number(value))
          }}
          className="my-3 w-full"
        />
      </div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="my-2 flex justify-end">
          <Button
            type="primary"
            disabled={hours === null}
            onClick={handleClick}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

const Water3DParamEditor = () => {
  const [hours, setHours] = useState<null | number>(null)
  const projectID = useMetaStore((state) => state.projectID)
  const closeModal = useModalStore((state) => state.closeModal)

  const handleClick = async () => {
    const result = await postWater3DParamAPI({
      projectID: projectID!,
      hours: hours!,
    })
    if (result.status === 'success') {
      message.info('设置参数成功', 5)
      closeModal()
    } else {
      message.error('设置参数失败', 5)
      closeModal()
    }
  }

  return (
    <div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="">模拟时间 (小时)</div>
        <InputNumber
          defaultValue={undefined}
          step={24}
          min={0}
          value={hours}
          onChange={(value: any) => {
            setHours(Number(value))
          }}
          className="my-3 w-full"
        />
      </div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="my-2 flex justify-end">
          <Button
            type="primary"
            disabled={hours === null}
            onClick={handleClick}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

const QualityWaspParamEditor = () => {
  const [hours, setHours] = useState<null | number>(null)
  const projectID = useMetaStore((state) => state.projectID)
  const closeModal = useModalStore((state) => state.closeModal)

  const handleClick = async () => {
    const result = await postQualityWaspParamAPI({
      projectID: projectID!,
      hours: hours!,
    })
    if (result.status === 'success') {
      message.info('设置参数成功', 5)
      closeModal()
    } else {
      message.error('设置参数失败', 5)
      closeModal()
    }
  }

  return (
    <div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="">模拟时间 (小时)</div>
        <InputNumber
          defaultValue={undefined}
          step={24}
          min={0}
          value={hours}
          onChange={(value: any) => {
            setHours(Number(value))
          }}
          className="my-3 w-full"
        />
      </div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="my-2 flex justify-end">
          <Button
            type="primary"
            disabled={hours === null}
            onClick={handleClick}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

const QualityPhreecParamEditor = () => {
  const [hours, setHours] = useState<null | number>(null)
  const projectID = useMetaStore((state) => state.projectID)
  const closeModal = useModalStore((state) => state.closeModal)

  const handleClick = async () => {
    const result = await postQualityPhreecParamAPI({
      projectID: projectID!,
      hours: hours!,
    })
    if (result.status === 'success') {
      message.info('设置参数成功', 5)
      closeModal()
    } else {
      message.error('设置参数失败', 5)
      closeModal()
    }
  }

  return (
    <div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="">模拟时间 (小时)</div>
        <InputNumber
          defaultValue={undefined}
          step={24}
          min={0}
          value={hours}
          onChange={(value: any) => {
            setHours(Number(value))
          }}
          className="my-3 w-full"
        />
      </div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="my-2 flex justify-end">
          <Button
            type="primary"
            disabled={hours === null}
            onClick={handleClick}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

const QualityPhreec3DParamEditor = () => {
  const [hours, setHours] = useState<null | number>(null)
  const projectID = useMetaStore((state) => state.projectID)
  const closeModal = useModalStore((state) => state.closeModal)

  const handleClick = async () => {
    const result = await postQualityPhreec3DParamAPI({
      projectID: projectID!,
      hours: hours!,
    })
    if (result.status === 'success') {
      message.info('设置参数成功', 5)
      closeModal()
    } else {
      message.error('设置参数失败', 5)
      closeModal()
    }
  }

  return (
    <div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="">模拟时间 (小时)</div>
        <InputNumber
          defaultValue={undefined}
          step={24}
          min={0}
          value={hours}
          onChange={(value: any) => {
            setHours(Number(value))
          }}
          className="my-3 w-full"
        />
      </div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="my-2 flex justify-end">
          <Button
            type="primary"
            disabled={hours === null}
            onClick={handleClick}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

const SandParamEditor = () => {
  const [hours, setHours] = useState<null | number>(null)
  const projectID = useMetaStore((state) => state.projectID)
  const closeModal = useModalStore((state) => state.closeModal)

  const handleClick = async () => {
    const result = await postSandParamAPI({
      projectID: projectID!,
      hours: hours!,
    })
    if (result.status === 'success') {
      message.info('设置参数成功', 5)
      closeModal()
    } else {
      message.error('设置参数失败', 5)
      closeModal()
    }
  }

  return (
    <div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="">模拟时间 (小时)</div>
        <InputNumber
          defaultValue={undefined}
          step={24}
          min={0}
          value={hours}
          onChange={(value: any) => {
            setHours(Number(value))
          }}
          className="my-3 w-full"
        />
      </div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="my-2 flex justify-end">
          <Button
            type="primary"
            disabled={hours === null}
            onClick={handleClick}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

const MudParamEditor = () => {
  const [hours, setHours] = useState<null | number>(null)
  const projectID = useMetaStore((state) => state.projectID)
  const closeModal = useModalStore((state) => state.closeModal)

  const handleClick = async () => {
    const result = await postMudParamAPI({
      projectID: projectID!,
      hours: hours!,
    })
    if (result.status === 'success') {
      message.info('设置参数成功', 5)
      closeModal()
    } else {
      message.error('设置参数失败', 5)
      closeModal()
    }
  }

  return (
    <div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="">模拟时间 (小时)</div>
        <InputNumber
          defaultValue={undefined}
          step={24}
          min={0}
          value={hours}
          onChange={(value: any) => {
            setHours(Number(value))
          }}
          className="my-3 w-full"
        />
      </div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="my-2 flex justify-end">
          <Button
            type="primary"
            disabled={hours === null}
            onClick={handleClick}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

const WaterEweParamEditor = () => {
  const [hours, setHours] = useState<null | number>(null)
  const projectID = useMetaStore((state) => state.projectID)
  const closeModal = useModalStore((state) => state.closeModal)

  const handleClick = async () => {
    const result = await postWaterEweParamAPI({
      projectID: projectID!,
      hours: hours!,
    })
    if (result.status === 'success') {
      message.info('设置参数成功', 5)
      closeModal()
    } else {
      message.error('设置参数失败', 5)
      closeModal()
    }
  }

  return (
    <div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="">耦合时间 (小时)</div>
        <InputNumber
          defaultValue={undefined}
          step={24}
          min={0}
          value={hours}
          onChange={(value: any) => {
            setHours(Number(value))
          }}
          className="my-3 w-full"
        />
      </div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="my-2 flex justify-end">
          <Button
            type="primary"
            disabled={hours === null}
            onClick={handleClick}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

const SpoilParamEditor = () => {
  const [hours, setHours] = useState<null | number>(null)
  const projectID = useMetaStore((state) => state.projectID)
  const closeModal = useModalStore((state) => state.closeModal)

  const handleClick = async () => {
    const result = await postSpoilParamAPI({
      projectID: projectID!,
      hours: hours!,
    })
    if (result.status === 'success') {
      message.info('设置参数成功', 5)
      closeModal()
    } else {
      message.error('设置参数失败', 5)
      closeModal()
    }
  }

  return (
    <div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="">模拟时间 (小时)</div>
        <InputNumber
          defaultValue={undefined}
          step={24}
          min={0}
          value={hours}
          onChange={(value: any) => {
            setHours(Number(value))
          }}
          className="my-3 w-full"
        />
      </div>
      <div className="mx-4 w-[40%] min-w-72">
        <div className="my-2 flex justify-end">
          <Button
            type="primary"
            disabled={hours === null}
            onClick={handleClick}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}

export const ModelParamEditor = () => {
  const modelType = useMetaStore((state) => state.modelType)
  const closeModal = useModalStore((state) => state.closeModal)
  const componentMap: Record<WaterModelTypeType, JSX.Element> = {
    'water-2d': <Water2DParamEditor></Water2DParamEditor>,
    'water-3d': <Water3DParamEditor></Water3DParamEditor>,
    'quality-wasp': <QualityWaspParamEditor></QualityWaspParamEditor>,
    'quality-phreec': <QualityPhreecParamEditor></QualityPhreecParamEditor>,
    'quality-phreec-3d': (
      <QualityPhreec3DParamEditor></QualityPhreec3DParamEditor>
    ),
    sand: <SandParamEditor></SandParamEditor>,
    mud: <MudParamEditor></MudParamEditor>,
    ewe: <></>,
    'water-ewe': <WaterEweParamEditor></WaterEweParamEditor>,
    spoil: <SpoilParamEditor></SpoilParamEditor>,
  }
  const uploadPanel = componentMap[modelType!]

  return (
    <div
      className="relative left-[15vw] top-[10vh] flex h-[80vh] w-[66vw] flex-col
        rounded-xl border border-slate-300 bg-white"
    >
      <div className="absolute right-4 top-3 text-xl" onClick={closeModal}>
        <button className="px-1 hover:bg-slate-200">
          <CloseOutlined />
        </button>
      </div>

      <div
        className="flex h-12 items-center border-0 border-b border-slate-300
          px-4"
      >
        设置模型参数
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
