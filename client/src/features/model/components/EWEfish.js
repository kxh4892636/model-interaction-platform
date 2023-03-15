// import React from 'react'

import EWEfish from './EWEfish.png'
export default function App() {
  return (
    // <div style={{height:"100%"}}>
    //     <img src={EWEfish} style={{margin:" 0 auto"}}></img>
    // </div>
    <div style={{textAlign:"center",width:"100%",height:"100%",display:"table"}}>
    <span style={{display: "table-cell", verticalAlign: "middle"}}>
    <img alt="" src={EWEfish} style={{display: "inline-block"}}/>
    </span>
    </div>
  )
}
