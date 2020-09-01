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
    }, {
        key: 'mRECIST',
        value: 'mRECIST',
    },
];

const calcResponse = (data) => {
    const count = {
        SD: 0,
        PR: 0,
        PD: 0,
        CR: 0,
    };
    let max = 0;
    let max_array = [];
    Object.entries(data.mRECIST).forEach((val) => {
        count[val[1].replace('m', '')] += 1;
    });
    Object.entries(count).forEach((val) => {
        if (val[1] > max) {
            max_array = [];
            max_array.push(val[0]);
            max = val[1];
        } else if (val[1] === max) {
            max_array.push(val[0]);
        }
    });
    return max_array.join('/');
};

const parseData = (data) => values.map((object) => ({
    name: object.value,
    estimate: object.value === 'mRECIST' ? calcResponse(data) : FixedPoint(data[object.key]),
    'p-value': object.key === 'kl' ? data.kl_p_value.toExponential(1) : '',
    responder: object.key === 'kl' ? (data.kl_p_value < 0.05 ? 'Yes' : 'No') : '',
}));

const BatchStatsTable = ({ data }) => <AnalysisTable data={parseData(data)} columns={columns} type="batch" />;

export default BatchStatsTable;
