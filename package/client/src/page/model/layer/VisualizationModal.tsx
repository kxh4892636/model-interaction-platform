import { useModalStore } from '@/store/modalStore'
import { CloseOutlined } from '@ant-design/icons'

import { useEffect, useRef } from 'react'
import * as echart from 'echarts/core'

interface EweProps {
  data: Record<string, number[]>
}
export const EweVisualization = ({ data }: EweProps) => {
  const echartRef = useRef<null | HTMLDivElement>(null)
  useEffect(() => {
    if (!echartRef.current) return
    const myChart = echart.init(echartRef.current)
    const series = []
    let min = Infinity
    let max = -Infinity
    for (const key in data) {
      series.push({
        name: key,
        type: 'line',
        data: data[key],
      })
      min = Math.min(min, Math.min(...data[key]))
      max = Math.max(max, Math.max(...data[key]))
    }
    const range = max - min
    const option = {
      title: {
        text: 'OUHE',
        left: 'center',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        // 设置y轴范围
        min: (min - 0.2 * range).toFixed(1),
        max: (max + 0.2 * range).toFixed(1),
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: Object.keys(data),
        orient: 'vertical',
        right: '1%',
        top: '3%',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        width: '80%',
        containLabel: true,
      },
      series,
    }
    option && myChart.setOption(option)

    return () => {
      myChart.dispose()
    }
  })
  return <div ref={echartRef} className="h-full w-full"></div>
}

interface AppProps {
  title: string
  element: JSX.Element
}
export const VisualizationModal = ({ title, element }: AppProps) => {
  const closeModal = useModalStore((state) => state.closeModal)

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
        {title}
      </div>
      <div
        className="m-8 h-[70vh] rounded-2xl border border-slate-300
          bg-slate-300/5 p-4 shadow-xl"
      >
        {element}
      </div>
    </div>
  )
}
