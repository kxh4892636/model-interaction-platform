import React from 'react'
import { Table,Empty } from 'antd'
import { FleetsCloums,Discard,TableFlag } from '../../store'
export default function FishDiscard() {
    const FleetsCloum = FleetsCloums((state) => state.Data);
    const Discards = Discard((state) => state.Data);
    const TableF = TableFlag((state) => state.Flag);
  return (
    <div>
    {TableF===false?<Empty />:<Table dataSource={Discards} columns={FleetsCloum}></Table>}
    </div>
  )
}
