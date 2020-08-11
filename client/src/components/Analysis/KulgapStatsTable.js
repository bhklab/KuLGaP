import React from 'react';
import AnalysisTable from './AnalysisTable';

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

const TheadComponent = () => null; // a component returning null (to hide).

const parseData = (data) => [
    {
        key: 'KuLGaP Stat',
        value: data.kl,
    },
    {
        key: 'p_value',
        value: data.kl_p_value,
    },
];

const KulgapStatsTable = ({ data }) => <AnalysisTable data={parseData(data)} columns={columns} type="kulgap" TheadComponent={TheadComponent} />;

export default KulgapStatsTable;
