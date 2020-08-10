import React from 'react';
import ReactTable from 'react-table-v6';
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
