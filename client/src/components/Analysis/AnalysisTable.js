import React from 'react';
import ReactTable from 'react-table-v6';
import { PropTypes } from 'prop-types';
import 'react-table-v6/react-table.css';
import TableWrapper from '../../styles/TableStyle';


const AnalysisTable = (props) => {
    const { data, columns } = props;
    return (
		<TableWrapper>
 			<ReactTable
				data = {data}
				columns={columns}
				defaultPageSize={5}
				className="-highlight"
				filterable
        	/>
		</TableWrapper>
    )
};

// proptypes.
AnalysisTable.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object),
	columns: PropTypes.arrayOf(PropTypes.shape({
		Header: PropTypes.string,
		accessor: PropTypes.string,
		minWidth: PropTypes.number
	}))
}

export default AnalysisTable;