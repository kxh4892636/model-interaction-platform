import React from 'react'
import { Table,Empty } from 'antd'
import { DetritusFate,TableFlag } from '../../store'

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
export default function DetritusFateJS() {
  const DetritusFateData = DetritusFate((state) => state.Data);
  const TableF = TableFlag((state) => state.Flag);
  return (
    <div>
    {TableF===false?<Empty />:<Table dataSource={DetritusFateData} columns={columns}></Table>}
    </div>
  )
}
