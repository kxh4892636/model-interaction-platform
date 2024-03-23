import React from 'react'
import { Table,Empty} from 'antd'
import { Basic_Estimate,EcopathResultFlag} from '../../store'
const columns = [
    {
        title: 'GroupName',
        dataIndex: 'Name',
        key: 'GroupName',
    },
    {
        title: 'TL',
        dataIndex: 'TL',
        key: 'TL',
    },
    {
        title: 'Biomass',
        dataIndex: 'Biomass',
        key: 'Biomass',
    },
    {
        title: 'PB',
        dataIndex: 'PB',
        key: 'PB',
    },
    {
        title: 'QB',
        dataIndex: 'QB',
        key: 'QB',
    },
    {
        title: 'EE',
        dataIndex: 'EE',
        key: 'EE',
    },
]
export default function Basic_EstimateJS() {
    const Basic_EstimateData = Basic_Estimate((state) => state.Data);
    const TableF = EcopathResultFlag((state) => state.Flag);

    return (
        <div>
        {TableF===false?<Empty />:<Table dataSource={Basic_EstimateData} columns={columns}></Table>}
        </div>
    )
}
