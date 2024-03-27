import React from 'react'
import { Table,Empty } from 'antd'
import { FleetsCloums,Landings,TableFlag } from '../../store'

export default function FishLanding() {
    const FleetsCloum = FleetsCloums((state) => state.Data);
    const Landing = Landings((state) => state.Data);
    const TableF = TableFlag((state) => state.Flag);
    return (
        <div>
        {TableF===false?<Empty />:<Table dataSource={Landing} columns={FleetsCloum}></Table>}
        </div>
    )
}
