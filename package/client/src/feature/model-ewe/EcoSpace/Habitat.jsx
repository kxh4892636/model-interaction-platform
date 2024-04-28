import React,{useEffect} from 'react'
import { EcoSpaceMap_Habitat,EcoSpaceMap_HabitatLegend } from '../../../store/eweStore';
function Legend(props){
  const color = {
    0:`#6F6F6F`,
    1:`#6F6F6F`,
    2:`#66CCFF`,
    3:`#CCFFCC`,
    4:`#FFCC99`,
    5:`#66CCCC`,
    6:`#CCCCFF`
  }

  return Object.keys(props.data).lenght===0?<></>: Object.keys(props.data).map(element => 
    <li key={element} style={{listStyleType:"none",fontSize:"18px"}}>
          <span style={{width:"40px",height:"20px",background:color[props.data[element]],display:"inline-block",verticalAlign:"baseline",border:"solid",borderWidth:"1px"}}></span>  
          {element}
    </li>
);
}
function Map(props){
  useEffect(()=>{
    const gridData = props.data

    function getColor(value) {
      if(value===0)
      {
          return `rgb(111, 111, 111)`;
      }
      else if(value===1)
      {
          return `rgb(111, 111, 111)`;
      }
      else if(value===2)
      {
          return `#66CCFF`;
      }
      else if(value===3)
      {
          return `#CCFFCC`;
      }
      else if(value===4)
      {
          return `#FFCC99`;
      }
      else if(value===5)
      {
          return `#66CCCC`;
      }
      else if(value===6)
      {
          return `#CCCCFF`;
      }
      else
      {
          return `black`; 
      }
    }

    // 绘制栅格
    function drawGrid() {
      const canvas = document.getElementById('habitatCanvas');
      const ctx = canvas.getContext('2d');
      //每次绘图前清楚一边画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gridSize = Math.max(gridData.length,gridData[0].length);
      const cellSize = Math.floor(canvas.width / gridSize);
      for (let i = 0; i < gridData.length; i++) {
        for (let j = 0; j < gridData[0].length; j++) {
          const value = gridData[i][j];
          const color = getColor(value);
          ctx.fillStyle = color;
          ctx.fillRect(j * cellSize, i * cellSize, cellSize+0.8, cellSize+0.8);
        }
      }
    }
    drawGrid();
  })
  return <canvas id="habitatCanvas" width="600px" height="600px"></canvas>
}
export default function MapHabitat() {
  const HabitatData = EcoSpaceMap_Habitat((state)=>state.Data)
  const HabitatType = EcoSpaceMap_HabitatLegend((state)=>state.Data)
  return (
    <div style={{marginLeft:"100px"}}>
      <h1 style={{fontSize:20,fontWeight:"bold",paddingBottom:"5px",textAlign:"center",width:"600px"}}>栖息地类型</h1>
      <div style={{display:"flex"}}>
        <Map data={HabitatData}></Map>
        <div style={{width:"200px",height:"600px",marginLeft:"10px"}}>
            <Legend data={HabitatType}></Legend>
        </div>
      </div>

    </div>
  )
}