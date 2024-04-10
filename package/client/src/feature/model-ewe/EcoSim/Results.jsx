import React from 'react'
import { Tabs, Table } from 'antd'
import {
  EcoSimResult_Group,
  EcoSimResult_Fleet,
  EcoSimResult_Indices,
} from '../../../store/eweStore'
const GroupCloumns = [
  {
    title: 'Group_name',
    dataIndex: 'Group_name',
    key: 'Group_name',
  },
  {
    title: 'Biomass_start',
    dataIndex: 'Biomass_start',
    key: 'Biomass_start',
  },
  {
    title: 'Biomass_end',
    dataIndex: 'Biomass_end',
    key: 'Biomass_end',
  },
  {
    title: 'Biomass_E/S',
    dataIndex: 'Biomass_ES',
    key: 'Biomass_ES',
  },
  {
    title: 'Catch_start',
    dataIndex: 'Catch_start',
    key: 'Catch_start',
  },
  {
    title: 'Catch_end',
    dataIndex: 'Catch_end',
    key: 'Catch_end',
  },
  {
    title: 'Catch_E/S',
    dataIndex: 'Catch_ES',
    key: 'Catch_ES',
  },
]
const FleeetCloumns = [
  {
    title: 'Fleet_name',
    dataIndex: 'Fleet_name',
    key: 'Fleet_name',
  },
  {
    title: 'Catch_start',
    dataIndex: 'Catch_start',
    key: 'Catch_start',
  },
  {
    title: 'Catch_end',
    dataIndex: 'Catch_end',
    key: 'Catch_end',
  },
  {
    title: 'Catch_E/S',
    dataIndex: 'Catch_ES',
    key: 'Catch_ES',
  },
  {
    title: 'Effort',
    dataIndex: 'Effort',
    key: 'Effort',
  },
]
const IndiceCloumns = [
  {
    title: 'Time',
    dataIndex: 'Time',
    key: 'Time',
  },
  {
    title: 'FiB index',
    dataIndex: 'FIB',
    key: 'FiB index',
  },
  {
    title: 'Trophic level of the catch',
    dataIndex: 'TLC',
    key: 'Trophic level of the catch',
  },
  {
    title: 'Total catch',
    dataIndex: 'TC',
    key: 'Total catch',
  },
  {
    title: "Kempton's Q",
    dataIndex: 'KQ',
    key: "Kempton's Q",
  },
]
export default function Results() {
  const GroupData = EcoSimResult_Group((state) => state.Data)
  const FleetData = EcoSimResult_Fleet((state) => state.Data)
  const IndicesData = EcoSimResult_Indices((state) => state.Data)
  const items = [
    {
      key: '1',
      label: 'Group',
      children: (
        <Table
          dataSource={GroupData}
          columns={GroupCloumns}
          scroll={{ x: 1500, y: 450 }}
        ></Table>
      ),
    },
    {
      key: '2',
      label: 'Fleet',
      children: (
        <Table
          dataSource={FleetData}
          columns={FleeetCloumns}
          scroll={{ x: 1500, y: 450 }}
        ></Table>
      ),
    },
    {
      key: '3',
      label: 'Indices',
      children: (
        <Table
          dataSource={IndicesData}
          columns={IndiceCloumns}
          scroll={{ x: 1500, y: 450 }}
        ></Table>
      ),
    },
  ]
  return <Tabs defaultActiveKey="1" items={items} />
}
