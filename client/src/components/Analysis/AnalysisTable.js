import React from 'react';
import ReactTable from 'react-table-v6';
import { PropTypes } from 'prop-types';
import 'react-table-v6/react-table.css';
import Collapsible from 'react-collapsible';
import styled from 'styled-components';
import TableWrapper from '../../styles/TableStyle';
import colors from '../../styles/colors';

const StyledCollapsible = styled.div`
    .Collapsible__trigger {
        color: ${colors.tussock};
        font-size: calc(0.35vw + 1.0em) !important;
        font-weight: 700;
        display: block;
        margin-bottom: 15px;
        border-radius: 10px;
        background: white;
        :hover {
            color: ${colors.main};
            cursor: pointer;
        }
    }
`;

const reactTable = (data, columns, type, TheadComponent) => (
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
            return {};
        }}
    />
);

const renderOutput = (data, columns, type, TheadComponent) => {
    if (type === 'model') {
        return (
            <StyledCollapsible>
                <Collapsible
                    trigger="Statistics (Model Response)"
                >
                    {reactTable(data, columns, type, TheadComponent)}
                </Collapsible>
            </StyledCollapsible>
        );
    }
    return (
        <div>
            <h3> Statistics </h3>
            {reactTable(data, columns, type, TheadComponent)}
        </div>
    );
};

const AnalysisTable = (props) => {
    const {
        data, columns, type, TheadComponent,
    } = props;
    return (
        <TableWrapper>
            {
                renderOutput(data, columns, type, TheadComponent)
            }
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
