import React from 'react'
import { Table, Empty } from 'antd'
import { Basic, TableFlag } from '../../../../store/eweStore'

const columns = [
  {
    title: '功能组名称',
    dataIndex: 'GroupName',
    key: 'GroupName',
  },
  {
    title: '栖息面积比例',
    dataIndex: 'Hab_area',
    key: 'Hab_area',
  },
  {
    title: '生物量',
    dataIndex: 'Biomass_in_HB',
    key: 'Biomass_in_HB',
  },
  {
    title: '生产量/生物量',
    dataIndex: 'Production_Biomass',
    key: 'Production_Biomass',
  },
  {
    title: '消耗量/生物量',
    dataIndex: 'Consumption_Biomass',
    key: 'Consumption_Biomass',
  },
  {
    title: '营养效率',
    dataIndex: 'EE',
    key: 'EE',
  },
  {
    title: '其他死亡率',
    dataIndex: 'Other_mortality',
    key: 'Other_mortality',
  },
  {
    title: '未同化食物比例',
    dataIndex: 'Unassim_consumption',
    key: 'Unassim_consumption',
  },
  {
    title: '有机碎屑输入',
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
