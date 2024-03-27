import React, { useEffect } from 'react'
import { MixedTrophicData,FlowDiagram } from '../../store';
export default function MixedTrophic() {
    const MixedTrophicD = MixedTrophicData((state)=>state.Data)
    const FlowD = FlowDiagram((state) => state.Data);
    useEffect(()=>{
        // console.log(MixedTrophicD.length)
        function getsize(value) {
            let abs = Math.abs(value)
            if(abs<0.001)
            {
                return 1;
            }
            else if(0.001<=abs && abs<0.005)
            {
                return 2;
            }
            else if(0.005<=abs && abs<0.01)
            {
                return 3;
            }
            else if(0.01<=abs && abs<0.05)
            {
                return 4;
            }
            else if(0.05<=abs && abs<0.1)
            {
                return 5;
            }
            else if(0.1<=abs && abs<0.3)
            {
                return 6;
            }
            else if(0.3<=abs && abs<0.5)
            {
                return 7;
            }
            else if(0.5<=abs && abs<0.75)
            {
                return 8;
            }
            else
            {
                return 9;
            }
        }
        function drawGrid() {
            const canvas = document.getElementById('MixedTrophicgridCanvas');
            const ctx = canvas.getContext('2d');
            //每次绘图前清楚一边画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 图例
            // 开始路径
            ctx.beginPath();
            // 绘制圆
            ctx.arc(MixedTrophicD.length*20/5, 8, 7, 0, Math.PI * 2);
            // 设置填充颜色
            ctx.fillStyle = "#FF6666";
            // 填充圆
            ctx.fill();
            // 结束路径
            ctx.closePath();

            // 开始路径
            ctx.beginPath();
            // 绘制圆
            ctx.arc(MixedTrophicD.length*20/2, 8, 7, 0, Math.PI * 2);
            // 设置填充颜色
            ctx.fillStyle = "#009900";
            // 填充圆
            ctx.fill();
            // 结束路径
            ctx.closePath();

            ctx.fillStyle = "black";
            ctx.fontWeight = 'bold';
            ctx.fontSize = '24px';
            ctx.fillText("Postive", MixedTrophicD.length*20/2+10, 10);
            ctx.fillText("Negative", MixedTrophicD.length*20/5+10, 10);
            for(let i=1;i<MixedTrophicD.length;i++)
            {
                ctx.fillText(i, i*20, 28);
                ctx.fillText(i+" : "+FlowD.node[i-1].name, MixedTrophicD.length*20, i*20+25);
            }
            
            for(let i=1;i<MixedTrophicD.length;i++)
            {
                for(let j=1;j<MixedTrophicD.length;j++)
                {
                    // 开始路径
                    ctx.beginPath();
                    // 绘制圆
                    ctx.arc( j*20,i*20+20, getsize(MixedTrophicD[i][j]), 0, Math.PI * 2);
                    // 设置填充颜色
                    ctx.fillStyle = MixedTrophicD[i][j]>0?"#009900":"#FF6666";
                    // 填充圆
                    ctx.fill();
                    // 结束路径
                    ctx.closePath();
                }
            }
        }
        if(MixedTrophicD.length>0){
            drawGrid() 
        }

    },[MixedTrophicD.length])//eslint-disable-line
  return (
    <div id='main' style={{height:"91%"}}>
    <canvas id="MixedTrophicgridCanvas" width="600px" height="600px">MixedTrophic</canvas>
    </div>
  )
}
