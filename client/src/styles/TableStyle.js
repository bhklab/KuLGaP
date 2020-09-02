import styled from 'styled-components';
import colors from './colors';

const TableWrapper = styled.div`
    padding:10px 20px 30px 20px;

    h3 {
        color:  ${colors.tussock};
        text-align: left !important;
        font-size: calc(0.35vw + 1.0em);
        margin-top: 0px !important;
        margin-bottom: 15px !important;
    }

    .ReactTable *, .ReactTable {
        box-sizing: border-box;
        border: 0px solid !important;
    }

    .ReactTable .rt-table {
        align-items: stretch;
        width: 100%;
        border-collapse: collapse;
        overflow: auto
    }

    .ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover {
        background: #EAEFF9
    }

    .ReactTable .rt-th, .ReactTable .rt-td {
        border-top: 1.0px solid ${colors.pale_blue} !important;
        border-right: 1.0px solid ${colors.pale_blue} !important;
        &:first-child {
            border-left: 1.0px solid ${colors.pale_blue} !important;
        }
    }

    .ReactTable .rt-thead {
        color:  ${colors.main};
        font-size: calc(0.20vw + 1.0em);
        font-weight: 600;
        box-shadow: none !important;
    }

    .ReactTable .rt-tbody {
        color:  ${colors.main};
        font-size: calc(0.10vw + 1.0em);
        box-shadow: none !important;
        border-bottom: 1.0px solid ${colors.pale_blue} !important;
        text-align: center;
    }

    .-previous, .-next, .-btn {
      background: ${colors.main};
      color:white !important;
    }

    .-pagination, .pagination-bottom {
        box-shadow: none !important;
        border: 1px solid ${colors.pale_blue} !important;
    }

    .ReactTable .-pagination .-pageJump input, input{
        color: ${colors.main};
        box-shadow: none !important;
        background: #EAEFF9 !important;
    }

    .ReactTable .-pagination select {
        color: ${colors.main};
    }
`;

export default TableWrapper;
