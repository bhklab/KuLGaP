import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';

import colors from '../../styles/colors'
import AnalysisContext from '../Context/AnalysisContext';

const StyledAnalysis = styled.div`
  width: 100%;
  display:flex;
  flex-direction:column;
  align-items: center;
  .analysis-header {
    color: ${colors.pink_main};
    align-self: flex-start;
    margin: 0 0 10px;
  }
  .container {
    width: 100%;
    background-color: ${colors.pink_main};
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
  const { data, loading } = analysisState

  // later we can change it to render conditionally only when data is present
  // if not we can add a loading component

  return (
    <StyledAnalysis>
      <h3 className="analysis-header">Analysis Results</h3>
      <div className="container">
        <h2>Plots should go here</h2>
      </div>
    </StyledAnalysis>
  )
}

export default Analysis;