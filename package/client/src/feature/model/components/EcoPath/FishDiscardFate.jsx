import React from 'react'
import { Table,Empty } from 'antd'
import { DiscardFate,TableFlag } from '../../store'

const columns = [
    {
        title: 'GroupName',
        dataIndex: 'Name',
        key: 'GroupName',
    },
    {
        title: 'Detritus',
        dataIndex: 'Detritus',
        key: 'Detritus',
    }
]
export default function FishDiscardFate() {
    const DiscardFateData = DiscardFate((state) => state.Data);
    const TableF = TableFlag((state) => state.Flag);
    return (
      <div>
      {TableF===false?<Empty />:<Table dataSource={DiscardFateData} columns={columns}></Table>}
      </div>
    )
}
