import React from 'react';
import AnalysisTable from './AnalysisTable';
import FixedPoint from '../utils/FixedPoint';
import colors from '../../styles/colors';

const columns = [
    {
        Header: 'KL value',
        accessor: 'kulgap',
        style: {
            color: `${colors.tussock}`,
            fontWeight: '600',
        },
    },
    {
        Header: 'KuLGaP',
        accessor: 'p_value',
        style: {
            color: `${colors.tussock}`,
            fontWeight: '600',
        },
    },
    {
        Header: 'TGI',
        accessor: 'tgi',
    },
    {
        Header: 'Angle',
        accessor: 'angle',
    },
    // {
    //     Header: 'ABC',
    //     accessor: 'abc',
    //     minWidth: 100,
    // },
];

const parseData = (data) => [{
    kulgap: FixedPoint(data.kl),
    p_value: data.kl_p_value < 0.05 ? 'Yes' : 'No',
    tgi: FixedPoint(data.tgi),
    angle: FixedPoint(data.average_angle),
    // abc: '',
}];

const BatchStatsTable = ({ data }) => <AnalysisTable data={parseData(data)} columns={columns} type="batch" />;

export default BatchStatsTable;
