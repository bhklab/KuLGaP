import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';
import AnalysisContext from '../Context/AnalysisContext';
import ModelStatsTable from './ModelStatsTable';
import BatchStatsTable from './BatchStatsTable';
import Summary from './Summary';
import TumorGrowthCurve from '../GrowthCurve/TumorGrowthCurve';

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
    // align-items: center;
  }
`;

function Analysis(props) {
    const { analysisState } = useContext(AnalysisContext);
    const { data, summary } = analysisState;

    // later we can change it to render conditionally only when data is present
    // if not we can add a loading component

    return (
        <StyledAnalysis>
            <h2 className="analysis-header">Analysis Results</h2>
            <div className="container">
                <TumorGrowthCurve data={data} patientParam="unknown" drugParam="unknow" />
            </div>
            { summary ? (
                <div className="container">
                    <Summary data={summary} />
                </div>
            ) : null}
            <div className="container">
                <BatchStatsTable />
            </div>
            <div className="container">
                <ModelStatsTable />
            </div>
        </StyledAnalysis>
    );
}

export default Analysis;
