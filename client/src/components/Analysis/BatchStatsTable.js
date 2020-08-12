import React from 'react';
import AnalysisTable from './AnalysisTable';
import FixedPoint from '../utils/FixedPoint';

const columns = [
    {
        Header: 'Key',
        accessor: 'key',
        minWidth: 170,
        style: {
            fontSize: '16px',
            fontWeight: '600',
        },
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
        value: FixedPoint(data.tgi),
    },
    {
        key: 'Angle',
        value: FixedPoint(data.average_angle),
    },
    {
        key: 'ABC',
        value: '',
    },
];

const TheadComponent = () => null; // a component returning null (to hide).

const BatchStatsTable = ({ data }) => <AnalysisTable data={parseData(data)} columns={columns} type="batch" TheadComponent={TheadComponent} />;

export default BatchStatsTable;
