import React from 'react';
import styled from 'styled-components';
import { exportComponentAsPNG } from 'react-component-export-image';
import colors from '../../styles/colors';
import downloadIcon from '../../images/download1.svg';

const StyledButton = styled.div`
    font-weight: 500;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    
    button {
      background-color: ${colors.main} !important;
      color: white !important;
      padding: 6px !important;
      padding-left: 10px !important;
      margin-right: 5px;
      border-radius: 6px;
      border: 0px;
      font-size: 1.0em;
      :hover {
        color: ${colors.main} !important;
        background-color: ${colors.gray_bg} !important;
        cursor: pointer;
      }
    }
    img {
        display: inline-block;
        height: 18px;
        width: 25px;
    }
`;

const DownloadButton = (props) => {
    const { componentRef } = props;
    return (
        <StyledButton>
            <button onClick={() => exportComponentAsPNG(componentRef)} type="button">
                Export as PNG
                <img src={downloadIcon} alt="download icon" />
            </button>
        </StyledButton>
    );
};

export default DownloadButton;
