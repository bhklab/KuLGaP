import React from 'react';
import { data } from '../../data/xevdb_model_stats'
import AnalysisTable from './AnalysisTable'

const columns = [
    {
        Header: 'Patient',
        accessor: 'patient',
        minWidth: 170
    },
    {
        Header: 'Model',
        accessor: 'model',
        minWidth: 170
    },
    {
        Header: 'Drug',
        accessor: 'drug',
        minWidth: 170
    },
    {
        Header: 'mRECIST',
        accessor: 'mRECIST',
        minWidth: 170
    },
    {
        Header: 'Best Average Response',
        accessor: 'bar',
        minWidth: 170
    },
    {
        Header: 'Slope',
        accessor: 'slope',
        minWidth: 170
    },
    {
        Header: 'AUC',
        accessor: 'AUC',
        minWidth: 170
    },
    {
        Header: 'Survival (Days)',
        accessor: 'survival',
        minWidth: 170
    },
]

const parseData = (data) => {
    // this will create newData array of objects for the table.
    const newData = [];
    let total = 0;
    let drugValue = '';
    let modelValue = '';
    
    data.forEach((eachdata) => {
        if (newData.length === 0 || drugValue !== eachdata.drug_name || modelValue !== eachdata.model) {
            newData.push({});
            drugValue = eachdata.drug_name;
            modelValue = eachdata.model;
            newData[total].model = modelValue;
            newData[total].drug = drugValue;
            newData[total].patient = eachdata.patient;
            newData[total].link = eachdata.link;
            newData[total].row = eachdata.row;
            total += 1;
        }
        newData[total - 1][eachdata.response_type === 'best.average.response' ? 'bar' : eachdata.response_type] = eachdata.value;
    });
    return newData;
}

const ModelStatsTable = () => <AnalysisTable data={parseData(data)} columns={columns}/>;

export default ModelStatsTable;