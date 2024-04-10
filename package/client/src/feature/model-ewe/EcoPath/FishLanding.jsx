import React from 'react'
import { Table,Empty } from 'antd'
import { FleetsCloums,Landings,TableFlag } from '../../../store/eweStore'

export default function FishLanding() {
    const FleetsCloum = FleetsCloums((state) => state.Data);
    const Landing = Landings((state) => state.Data);
    const TableF = TableFlag((state) => state.Flag);
    return (
        <div style={{textAlign: 'center'}}>
        <div style={{marginBottom:"10px",fontWeight: 'bold'}}>渔业捕捞</div>
        {TableF===false?<Empty />:<Table dataSource={Landing} columns={FleetsCloum} scroll={{x: 1500,y: 450,}}></Table>}
        </div>
    )
}
