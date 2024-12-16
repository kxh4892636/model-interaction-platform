import React from 'react'
import { Table, Empty } from 'antd'
import { Basic_Estimate, EcopathResultFlag } from '../../../../store/eweStore'
const columns = [
  {
    title: '功能组名称',
    dataIndex: 'Name',
    key: 'GroupName',
  },
  {
    title: '营养等级',
    dataIndex: 'TL',
    key: 'TL',
  },
  {
    title: '生物量',
    dataIndex: 'Biomass',
    key: 'Biomass',
  },
  {
    title: '生产量/生物量',
    dataIndex: 'PB',
    key: 'PB',
  },
  {
    title: '消耗量/生物量',
    dataIndex: 'QB',
    key: 'QB',
  },
  {
    title: '营养效率',
    dataIndex: 'EE',
    key: 'EE',
  },
]
export default function Basic_EstimateJS() {
  const Basic_EstimateData = Basic_Estimate((state) => state.Data)
  const TableF = EcopathResultFlag((state) => state.Flag)

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        基本参数计算
      </div>
      {TableF === false ? (
        <Empty />
      ) : (
        <Table
          dataSource={Basic_EstimateData}
          columns={columns}
          scroll={{ x: 1500, y: 450 }}
        ></Table>
      )}
    </div>
  )
}
