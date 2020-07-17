import React from 'react';
import output_stat from '../../data/output_stat'
import AnalysisTable from './AnalysisTable'

const TableData = () => {
    const returnList = [];
    const columns = Object.keys(output_stat);
    columns.map((column, i) => {
        if(!i) {
            Object.keys(output_stat[column]).map(row => {
                returnList.push({
                    [column] : output_stat[column][row]
                })
            })
        } else {
            Object.keys(output_stat[column]).map((row, i) => {
                returnList[i][column] = output_stat[column][row];
            })
        }
    })
    return <AnalysisTable data={returnList}/>
};

export default TableData;