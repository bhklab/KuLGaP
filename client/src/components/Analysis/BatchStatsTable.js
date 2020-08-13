/* eslint-disable no-nested-ternary */
import React from 'react';
import AnalysisTable from './AnalysisTable';
import FixedPoint from '../utils/FixedPoint';

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Estimate',
        accessor: 'estimate',
    },
    {
        Header: 'p-value',
        accessor: 'p-value',
    },
    {
        Header: 'Responder',
        accessor: 'responder',
    },
];

const values = [
    {
        key: 'kl',
        value: 'KuLGaP',
    }, {
        key: 'tgi',
        value: 'TGI',
    }, {
        key: 'average_angle',
        value: 'Angle',
    },
];

const parseData = (data) => values.map((object) => ({
    name: object.value,
    estimate: FixedPoint(data[object.key]),
    'p-value': object.key === 'kl' ? data.kl_p_value.toExponential(1) : '',
    responder: object.key === 'kl' ? (data.kl_p_value < 0.05 ? 'Yes' : 'No') : '',
}));

const BatchStatsTable = ({ data }) => <AnalysisTable data={parseData(data)} columns={columns} type="batch" />;

export default BatchStatsTable;
