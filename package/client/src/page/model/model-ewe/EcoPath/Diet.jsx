import React from 'react'
import { Table, Empty } from 'antd'
import { Diet_Cloumns, Diet_Data, TableFlag } from '../../../../store/eweStore'

export default function Diet() {
  const DietCloumns = Diet_Cloumns((state) => state.Data)
  const DietData = Diet_Data((state) => state.Data)
  const TableF = TableFlag((state) => state.Flag)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>食物矩阵</div>
      {TableF === false ? (
        <Empty />
      ) : (
        <Table
          dataSource={DietData}
          columns={DietCloumns}
          scroll={{ x: 1500, y: 450 }}
          size="small"
        ></Table>
      )}
    </div>
  )
}
