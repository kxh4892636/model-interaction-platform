import React from 'react'
import { Table,Empty  } from 'antd';
import { Mortalities,TableFlag } from '../../../store/eweStore';

const MortalitiesColumns = [
    {
        title: 'GroupName',
        dataIndex: 'Name',
        key: 'Name',
    },
    {
        title: 'Prod/biom or Z',
        dataIndex: 'PBOutput',
        key: 'PBOutput',
    },
    {
        title: 'Fishing mort.rate',
        dataIndex: 'MortCoFishRate',
        key: 'MortCoFishRate',
    },
    {
        title: 'Predation mort.rate',
        dataIndex: 'MortCoPredMort',
        key: 'MortCoPredMort',
    },
    {
        title: 'Biomass accum.rate',
        dataIndex: 'BioAccumRatePerYear',
        key: 'BioAccumRatePerYear',
    },
    {
        title: 'Net migration.rate',
        dataIndex: 'MortCoNetMig',
        key: 'MortCoNetMig',
    },
    {
        title: 'Other mort.rate',
        dataIndex: 'MortCoOtherMort',
        key: 'MortCoOtherMort',
    },
    {
        title: 'Fishing/total mort',
        dataIndex: 'FishMortTotMort',
        key: 'FishMortTotMort',
    },
    {
        title: 'Proportion natural mort',
        dataIndex: 'NatMortPerTotMort',
        key: 'NatMortPerTotMort',
    },

]

export default function Mortality() {
    const MortalitiesData = Mortalities((state) => state.Data);
    const TableF = TableFlag((state) => state.Flag);
  return (
    <div style={{textAlign: 'center'}}>
      <div style={{marginBottom:"10px",fontWeight: 'bold'}}>死亡率</div>
        {TableF===false?<Empty />:<Table dataSource={MortalitiesData} columns={MortalitiesColumns} scroll={{x: 1500,y: 450,}}></Table>}
    </div>
  )
}
