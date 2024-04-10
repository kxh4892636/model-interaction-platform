import React from 'react'
import { Table, Empty } from 'antd'
import { Basic, TableFlag } from '../../../store/eweStore'

const columns = [
  {
    title: 'GroupName',
    dataIndex: 'GroupName',
    key: 'GroupName',
  },
  {
    title: 'Hab_area',
    dataIndex: 'Hab_area',
    key: 'Hab_area',
  },
  {
    title: 'Biomass_in_HB',
    dataIndex: 'Biomass_in_HB',
    key: 'Biomass_in_HB',
  },
  {
    title: 'Production_Biomass',
    dataIndex: 'Production_Biomass',
    key: 'Production_Biomass',
  },
  {
    title: 'Consumption_Biomass',
    dataIndex: 'Consumption_Biomass',
    key: 'Consumption_Biomass',
  },
  {
    title: 'EE',
    dataIndex: 'EE',
    key: 'EE',
  },
  {
    title: 'Other_mortality',
    dataIndex: 'Other_mortality',
    key: 'Other_mortality',
  },
  {
    title: 'Unassim_consumption',
    dataIndex: 'Unassim_consumption',
    key: 'Unassim_consumption',
  },
  {
    title: 'Detritus_import',
    dataIndex: 'Detritus_import',
    key: 'Detritus_import',
  },
]
export default function Group() {
  const BasicData = Basic((state) => state.BasicData)
  const TableF = TableFlag((state) => state.Flag)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        基本输入参数
      </div>
      {TableF === false ? (
        <Empty />
      ) : (
        <Table
          dataSource={BasicData}
          columns={columns}
          scroll={{ x: 1500, y: 450 }}
        ></Table>
      )}
    </div>
  )
}
