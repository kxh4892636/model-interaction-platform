import {
  getProjectListAPI,
  postProjectActionAPI,
} from '@/api/project/project.api'
import { ProjectInfoType, ProjectListType } from '@/api/project/project.type'
import { useForceUpdate } from '@/hook/useForceUpdate'
import { useMapStore } from '@/store/mapStore'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { DataFetchHookInterface } from '@/type'
import {
  Button,
  Card,
  Input,
  InputNumber,
  Popconfirm,
  Tabs,
  TabsProps,
  message,
} from 'antd'
import Meta from 'antd/es/card/Meta'
import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { useModeStore } from './model.store'

const NewArea = () => {
  const closeModal = useModalStore((state) => state.closeModal)
  const map = useMapStore((state) => state.map)
  const setModelArea = useModeStore((state) => state.setModelArea)
  const setProjectID = useMetaStore((state) => state.setProjectID)
  const [modelStatus, setModelStatus] = useState<(number | string)[]>([])
  const inputList = ['最小经度', '最小纬度', '最大经度', '最大纬度'].map(
    (value, index) => {
      return (
        <div key={index}>
          <div>{value}</div>
          <InputNumber
            defaultValue={undefined}
            className="my-2 w-full"
            value={modelStatus[index + 1]}
            onChange={(value) => {
              if (!value) return
              setModelStatus(
                produce((draft) => {
                  draft[index + 1] = value
                }),
              )
            }}
          />
        </div>
      )
    },
  )

  const handleClick = async () => {
    const result = await postProjectActionAPI({
      action: 'create',
      projectID: null,
      projectName: modelStatus[0] as string,
      projectExtent: modelStatus.slice(1) as number[],
    })
    if (result.status === 'success') {
      message.info('创建区域成功', 5)
      setModelArea('defined')
      map!.fitBounds(modelStatus.slice(1) as any)
      setProjectID(result.data)
      closeModal()
    } else {
      message.error('创建区域失败, 经纬度输入错误', 5)
      closeModal()
    }
  }

  return (
    <div
      className="mx-8 my-4 h-[60vh] rounded-2xl border border-slate-300
        bg-slate-300/5 p-4 shadow-xl"
    >
      <div className="mx-4 w-[40%] min-w-72 ">
        <div>研究区域名称</div>
        <Input
          defaultValue={undefined}
          className="my-2 w-full"
          value={modelStatus[0]}
          onChange={(e) => {
            setModelStatus(
              produce((draft) => {
                draft[0] = e.target.value
              }),
            )
          }}
        />
        {inputList}
        <div className="my-2 flex justify-end">
          <Button
            type="primary"
            disabled={modelStatus.length !== 5}
            onClick={handleClick}
          >
            创建研究区域
          </Button>
        </div>
      </div>
    </div>
  )
}

const HistoryArea = () => {
  const projectID = useMetaStore((state) => state.projectID)
  const setProjectID = useMetaStore((state) => state.setProjectID)
  const closeModal = useModalStore((state) => state.closeModal)
  const map = useMapStore((state) => state.map)
  const setModelArea = useModeStore((state) => state.setModelArea)
  const [updateTag, forceUpdate] = useForceUpdate()
  const [historyAreaList, setHistoryAreaList] = useState<
    DataFetchHookInterface<ProjectListType>
  >({
    status: 'pending',
    data: [],
    message: '',
  })

  const handleLoad = async (projectInfo: ProjectInfoType) => {
    message.info('进入历史区域成功', 5)
    setModelArea('defined')
    map!.fitBounds(projectInfo.projectExtent as any)
    setProjectID(projectInfo.projectId)
    closeModal()
  }

  const handleDelete = async (projectInfo: ProjectInfoType) => {
    const result = await postProjectActionAPI({
      action: 'delete',
      projectID: projectInfo.projectId,
      projectName: null,
      projectExtent: null,
    })
    forceUpdate()
    if (projectInfo.projectId === projectID) {
      setProjectID(null)
      setModelArea('undefined')
    }
    if (result.status === 'success') {
      message.info('删除区域成功', 5)
    } else {
      message.error('删除区域失败', 5)
    }
  }

  useEffect(() => {
    getProjectListAPI().then((response) => {
      if (response.status === 'success') {
        setHistoryAreaList({
          status: 'success',
          data: response.data,
          message: '',
        })
      }
    })
  }, [updateTag])

  const cardList = (() => {
    if (historyAreaList.status !== 'success') return <></>
    const result = historyAreaList.data!.map((data) => (
      <Card
        className="m-4 h-48 w-60 "
        key={data.projectId}
        size={'small'}
        actions={[
          <Button
            key="load"
            type="primary"
            onClick={() => {
              handleLoad(data)
            }}
          >
            加载区域
          </Button>,
          <Popconfirm
            key="delete"
            title="删除区域"
            description="你是否确定删除该区域?"
            onConfirm={() => {
              handleDelete(data)
            }}
            okText="确定删除"
            cancelText="取消删除"
          >
            <Button type="primary" danger>
              删除区域
            </Button>
          </Popconfirm>,
        ]}
      >
        <Meta
          title={data.projectName}
          description={['最小经度', '最小纬度', '最大经度', '最大纬度'].map(
            (value, index) => {
              return (
                <div key={index}>
                  {`${value}: ${data.projectExtent[index]}`}
                </div>
              )
            },
          )}
        />
      </Card>
    ))

    return result
  })()

  return (
    <div
      className="mx-8 my-4 flex h-[60vh] flex-auto flex-wrap overflow-auto
        rounded-2xl border border-slate-300 bg-slate-300/10 p-4 shadow-xl"
    >
      {cardList}
    </div>
  )
}

export const AreaSelect = () => {
  const closeModal = useModalStore((state) => state.closeModal)
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '创建新研究区域',
      children: <NewArea></NewArea>,
    },
    {
      key: '2',
      label: '选择历史研究区域',
      children: <HistoryArea></HistoryArea>,
    },
  ]

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
        确定研究区域
      </div>
      <div className="mx-3">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </div>
  )
}
