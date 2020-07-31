import React from 'react';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
import TableWrapper from '../../styles/TableStyle';

const columns = [
    {
        Header: 'key',
        accessor: 'key',
        maxWidth: 210,
    },
    {
        Header: 'value',
        accessor: 'value',
    },
];

const Summary = (props) => {
    const { data } = props;
    console.log(data);
    const TheadComponent = (props) => null;

    // const tableData = [{ key: 1, value: 1 }, { key: 2, value: 2 }]
    const tableData = Object.entries(data).map((el) => ({ key: el[0], value: el[1] }));
    return (
        <TableWrapper>
            <h3>Summary</h3>
            <ReactTable
                data={tableData}
                columns={columns}
                TheadComponent={TheadComponent}
                defaultPageSize={tableData.length}
                className="-highlight"
                filterable={false}
                showPagination={false}
            />
        </TableWrapper>
    );
};

export default Summary;
