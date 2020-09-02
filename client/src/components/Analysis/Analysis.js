import React, {
    useContext,
} from 'react';
import styled from 'styled-components';
import colors from '../../styles/colors';
import AnalysisContext from '../Context/AnalysisContext';
import ModelStatsTable from './ModelStatsTable';
import BatchStatsTable from './BatchStatsTable';
// import KulgapStatsTable from './KulgapStatsTable';
import TumorGrowthCurve from '../GrowthCurve/TumorGrowthCurve';

const StyledAnalysis = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .analysis-header {
    color: ${colors.main};
    align-self: flex-start;
    margin: 0 0 20px;
    font-size: calc(0.5vw + 1.0em);
    font-weight: 700;
    text-align: center !important;
  }

  .container {
    width: 100%;
    background-color: white;
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
    margin-bottom: 30px;
    svg {
      display: flex;
      margin: auto;
    }
  }
`;

const Analysis = () => {
    const { analysisState } = useContext(AnalysisContext);
    const { data, summary } = analysisState;

    return (
        <StyledAnalysis>
            <h2 className="analysis-header">Analysis Results</h2>
            <div className="container">
                <BatchStatsTable data={summary} />
            </div>
            <div className="container">
                <TumorGrowthCurve data={data} patientParam="unknown" drugParam="unknow" />
            </div>
            <div className="container">
                <ModelStatsTable data={summary} />
            </div>
        </StyledAnalysis>
    );
};

export default Analysis;
