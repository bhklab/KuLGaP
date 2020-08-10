import React from 'react';
import AnalysisTable from './AnalysisTable';

const columns = [
    {
        Header: 'Key',
        accessor: 'key',
        minWidth: 170,
    },
    {
        Header: 'Value',
        accessor: 'value',
        minWidth: 170,
    },
];

const parseData = (data) => [
    {
        key: 'TGI',
        value: data.tgi.toFixed(4),
    },
    {
        key: 'Angle',
        value: data.average_angle.toFixed(4),
    },
    {
        key: 'ABC',
        value: '',
    },
];

const TheadComponent = () => null; // a component returning null (to hide).

const BatchStatsTable = ({ data }) => <AnalysisTable data={parseData(data)} columns={columns} type="batch" TheadComponent={TheadComponent} />;

export default BatchStatsTable;
