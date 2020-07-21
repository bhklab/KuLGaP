import React from 'react';
import { data } from '../../data/batch_stats'
import AnalysisTable from './AnalysisTable'

const columns = [
    {
        Header: 'Batch',
        accessor: 'Batch',
        minWidth: 170
    },
    {
        Header: 'TGI',
        accessor: 'TGI',
        minWidth: 170
    },
    {
        Header: 'Angle',
        accessor: 'Angle',
        minWidth: 170
    },
    {
        Header: 'ABC',
        accessor: 'ABC',
        minWidth: 170
    },
]

const BatchStatsTable = () => <AnalysisTable data={data} columns={columns} type={'batch'}/>;

export default BatchStatsTable;