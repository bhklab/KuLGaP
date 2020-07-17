import React from 'react';
import ReactTable from 'react-table-v6';
import { PropTypes } from 'prop-types';
import 'react-table-v6/react-table.css';


const AnalysisTable = (props) => {
    const { data, columns } = props;
    return (
        <ReactTable
            data = {data}
            columns={columns}
        />
    )
};


AnalysisTable.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object),
	columns: PropTypes.arrayOf(PropTypes.shape({
		Header: PropTypes.string,
		accessor: PropTypes.string
	}))
}

export default AnalysisTable;