import React from 'react';
import output_stat from '../../data/output_stat'
import AnalysisTable from './AnalysisTable'

const TableData = () => {
    const returnDataList = [];
    const columns = Object.keys(output_stat);
    // to get the transformed data for the stats table.
    columns.forEach((column, i) => {
        if(!i) {
            Object.keys(output_stat[column]).forEach(row => {
                returnDataList.push({
                    [column] : output_stat[column][row]
                })
            })
        } else {
            Object.keys(output_stat[column]).forEach((row, i) => {
                returnDataList[i][column] = output_stat[column][row];
            })
        }
    })
    // to get the columns for the stats table.
    const column_data = columns.map(value => {
        return {
            Header: value,
            accessor: value
        }
    })
    return <AnalysisTable data={returnDataList} columns={column_data}/>
};

export default TableData;