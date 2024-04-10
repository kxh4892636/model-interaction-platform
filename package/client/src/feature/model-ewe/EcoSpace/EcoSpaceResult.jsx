import React from 'react'
import { Tabs,Table } from 'antd';
import { EcoSpaceResult_Group,EcoSpaceResult_Fleet,EcoSpaceResult_Region } from '../../../store/eweStore';
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
  {
    title: 'Value_start',
    dataIndex: 'Value_start',
    key: 'Value_start',
  },
  {
      title: 'Value_end',
      dataIndex: 'Value_end',
      key: 'Value_end',
  },
  {
      title: 'Value_E/S',
      dataIndex: 'Value_ES',
      key: 'Value_ES',
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
    title: 'Value_start',
    dataIndex: 'Value_start',
    key: 'Value_start',
  },
  {
      title: 'Value_end',
      dataIndex: 'Value_end',
      key: 'Value_end',
  },
  {
      title: 'Value_E/S',
      dataIndex: 'Value_ES',
      key: 'Value_ES',
  },
  {
    title: 'Cost_start',
    dataIndex: 'Cost_start',
    key: 'Cost_start',
  },
  {
    title: 'Cost_end',
    dataIndex: 'Cost_end',
    key: 'Cost_end',
  },
  {
    title: 'Cost_E/S',
    dataIndex: 'Cost_ES',
    key: 'Cost_ES',
  },
  {
      title: 'Effort',
      dataIndex: 'Effort',
      key: 'Effort',
  }
]
const RegionCloumns = [
  {
      title: 'Group Name',
      dataIndex: 'Name',
      key: 'GroupName',
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

export default function EcoSpaceResult() {
  const GroupData = EcoSpaceResult_Group((state) => state.Data);
  const FleetData = EcoSpaceResult_Fleet((state) => state.Data);
  const RegionData = EcoSpaceResult_Region((state) => state.Data);
  const items = [
    {
      key: '1',
      label: 'Group',
      children: <Table dataSource={GroupData} columns={GroupCloumns}></Table>,
    },
    {
      key: '2',
      label: 'Fleet',
      children: <Table dataSource={FleetData} columns={FleeetCloumns}></Table>,
    },
    {
      key: '3',
      label: 'Region',
      children: <Table dataSource={RegionData} columns={RegionCloumns}></Table>
    },
  ];
  return (
    <Tabs defaultActiveKey="1" items={items} />
  )
}
