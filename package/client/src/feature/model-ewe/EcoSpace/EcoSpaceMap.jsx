import React, { useEffect,useState } from 'react'
import { Tabs,Space,Select,Progress,Button } from 'antd'
import { PlayCircleFilled } from '@ant-design/icons';
import * as echarts from 'echarts';
import { RunEcoSpacae_ModelType,RunEcoSpace_Option,RunEcoSpacae_SelectOption,RunEcoSpacae_PlotMap,RunEcoSpacae_DefaultSelect,EcoSpaceTime } from '../../../store/eweStore';
import { postEcoSpaceMapSwitchAPI } from '@/api/model/model.api';
import { useMetaStore } from '@/store/metaStore'
import { eweFile } from '@/store/eweStore'

function Map(props){
    const gridDataID = props.data.id
    const gridData = props.data.data
    // console.log(gridData)
    useEffect(()=>{
      // 绘制栅格
      function drawGrid() {
        const canvas = document.getElementById('Run_gridCanvas');
        const ctx = canvas.getContext('2d');
        //每次绘图前清楚一边画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // const cellSize = canvas.width / gridSize;
        if(gridDataID==="none")
        {
          ctx.fillStyle = "rgb(111, 111, 111)";
          const cellSize = canvas.width 
          ctx.fillRect(0, 0,  cellSize,cellSize);
        }
        else
        {
          const gridSize = Math.max(gridData.length,gridData[0].length);;
          const cellSize = Math.floor(canvas.width / gridSize);;
          // console.log(cellSize,gridData.length,gridData[0].length)
          for (let i = 0; i < gridData.length; i++) {
            for (let j = 0; j < gridData[0].length; j++) {
              ctx.fillStyle =  gridData[i][j];
              ctx.fillRect(j * cellSize, i * cellSize, cellSize+0.8, cellSize+0.8);
            }
          }
          // 1 IBM 花小黑点
          if(props.data.type===1)
          {
            for(let i = 0; i < props.data.stanze.length; i++)
            {
              ctx.beginPath();
              ctx.arc(props.data.stanze[i][0], props.data.stanze[i][1], 1, 0, Math.PI * 2);
              ctx.fillStyle = "black";
              ctx.fill();
              ctx.closePath();
            }
          }
        }
      }
      drawGrid()
    },[props.data.id,props.data.time,props.data.type])//eslint-disable-line
    return <>
            <div><canvas id="Run_gridCanvas" width="600px" height="600px"></canvas></div>
          </>
  }
  export default function EcoSpaceMaps(){
    const [progress, setprogress] = useState(0)
    const projectID = useMetaStore((state) => state.projectID)
    const ewefile = eweFile((state) => state.Data)
    const ModelType = RunEcoSpacae_ModelType((state) => state.Data)
    const setModelType = RunEcoSpacae_ModelType((state) => state.setData)
    const MapSelectOption = RunEcoSpacae_SelectOption((state) => state.Data)
    const MapData = RunEcoSpacae_PlotMap((state) => state.Data)
    const setMapData = RunEcoSpacae_PlotMap((state) => state.setData)
    const DefaultSelect = RunEcoSpacae_DefaultSelect((state) => state.Data)
    const setDefaultSelect = RunEcoSpacae_DefaultSelect((state) => state.setData)
    const Time = EcoSpaceTime((state) => state.Data)
    const SwitchRunEcoSpaceMap = async (value,n,m)=>{
      const result = await postEcoSpaceMapSwitchAPI({
        projectID: projectID,
        name: ewefile,
        id: value,
        modeltype: m,
        time:n
      })
      setMapData(result)
      if(n===0)
      {
        setprogress(0);
      }
    }
    function drawGrids(){
      let i = 1
      function test(){
        if(i<Time)
        {
          // console.log(i)
          SwitchRunEcoSpaceMap(DefaultSelect,i,ModelType)
          setprogress((i+1)*Math.ceil(100/Time));
          setTimeout(test, 250);
          i+=1
        }
      }
      test()
      
    }
    return(
      <div style={{display:'flex'}}>
        <div style={{marginLeft:"150px"}}>
          <h1 style={{fontSize:20,fontWeight:"bold",paddingBottom:"5px",textAlign:"center",width:"600px"}}>Relative Biomass</h1>
          <Map data={MapData}></Map>
          <Button onClick={drawGrids} type="primary" shape="circle" icon={<PlayCircleFilled />} size={'small'} />
          <Progress percent={progress} style={{width:"600px"}} size={[600, 20]} />
        </div>
        <div style={{paddingTop:"30px"}}>
          <div style={{marginBottom:"5px"}}>
              <span>模型类型  </span>
              <Select
                  defaultValue={0}
                  style={{
                  width: 240,
                  }}
                  onChange={(value) => {
                    SwitchRunEcoSpaceMap(DefaultSelect,0,value)
                    setModelType(value)
                  }}
                  options={
                      [
                        {value:0,label:"Basic PDE"},
                        {value:1,label:"IBM"},
                        {value:2,label:"Multi-stanza"},
                      ]
                  }
              />
          </div>
          <div>
              <span>物种选择  </span>
              <Select
                  value={DefaultSelect}
                  style={{
                  width: 240,
                  }}
                  onChange={(value) => {
                    SwitchRunEcoSpaceMap(value,0,ModelType);
                    setDefaultSelect(value);
                  }}
                  options={MapSelectOption}
              />
          </div>
        </div>

      </div>
  
    )
  }