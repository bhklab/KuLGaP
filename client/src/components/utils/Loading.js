import React from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import colors from '../../styles/colors';

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 300px;
    padding: 0 10px 10px;
    margin: auto;
    width: 150px;
    text-align: center;
    h3 {
        color: ${colors.main};
    }
`;

const LoadingComponent = () => (
    <StyledContainer>
        <h3>Please wait, we are processing your data...</h3>
        <ReactLoading type="spokes" width={150} height={150} color={colors.main} />
    </StyledContainer>
);

export default LoadingComponent;
