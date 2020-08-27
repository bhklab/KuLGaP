import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import bgImg from '../../images/bg.png';
import colors from '../../styles/colors';

const StyledDocumentation = styled.div`
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0), 
    rgba(0, 0, 0, 0)
  ),url('${bgImg}');
  width: 100vw;
  min-height: 100vh;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;

  h2 {
    font-size: calc(1.50vw + 1.5em);
    margin: 0px !important;
    padding-top: 10vh !important;
    padding-bottom: 5vh;
    font-weight: 600;
  }

  h3 {
    font-size: calc(.9vw + 1.5em);
    color: ${colors.tussock};
    margin-left: 6vw;
    text-align: left;
    font-weight: 600;
  }

  h4 {
    font-size: calc(.40vw + 1.0em) !important;
    color: ${colors.main};
    font-weight: 400;
    margin-left: 10vw;
    margin-right: 10vw;
    text-align: justify;
    margin-top: 7px;
  }

  li {
    font-size: calc(1.0vw + 1.5em);
  }
`;

const Documentation = () => (
    <StyledDocumentation>
        <Link to="/" className="home-button">
            <button type="button"> Home </button>
        </Link>
        <h2> Documentation </h2>
        <div>
            <h3> Overview </h3>
            <h4>
                KuLGaP is a web application providing .....
                Quantifying response to drug treatment in mouse models of human cancer is challenging.
                A preferred measure to quantify this response should ideally take into account as much of
                the experimental data as possible, i.e. both tumor size over time and the variation among replicates.
                We propose such a measure, KuLGaP, which is based on modelling the tumor
                growth curves using Gaussian processes and using the Kullback-Leibler divergence to
                compute the difference between the treatment and a control arm. We obtain a
                more specific measure that is able to capture the most promising therapies while
                reducing the risk of false positive calls.
            </h4>
        </div>
    </StyledDocumentation>
);

export default Documentation;
