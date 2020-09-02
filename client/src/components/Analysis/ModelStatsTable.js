import React from 'react';
import AnalysisTable from './AnalysisTable';
import FixedPoint from '../utils/FixedPoint';

const columns = [
    {
        Header: 'Drug',
        accessor: 'drug',
        minWidth: 100,
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
];

/**
 *
 * @param {Array} data
 */
const parseData = (data) => {
    const newData = [];
    const cleanData = (value) => JSON.parse(JSON.stringify(value)).split('_').map((val) => val.replace(/[0-9].*:/, ''));
    // AUC.
    Object.keys(data.auc).forEach((val) => {
        const auc = FixedPoint(data.auc[val]);
        newData.push({
            AUC: auc,
            drug: data.drug,
            model: 'unknown',
        });
    });
    // AUC CONTROL.
    cleanData(data.auc_control).forEach((val) => {
        newData.push({
            AUC: FixedPoint(val),
            drug: 'control',
            model: 'unknown',
        });
    });
    // mRECIST and mRECIST CONTROL.
    let j = 0;
    [Object.keys(data.mRECIST), Object.keys(data.mRECIST_control)].forEach((element, i) => {
        element.forEach((val) => {
            const values = i ? data.mRECIST_control[val] : data.mRECIST[val];
            newData[j].mRECIST = values.replace('m', '');
            j++;
        });
    });
    // BEST AVERAGE RESPONSE and BEST AVERAGE RESPONSE CONTROL.
    let k = 0;
    [data.best_avg_response, data.best_avg_response_control].forEach((element) => {
        element.forEach((val) => {
            if (newData[k]) {
                newData[k].bar = FixedPoint(val);
                k++;
            }
        });
    });
    // SLOPES.
    // BEST AVERAGE RESPONSE and BEST AVERAGE RESPONSE CONTROL.
    let z = 0;
    [data.lm_slopes_control, data.lm_slopes].forEach((element) => {
        element.forEach((val) => {
            if (newData[z]) {
                newData[z].slope = FixedPoint(val);
                z++;
            }
        });
    });
    return newData;
};

const ModelStatsTable = ({ data }) => {
    const tableData = parseData(data);
    // adds model column if there is at least one known model
    if (tableData.some((row) => row.model !== 'unknown')) {
        columns.unshift({
            Header: 'Model',
            accessor: 'model',
            minWidth: 100,
        });
    }
    return (<AnalysisTable data={tableData} columns={columns} type="model" />);
};

export default ModelStatsTable;
