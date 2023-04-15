// import React from 'react'

import EWEfish from './EcoSim.png'
import { fakedataV } from '../store'
export default function App() {
  const fakedataVV = fakedataV((state)=>state.fakedataV)
  return (
    // <div style={{height:"100%"}}>
    //     <img src={EWEfish} style={{margin:" 0 auto"}}></img>
    // </div>
    <div style={{textAlign:"center",width:"100%",height:"100%",display:"table"}}>
    <span style={{display: "table-cell", verticalAlign: "middle"}}>
    {fakedataVV?
    <>
      <div style={{fontSize:25,fontWeight:800}}>港口海域不同功能组相对生物量随时间变化</div>
      <br/>
      <img alt="" src={EWEfish} style={{display: "inline-block",height:"800px"}}/>
    </>
    :<h1>等待运行结果</h1>}
    
    </span>
    </div>
  )
}