import React from 'react';
import ReactTable from 'react-table-v6';
import { PropTypes } from 'prop-types';
import 'react-table-v6/react-table.css';
import TableWrapper from '../../styles/TableStyle';


const AnalysisTable = (props) => {
    const { data, columns, type } = props;
    return (
		<TableWrapper>
			{
				type === 'model' 
				? <h3>Statistics (Model Response)</h3>
				: <h3>Statistics (Batch Response)</h3>
			}
 			<ReactTable
				data = {data}
				columns={columns}
				defaultPageSize={type === 'model' ? 10 : 2}
				className="-highlight"
				filterable={type === 'model'}
				showPagination={type === 'model'}
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