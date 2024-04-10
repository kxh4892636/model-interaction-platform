import React,{useEffect} from 'react'
import * as echarts from "echarts"
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { eweFile,MeasuredData,UploadFlag } from '../../../store/eweStore';
import { useMetaStore } from '@/store/metaStore'
import { postUplaodMeasuredAPI } from '@/api/model/model.api'; 


const MYupload = (props) => {
    // console.log(props.data)
    const projectID = useMetaStore((state) => state.projectID)
    const FilePath = eweFile((state) => state.Data);
    const UPflag = UploadFlag((state) => state.Data);
    const setSeriesdata = MeasuredData((state) => state.setData);
    const Uploadprops = {
        name: 'file',
        action: `/api/v1/data/upload`,
        data:{
          modelType:"ewe",
          datasetType:"ewe-input",
          projectID:projectID
        },
        headers: {
          authorization: 'authorization-text',
        },
        async onChange(info) {
            if (info.file.status !== 'uploading') {
            // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
              const result = await postUplaodMeasuredAPI(
                {
                  projectID:projectID,
                  name:FilePath,
                  csvname:info.file.name
                })
              // console.log(result)
              //有些直接没有EcoSim的整个输入
              if(result.series.length !== 0)
              {
                  setSeriesdata(result.series)
              }
              message.success(`${info.file.name} file uploaded successfully`);
            } 
            else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    return(
        <Upload {...Uploadprops}>
            <Button icon={<UploadOutlined />} disabled={UPflag}>上传实测生物量</Button>
        </Upload>
    );
  }
export default function Measured() {
    const Seriesdata = MeasuredData((state) => state.Data);

    useEffect(()=>{
        let myChart= echarts.getInstanceByDom(document.getElementById('Measured')); //有的话就获取已有echarts实例的DOM节点。
        if (myChart== null) { // 如果不存在，就进行初始化。
          myChart= echarts.init(document.getElementById('Measured'));
        }
        myChart.clear()
        var option;
    
        option = {
          title: {
            text: '实测生物量',
            top: 'top',
            left: 'center'
          },
          grid: {
            top: "16%"
          },
          legend:{
            show:true,
            type:'scroll',
            orient:'horizontal',
            icon:'rect',
            width:"80%",
            top:"8%",
        },
          xAxis: {
            type: 'value',
          },
          yAxis: {
            type: 'value'
          },
          series: Seriesdata
        };
        option && myChart.setOption(option);
      })
      const FilePath = eweFile((state) => state.Data);
  return (
    <>
        <MYupload></MYupload>
      <br/>
        <div style={{height:"80%"}} id="Measured"></div>
    </>
    
  )
}
