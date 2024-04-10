import React,{useEffect} from 'react'
import { EcoSpaceMap_Depth } from '../../../store/eweStore';
function Map(props){
  useEffect(()=>{
    const gridData = props.data
    function getColor(value) {
      if(value===0)
      {
          return `rgb(111, 111, 111)`;
      }
      else
      {
          const t = (value - 1) / (14);
          const g = Math.floor(255 - 255 * t);

          return `rgb(0, ${g}, 255)`;
      }
    }

    // 绘制栅格
    function drawGrid() {
      const canvas = document.getElementById('gridCanvas');
      const ctx = canvas.getContext('2d');
      //每次绘图前清楚一边画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gridSize = gridData.length;
      const cellSize = canvas.width / gridSize;
      console.log(canvas.width, canvas.height)
      console.log(cellSize)
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const value = gridData[i][j];
          const color = getColor(value);
          // console.log(value,color)
          // ctx.lineWidth = 0;
          ctx.fillStyle = color;
          ctx.fillRect(j * cellSize, i * cellSize, cellSize+0.8, cellSize+0.8);
        }
      }
    }
    drawGrid();
  })
  return <canvas id="gridCanvas" width="600px" height="600px" style={{border:"1px solid black"}}></canvas>
}
export default function InputMap() {
  const DepthData = EcoSpaceMap_Depth((state)=>state.Data)
  return (
    <div style={{marginLeft:"100px"}}>
      <h1 style={{fontSize:20,textAlign:"center"}}>初始深度</h1>
      <div style={{display:"flex"}}>
        <Map data={DepthData}></Map>
        <div style={{width:"20px",height:"600px",marginLeft:"10px",background:"linear-gradient(to bottom, #0000FF,#00FFFF)"}}></div>
      </div>

    </div>
  )
}
