import React from 'react';
import ReactTable from 'react-table-v6';
import { PropTypes } from 'prop-types';
import 'react-table-v6/react-table.css';
import Collapsible from 'react-collapsible';
import styled from 'styled-components';
import { CSVLink } from 'react-csv';
import TableWrapper from '../../styles/TableStyle';
import colors from '../../styles/colors';
import downloadIcon from '../../images/download1.svg';

const StyledCollapsible = styled.div`
    .Collapsible__trigger {
        color: ${colors.tussock};
        font-size: calc(0.35vw + 1em) !important;
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

const StyledLink = styled.div`
    display: inline-block;
    font-weight: 500;
    float: right;
    img {
        display: inline-block;
        height: 18px;
        width: 25px;
        margin-left: 5px;
    }
    a:link {
        background-color: ${colors.main} !important;
        color: white !important;
        padding: 8px !important;
        border-radius: 6px;
        text-decoration: none;
        font-size: 1em;
    }
    a:hover {
        color: ${colors.main} !important;
        background-color: ${colors.gray_bg} !important;
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
                        fontWeight:
                            rowInfo.original.name === 'KuLGaP'
                                ? '600'
                                : 'normal',
                        color:
                            rowInfo.original.name === 'KuLGaP'
                                ? `${colors.tussock}`
                                : `${colors.main}`
                    }
                };
            }
            return {};
        }}
    />
);

const renderOutput = (data, columns, type, TheadComponent) => {
    if (type === 'model') {
        return (
            <>
                <StyledLink>
                    <CSVLink data={data} filename="model.csv">
                        Download Statistics
                        <img src={downloadIcon} alt="download icon!" />
                    </CSVLink>
                </StyledLink>
                <StyledCollapsible>
                    <Collapsible trigger="Statistics (Model Response)">
                        {reactTable(data, columns, type, TheadComponent)}
                    </Collapsible>
                </StyledCollapsible>
            </>
        );
    }
    return (
        <div>
            <h3 style={{ display: 'inline-block' }}> Statistics </h3>
            <StyledLink>
                <CSVLink data={data} filename="batch.csv">
                    Download Statistics
                    <img src={downloadIcon} alt="download icon!" />
                </CSVLink>
            </StyledLink>
            {reactTable(data, columns, type, TheadComponent)}
        </div>
    );
};

const AnalysisTable = props => {
    const { data, columns, type, TheadComponent } = props;
    return (
        <TableWrapper>
            {renderOutput(data, columns, type, TheadComponent)}
        </TableWrapper>
    );
};

// proptypes.
AnalysisTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            Header: PropTypes.string,
            accessor: PropTypes.string,
            minWidth: PropTypes.number
        })
    ).isRequired
};

export default AnalysisTable;
