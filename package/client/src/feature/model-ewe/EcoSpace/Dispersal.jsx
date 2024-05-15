import React from 'react'
import { Table, Empty, Tag } from 'antd'
import { EcoSpaceMap_Dispersal, TableFlag } from '../../../store/eweStore'

const columns = [
  {
    title: 'GroupName',
    dataIndex: 'GroupName',
    key: 'GroupName',
  },
  {
    title: 'Mvel',
    dataIndex: 'Mvel',
    key: 'Mvel',
  },
  {
    title: 'RelMoveBad',
    dataIndex: 'RelMoveBad',
    key: 'RelMoveBad',
  },
  {
    title: 'RelVulBad',
    dataIndex: 'RelVulBad',
    key: 'RelVulBad',
  },
  {
    title: 'IsAdvected',
    dataIndex: 'IsAdvected',
    key: 'IsAdvected',
    render: (_, item) => (
      <>
        {item.IsAdvected === true ? (
          <Tag color={'green'} key={item.LeadingB}>
            {'TRUE'}
          </Tag>
        ) : (
          <Tag color={'red'} key={item.LeadingB}>
            {'FALSE '}
          </Tag>
        )}
      </>
    ),
  },
  {
    title: 'IsMigratory',
    dataIndex: 'IsMigratory',
    key: 'IsMigratory',
    render: (_, item) => (
      <>
        {item.IsMigratory === true ? (
          <Tag color={'green'} key={item.LeadingB}>
            {'TRUE'}
          </Tag>
        ) : (
          <Tag color={'red'} key={item.LeadingB}>
            {'FALSE '}
          </Tag>
        )}
      </>
    ),
  },
]
export default function Dispersal() {
  const DispersalData = EcoSpaceMap_Dispersal((state) => state.Data)
  const TableF = TableFlag((state) => state.Flag)
  return (
    <div>
      {TableF === false ? (
        <Empty />
      ) : (
        <Table
          dataSource={DispersalData}
          columns={columns}
          scroll={{ x: 500, y: 500 }}
        ></Table>
      )}
    </div>
  )
}
