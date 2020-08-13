import React from 'react';
import ReactTable from 'react-table-v6';
import { PropTypes } from 'prop-types';
import 'react-table-v6/react-table.css';
import TableWrapper from '../../styles/TableStyle';
import colors from '../../styles/colors';

const checkType = (type) => {
    if (type === 'model') {
        return <h3> Statistics (Model Response) </h3>;
    }
    // if (type === 'batch') {
    //     return <h3> Statistics (Batch Response) </h3>;
    // }
    return <h3> Statistics </h3>;
};

const AnalysisTable = (props) => {
    const {
        data, columns, type, TheadComponent,
    } = props;
    return (
        <TableWrapper>
            {
                checkType(type)
            }
            <ReactTable
                data={data}
                columns={columns}
                defaultPageSize={type === 'model' ? 10 : data.length}
                className="-highlight"
                filterable={type === 'model'}
                showPagination={type === 'model'}
                TheadComponent={TheadComponent}
                getTrProps={(state, rowInfo) => {
                    if (rowInfo) {
                        return {
                            style: {
                                fontWeight: rowInfo.original.name === 'KuLGaP' ? '600' : 'normal',
                                color: rowInfo.original.name === 'KuLGaP' ? `${colors.tussock}` : `${colors.main}`,
                            },
                        };
                    }
                }}
            />
        </TableWrapper>
    );
};

// proptypes.
AnalysisTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        Header: PropTypes.string,
        accessor: PropTypes.string,
        minWidth: PropTypes.number,
    })).isRequired,
};

export default AnalysisTable;
