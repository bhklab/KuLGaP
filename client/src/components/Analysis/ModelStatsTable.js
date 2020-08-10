import React from 'react';
import AnalysisTable from './AnalysisTable';

const columns = [
    {
        Header: 'Model',
        accessor: 'model',
        minWidth: 100,
    },
    {
        Header: 'Drug',
        accessor: 'drug',
        minWidth: 100
    },
    {
        Header: 'mRECIST',
        accessor: 'mRECIST',
        minWidth: 120,
    },
    {
        Header: 'Best Average Response',
        accessor: 'bar',
        minWidth: 230,
    },
    {
        Header: 'Slope',
        accessor: 'slope',
        minWidth: 100,
    },
    {
        Header: 'AUC',
        accessor: 'AUC',
        minWidth: 100,
    },
    // {
    //     Header: 'Survival (Days)',
    //     accessor: 'survival',
    //     minWidth: 170,
    // },
];

// const parseData = (data) => {
//     // this will create newData array of objects for the table.
//     const newData = [];
//     let total = 0;
//     let drugValue = '';
//     let modelValue = '';

//     data.forEach((eachdata) => {
//         if (newData.length === 0 || drugValue !== eachdata.drug_name || modelValue !== eachdata.model) {
//             newData.push({});
//             drugValue = eachdata.drug_name;
//             modelValue = eachdata.model;
//             newData[total].model = modelValue;
//             newData[total].drug = drugValue;
//             newData[total].patient = eachdata.patient;
//             newData[total].link = eachdata.link;
//             newData[total].row = eachdata.row;
//             total += 1;
//         }
//         newData[total - 1][eachdata.response_type === 'best.average.response' ? 'bar' : eachdata.response_type] = eachdata.value;
//     });
//     return newData;
// };

const parseData = (data) => {
    const newData = [];
    const cleanData = (value) => JSON.parse(JSON.stringify(value)).split('_').map((val) => val.replace(/[0-9].*:/, ''));
    cleanData(data.auc).forEach((val) => {
        newData.push({
            AUC: Number(val).toFixed(4),
            drug: data.drug,
            patient: 'unknown',
            model: 'unknown',
        });
    });
    cleanData(data.auc_control).forEach((val) => {
        newData.push({
            AUC: Number(val).toFixed(4),
            drug: 'control',
            patient: 'unknown',
            model: 'unknown',
        });
    });
    cleanData(data.mRECIST).forEach((val, i) => {
        newData[i].mRECIST = val.replace('m', '');
    });
    return newData;
};

const ModelStatsTable = ({ data }) => <AnalysisTable data={parseData(data)} columns={columns} type="model" />;

export default ModelStatsTable;
