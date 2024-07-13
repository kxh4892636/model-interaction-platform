import React, { useEffect } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Select, Space, Button, message, Upload } from 'antd'
import * as echarts from 'echarts'
import {
  eweFile,
  UploadFlag,
  TimeSelect,
  TimeSeriesData,
  TimeSeriesPlot,
  TimeYearData,
  TimeSelected,
} from '../../../../store/eweStore'
import { useMetaStore } from '@/store/metaStore'
import { postUplaodTimeserieAPI } from '@/api/model/model.api'

const MYupload = (props) => {
  // console.log(props.data)
  const projectID = useMetaStore((state) => state.projectID)
  const FilePath = eweFile((state) => state.Data)
  const UPflag = UploadFlag((state) => state.Data)
  const setTimeOption = TimeSelect((state) => state.setData)
  const setTimeSeries = TimeSeriesData((state) => state.setData)
  const setTimeYearData = TimeYearData((state) => state.setData)
  const setTimeSelected = TimeSelected((state) => state.setData)
  const setTimeSeriesPlot = TimeSeriesPlot((state) => state.setData)
  const Uploadprops = {
    name: 'file',
    action: `/api/v1/data/upload`,
    data: {
      modelType: 'ewe',
      datasetType: 'ewe-input',
      projectID: projectID,
    },
    headers: {
      authorization: 'authorization-text',
    },
    async onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        const result = await postUplaodTimeserieAPI({
          projectID: projectID,
          name: FilePath,
          csvname: info.file.name,
        })
        // console.log(result);
        //有些直接没有EcoSim的整个输入
        if (Object.keys(result.EcoSim).length !== 0) {
          setTimeOption(result.EcoSim.TimeSelect)
          setTimeSeries(result.EcoSim.TimeSeries)
          setTimeYearData(result.EcoSim.TimeYears)
          // 有些没有TimeSeries数据
          if (result.EcoSim.TimeSelect.length > 0) {
            const value2 = result.EcoSim.TimeSelect[0].value
            setTimeSelected(value2)
            setTimeSeriesPlot(result.EcoSim.TimeSeries[value2])
          }
        }
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }
  return (
    <Upload {...Uploadprops}>
      <Button icon={<UploadOutlined />} disabled={UPflag}>
        上传功能函数文件
      </Button>
    </Upload>
  )
}
export default function Timeseries() {
  useEffect(() => {
    let myChart = echarts.getInstanceByDom(
      document.getElementById('TimeSeries'),
    ) //有的话就获取已有echarts实例的DOM节点。
    if (myChart == null) {
      // 如果不存在，就进行初始化。
      myChart = echarts.init(document.getElementById('TimeSeries'))
    }
    myChart.clear()
    var option

    option = {
      title: {
        text: '功能函数',
        top: 'top',
        left: 'center',
      },
      xAxis: {
        type: 'category',
        data: TimeYearDatatD,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: TimeSeriesPlotD,
          type: 'line',
          smooth: true,
        },
      ],
    }
    // console.log(option)
    option && myChart.setOption(option)
  })
  const SelectOption = TimeSelect((state) => state.Data)
  const TimeSeriesD = TimeSeriesData((state) => state.Data)
  const TimeSeriesPlotD = TimeSeriesPlot((state) => state.Data)
  const TimeYearDatatD = TimeYearData((state) => state.Data)
  const TimeSelectedD = TimeSelected((state) => state.Data)
  const setTimeSelectedD = TimeSelected((state) => state.setData)
  const setTimeSeriesPlotD = TimeSeriesPlot((state) => state.setData)
  return (
    <div style={{ height: '80%', width: '100%' }}>
      <MYupload></MYupload>
      <br />
      <Space>
        <span>变量选择</span>
        <Select
          value={TimeSelectedD}
          style={{
            width: 240,
          }}
          onChange={(value) => {
            setTimeSeriesPlotD(TimeSeriesD[value].slice(2))
            setTimeSelectedD(value)
          }}
          options={SelectOption}
        />
      </Space>
      <div id="TimeSeries" style={{ height: '80%' }}></div>
    </div>
  )
}
