import React from 'react';
import AnalysisTable from './AnalysisTable';

const columns = [
    {
        Header: 'Batch',
        accessor: 'Batch',
        minWidth: 170,
    },
    {
        Header: 'TGI',
        accessor: 'TGI',
        minWidth: 170,
    },
    {
        Header: 'Angle',
        accessor: 'Angle',
        minWidth: 170,
    },
    {
        Header: 'ABC',
        accessor: 'ABC',
        minWidth: 170,
    },
];

const parseData = (data) => [{
    Batch: '',
    TGI: data.tgi,
    Angle: data.average_angle,
    ABC: '',
}];

const BatchStatsTable = ({ data }) => <AnalysisTable data={parseData(data)} columns={columns} type="batch" />;

export default BatchStatsTable;
