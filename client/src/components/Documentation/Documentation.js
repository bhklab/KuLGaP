import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import bgImg from '../../images/bg.png';
import colors from '../../styles/colors';
import input from '../../images/input.png';
import stats from '../../images/stats.png';
import model from '../../images/model.png';
import graph from '../../images/graph.png';

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
    padding-bottom: 1vh;
    font-weight: 600;
  }

  h3 {
    font-size: calc(.4vw + 1.25em);
    color: ${colors.tussock};
    margin-left: 6vw;
    margin-top: 40px !important;
    text-align: left;
    font-weight: 600;
  }

  h4 {
    font-size: calc(.4vw + 1.0em) !important;
    color: ${colors.main};
    font-weight: 400;
    margin-left: 10vw;
    margin-right: 10vw;
    text-align: justify;
    margin-top: 7px;
    margin-bottom: 0px;
  }

  ul {
    list-style: none; /* Remove default bullets */
  }

  ul li::before {
    content: "\\2022"; 
    color: ${colors.tussock};
  }

  li {
    font-size: calc(.3vw + 1.0em);
    color: ${colors.main};
    font-weight: 400;
    margin-left: 10vw;
    margin-right: 10vw;
    text-align: justify;
  }

  span {
    color: ${colors.tussock};
    font-weight: 500;
  }
`;

const outputDescription = {
    KuLGaP: `This is our newly introduced measure. The Estimate value corresponds to the KL divergence between the Control and Treatment Gaussian Processes and the corresponding p-value.
              The Responder fields indicates whether KuLGaP classifies the experiment as a Responder or not.`,
    TGI: 'We show the Tumour Growth Indicator (Estimate) and the corresponding classification as a Responder or not.',
    Angle: 'We calculate the average Angle of Response (Estimate) and the corresponding classification as a Responder or not.',
    mRECIST: 'Here, for each Treatment arm, the mRECIST classification (mCR, mPR, mSD, mPD) and Best Average Response are shown.',
    AUC: 'The Area under the curve is also calculated.',
};

const Documentation = () => (
    <StyledDocumentation>
        <Link to="/" className="home-button">
            <button type="button"> Home </button>
        </Link>
        <h2> Documentation </h2>
        <div>
            <h3> Overview </h3>
            <h4>
                Quantifying response to drug treatment in mouse models of human cancer is challenging.
                A preferred measure to quantify this response should ideally take into account as much of the experimental data as possible,
                i.e. both tumor size over time and the variation among replicates. We propose such a measure, KuLGaP,
                which is based on modelling the tumor growth curves using Gaussian processes and
                using the Kullback-Leibler divergence to compute the difference between the treatment and a control arm.
                We obtain a more specific measure that is able to capture the most promising therapies while reducing the risk of false positive calls.
                <br />
                <br />
                This web application allows users to calculate KuLGaP as well as several other measurements of response to anti-tumour therapy.
            </h4>
            <h3> Input Data Format </h3>
            <h4>
                The input for KuLGaP is a sequence of PDX tumour growth curves. There are usually several Control and several Treatment arms.
                It is assumed that the time axis is the same for all curves.
                The input file should be a CSV containing a table with
                {' '}
                <i> C+T+1 </i>
                , where C and T are the number of
                {' '}
                <i> Control </i>
                {' '}
                and
                {' '}
                <i> Treatment </i>
                {' '}
                arms respectively.
                Each row corresponds to one time point, each column to one of the arms, with the first column indicating the number of days from the experiment start.
            </h4>
            <img src={input} className="images" alt="Input" />
            <h3> Output Data </h3>
            <h4> Several response measures are calculated: </h4>
            <ul>
                {
                    Object.keys(outputDescription).map((key) => (
                        <li>
                            <span>
                                {' '}
                                {key}
                                :
                                {' '}
                            </span>
                            {outputDescription[key]}
                        </li>
                    ))
                }
            </ul>
            <img src={stats} className="images" alt="Stats" />
            <img src={model} className="images" alt="Model Response" />
            <img src={graph} className="images" alt="Growth Curve" />
        </div>
    </StyledDocumentation>
);

export default Documentation;
