import React from 'react';
import AnalysisTable from './AnalysisTable';
import FixedPoint from '../utils/FixedPoint';
import colors from '../../styles/colors';

const columns = [
    {
        Header: 'KuLGap Stat',
        accessor: 'kulgap',
        minWidth: 100,
        style: {
            color: `${colors.tussock}`,
            fontWeight: '600',
        },
    },
    {
        Header: 'p_value',
        accessor: 'p_value',
        minWidth: 120,
        style: {
            color: `${colors.tussock}`,
            fontWeight: '600',
        },
    },
    {
        Header: 'TGI',
        accessor: 'tgi',
        minWidth: 230,
    },
    {
        Header: 'Angle',
        accessor: 'angle',
        minWidth: 100,
    },
    {
        Header: 'ABC',
        accessor: 'abc',
        minWidth: 100,
    },
];

const parseData = (data) => [{
    kulgap: FixedPoint(data.kl),
    p_value: data.kl_p_value.toExponential(1),
    tgi: FixedPoint(data.tgi),
    angle: FixedPoint(data.average_angle),
    abc: '',
}];

const BatchStatsTable = ({ data }) => <AnalysisTable data={parseData(data)} columns={columns} type="batch" />;

export default BatchStatsTable;
