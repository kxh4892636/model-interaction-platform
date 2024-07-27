import { getDataInfoOfCoordAPI } from '@/api/model-data/data.api'
import { useLayersStore } from '@/store/layerStore'
import { useMapStore } from '@/store/mapStore'
import { useMetaStore } from '@/store/metaStore'
import { useModalStore } from '@/store/modalStore'
import { CloseOutlined } from '@ant-design/icons'
import { message, Select } from 'antd'
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts/core'
import { LayerType } from '@/type'

const generateEchartsOption = (dataInfo: LayerType, data: number[]) => {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  let series = null
  let legend = null
  console.log(dataInfo)
  if (dataInfo.layerType === 'mesh') {
    legend = {
      data: ['水深'],
    }
    series = [
      {
        name: '水深',
        data,
        type: 'bar',
      },
    ]
  } else if (dataInfo.layerType === 'uvet') {
    const len = data.length / 3
    const nameList = ['水深', 'u', 'v']
    series = []
    legend = {
      data: nameList,
    }
    for (let i = 0; i < 3; i++) {
      const temp = []
      for (let j = 0; j < len; j++) {
        temp.push(data[i + j * 3])
      }
      series.push({
        name: nameList[i],
        type: 'line',
        stack: 'Total',
        data: temp,
        smooth: true,
      })
    }
  } else {
    legend = {
      data: [dataInfo.layerName],
    }
    series = [
      {
        name: dataInfo.layerName,
        data,
        type: 'line',
        smooth: true,
      },
    ]
  }

  const option = {
    title: {
      text: dataInfo.layerName,
    },
    legend,
    xAxis: {
      type: 'category',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
    },
    series,
  }

  return option
}

interface DataInfoProps {
  coord: [number, number]
}
export const DataInfo = ({ coord }: DataInfoProps) => {
  const closeModal = useModalStore((state) => state.closeModal)
  const layers = useLayersStore((state) => state.layers.map)
  const echartRef = useRef<null | HTMLDivElement>(null)
  const [dataID, setDataID] = useState<null | string>(null)

  const selectOptions = layers.map((layer) => ({
    value: layer.layerKey,
    label: layer.layerName,
  }))

  const handleChange = async (dataID: string) => {
    setDataID(dataID)
  }

  useEffect(() => {
    setDataID(selectOptions[0].value)
  }, [])

  useEffect(() => {
    const chart = echarts.init(echartRef.current)
    if (dataID === null) return
    const dataInfo = layers.filter((value) => value.layerKey === dataID)[0]
    getDataInfoOfCoordAPI(dataID, coord).then((res) => {
      if (res.status === 'error') return
      const data = res.data as number[]
      const option = generateEchartsOption(dataInfo, data)
      chart.setOption(option!)
    })
    return () => {
      chart.dispose()
    }
  }, [dataID])

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
        数据详情
      </div>
      <div
        className="relative m-8 h-[70vh] rounded-2xl border border-slate-300
          bg-slate-300/5 p-4 shadow-xl"
      >
        <Select
          defaultValue={selectOptions[0].value}
          className="absolute right-8 top-6 w-48"
          onChange={handleChange}
          options={selectOptions}
        />
        <div ref={echartRef} className="absolute top-6 h-[60vh] w-[76%]"></div>
      </div>
    </div>
  )
}

export const DataInfoTool = () => {
  const buttonRef = useRef<null | HTMLButtonElement>(null)
  const [isSelected, setIsSelected] = useState(false)
  const map = useMapStore((state) => state.map)
  const clickPosition = useMapStore((state) => state.clickPosition)
  const openModal = useModalStore((state) => state.openModal)
  const projectID = useMetaStore((state) => state.projectID)

  const handleClick = () => {
    if (projectID === null) {
      message.warning('未选择研究区域')
      return
    }
    setIsSelected(!isSelected)
  }

  useEffect(() => {
    if (buttonRef.current && map) {
      buttonRef.current.style.backgroundImage = isSelected
        ? 'url(/info-select.png)'
        : 'url(/info.png)'
      map.getCanvas().style.cursor = isSelected ? ' crosshair' : 'grab'
    }
  }, [isSelected])

  useEffect(() => {
    if (!isSelected) return
    openModal(<DataInfo coord={clickPosition}></DataInfo>)
  }, [clickPosition[0]])

  return (
    <div className="absolute right-4 top-20 z-10 h-8 w-8 rounded bg-white p-1">
      <button
        className="h-full w-full bg-[url('/info.png')] bg-contain bg-no-repeat"
        onClick={handleClick}
        ref={buttonRef}
      ></button>
    </div>
  )
}
