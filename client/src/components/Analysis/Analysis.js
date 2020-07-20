import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';
import AnalysisContext from '../Context/AnalysisContext';
import ModelStatsTable from './ModelStatsTable'

const StyledAnalysis = styled.div`
  width: 100%;
  display:flex;
  flex-direction:column;
  align-items: center;

  .analysis-header {
    color: ${colors.main};
    align-self: flex-start;
    margin: 0 0 10px;
    font-size: 24px;
    font-weight: 700;
  }

  .container {
    width: 100%;
    background-color: white;
    border-radius: 25px;
    display:flex;
    flex-direction:column;
    justify-content: center;
    padding: 40px;
    margin-bottom: 30px;
  }
`;

function Analysis() {
    const { analysisState } = useContext(AnalysisContext);
    const { data, loading } = analysisState;

    // later we can change it to render conditionally only when data is present
    // if not we can add a loading component

  console.log('API DATA', data);

    return (
        <StyledAnalysis>
            <h2 className="analysis-header">Analysis Results</h2>
            <div className="container">
            	<ModelStatsTable/>
            </div>
        </StyledAnalysis>
    );
}

export default Analysis;
