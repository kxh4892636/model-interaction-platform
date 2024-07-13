import React, { useEffect } from 'react'
import {
  EcoSpaceMap_Flow,
  EcoSpaceMap_FlowColor,
} from '../../../../store/eweStore'

function Map(props) {
  useEffect(() => {
    const gridData = props.data.data
    const gridColor = props.data.color
    // 绘制栅格
    function drawGrid() {
      const canvas = document.getElementById('flowCanvas')
      const ctx = canvas.getContext('2d')
      //每次绘图前清楚一边画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const gridSize = Math.max(gridData.length, gridData[0].length)
      const cellSize = Math.floor(canvas.width / gridSize)
      //箭头大小 与格子大小成比例
      let arrowSize = cellSize * (5 / 30)
      if (gridSize > 1) {
        for (let i = 0; i < gridColor.length; i++) {
          for (let j = 0; j < gridColor[0].length; j++) {
            const points = gridData[i][j]
            const color = gridColor[i][j]
            // 画直线和箭头
            let startX = points[0]['X']
            let startY = points[0]['Y']
            let endX = points[1]['X']
            let endY = points[1]['Y']
            if (startX === 0 && startY === 0 && endX === 0 && endY === 0) {
              ctx.fillStyle = `rgb(111, 111, 111)`
              ctx.fillRect(
                j * cellSize,
                i * cellSize,
                cellSize + 0.8,
                cellSize + 0.8,
              )
            } else {
              ctx.fillStyle = `#999999`
              ctx.fillRect(
                j * cellSize,
                i * cellSize,
                cellSize + 0.8,
                cellSize + 0.8,
              )
            }
            // 绘制直线
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)
            ctx.strokeStyle = color
            ctx.stroke()

            // 计算直线的方向
            let angle = Math.atan2(endY - startY, endX - startX)

            // 计算箭头的坐标
            let arrowX = endX + arrowSize * Math.cos(angle)
            let arrowY = endY + arrowSize * Math.sin(angle)

            // 绘制箭头
            ctx.beginPath()
            ctx.moveTo(arrowX, arrowY)
            ctx.lineTo(
              arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
              arrowY - arrowSize * Math.sin(angle - Math.PI / 6),
            )
            ctx.lineTo(
              arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
              arrowY - arrowSize * Math.sin(angle + Math.PI / 6),
            )
            ctx.closePath()
            ctx.fillStyle = color
            ctx.fill()
          }
        }
      } else {
        ctx.fillStyle = `rgb(111, 111, 111)`
        ctx.fillRect(0, 0, cellSize + 0.8, cellSize + 0.8)
      }
    }
    drawGrid()
  })
  return <canvas id="flowCanvas" width="500px" height="500px"></canvas>
}
export default function MapFlow() {
  const FlowData = EcoSpaceMap_Flow((state) => state.Data)
  const FlowColor = EcoSpaceMap_FlowColor((state) => state.Data)
  return (
    <div style={{ marginLeft: '100px' }}>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          paddingBottom: '5px',
          textAlign: 'center',
          width: '500px',
        }}
      >
        单元流速
      </h1>
      <div style={{ display: 'flex' }}>
        <Map data={{ data: FlowData, color: FlowColor }}></Map>
      </div>
    </div>
  )
}
