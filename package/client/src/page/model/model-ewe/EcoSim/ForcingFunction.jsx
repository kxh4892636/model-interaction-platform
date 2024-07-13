import React, { useEffect } from 'react'
import * as echarts from 'echarts'
import {
  eweFile,
  ForcingFunctionData,
  UploadFlag,
} from '../../../../store/eweStore'
import { UploadOutlined } from '@ant-design/icons'
import { Button, message, Upload } from 'antd'
import { useMetaStore } from '@/store/metaStore'
import { postUplaodForcingAPI } from '@/api/model/model.api'

const MYupload = (props) => {
  // console.log(props.data)
  const projectID = useMetaStore((state) => state.projectID)
  const FilePath = eweFile((state) => state.Data)
  const UPflag = UploadFlag((state) => state.Data)
  const setForcingFunctionData = ForcingFunctionData((state) => state.setData)
  const Uploadprops = {
    name: 'file',
    action: `/api/v1/data/upload`,
    data: {
      modelType: 'ewe',
      datasetType: 'ewe-input',
      projectID: projectID,
    },
    async onChange(info) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        const result = await postUplaodForcingAPI({
          projectID: projectID,
          name: FilePath,
          csvname: info.file.name,
        })
        //有些直接没有EcoSim的整个输入
        if (Object.keys(result.EcoSim.ForcingFunction).length !== 0) {
          setForcingFunctionData(
            Object.values(result.EcoSim.ForcingFunction)[0].slice(1),
          )
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
        上传水质浓度文件
      </Button>
    </Upload>
  )
}

export default function ForcingFunction() {
  useEffect(() => {
    let myChart = echarts.getInstanceByDom(
      document.getElementById('ForcingFunction'),
    ) //有的话就获取已有echarts实例的DOM节点。
    if (myChart == null) {
      // 如果不存在，就进行初始化。
      myChart = echarts.init(document.getElementById('ForcingFunction'))
    }
    myChart.clear()
    var option

    option = {
      title: {
        text: '水质浓度',
        top: 'top',
        left: 'center',
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          itemStyle: {
            color: 'rgba(255, 0, 0, 0.99)',
            borderColor: 'rgba(255, 0, 0, 1)',
          },
          data: ForcingData,
          type: 'bar',
          barCategoryGap: '0%',
        },
      ],
    }
    option && myChart.setOption(option)
  })
  const FilePath = eweFile((state) => state.Data)
  const ForcingData = ForcingFunctionData((state) => state.Data)
  return (
    <>
      <MYupload></MYupload>
      <br />
      <div style={{ height: '80%' }} id="ForcingFunction"></div>
    </>
  )
}
