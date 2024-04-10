import React from 'react'
import { Table,Empty } from 'antd'
import { Diet_Cloumns,Diet_Data,TableFlag } from "../../store"

export default function Diet() {
  const DietCloumns = Diet_Cloumns((state) => state.Data);
  const DietData = Diet_Data((state) => state.Data);
  const TableF = TableFlag((state) => state.Flag);
  return (
    <div>
      {TableF===false?<Empty />:<Table dataSource={DietData} columns={DietCloumns} scroll={{ x: 1300}} size='small'></Table>}
    </div>
  )
}
