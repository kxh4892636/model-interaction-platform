import React,{useEffect} from 'react'
import { EcoSpaceMap_Depth,EcoSpaceMap_DepthColor } from '../../../store/eweStore';
function Map(props){
  useEffect(()=>{
    const gridData = props.data.data
    const gridColor = props.data.color
    // 绘制栅格
    function drawGrid() {
      const canvas = document.getElementById('depthCanvas');
      const ctx = canvas.getContext('2d');
      //每次绘图前清楚一边画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if(gridData[0].length===1)
      {
        ctx.fillStyle = "rgb(111, 111, 111)";
        const cellSize = canvas.width 
        ctx.fillRect(0, 0,  cellSize,cellSize);
      }
      else
      {
        const gridSize = Math.max(gridData.length,gridData[0].length);
        const cellSize = canvas.width / gridSize;
        for (let i = 0; i < gridColor.length; i++) {
          for (let j = 0; j < gridColor[0].length; j++) {
            const value = gridData[i][j];
            const color = gridColor[i][j];
            ctx.fillStyle = color;
            ctx.fillRect(j * cellSize, i * cellSize, cellSize+0.8, cellSize+0.8);
          }
        }
      }

    }
    drawGrid();
  })
  return <canvas id="depthCanvas" width="500px" height="500px"></canvas>
}
export default function MapDepth() {
  const DepthData = EcoSpaceMap_Depth((state)=>state.Data)
  const DepthColor = EcoSpaceMap_DepthColor((state)=>state.Data)
  return (
    <div style={{marginLeft:"100px"}}>
      <h1 style={{fontSize:20,fontWeight:"bold",paddingBottom:"5px",textAlign:"center",width:"500px"}}>初始深度</h1>
      <div style={{display:"flex"}}>
        <Map data={{"data":DepthData,"color":DepthColor}}></Map>
        {/* <div style={{width:"20px",height:"600px",marginLeft:"10px",background:"linear-gradient(to bottom, #0000FF,#00FFFF)"}}></div> */}
      </div>

    </div>
  )
}