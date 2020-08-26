import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormUpload from '../FormUpload/FormUpload';
import Analysis from '../Analysis/Analysis';
import AnalysisContext from '../Context/AnalysisContext';
import LoadingComponent from '../utils/Loading';
import logo from '../../images/logo.png';

function Home() {
    const [analysisState, setAnalysisState] = useState({
        data: null, summary: null, loading: false, error: null,
    });
    const {
        loading, summary,
    } = analysisState;
    return (
        <div className="App">
            <Link to="/doc" className="documentation-button">
                <button type="button"> Documentation </button>
            </Link>
            <AnalysisContext.Provider value={{ analysisState, setAnalysisState }}>
                <main className="home-form">
                    <div className="header-container">
                        <a href="https://www.kulgap.ca" target="_blank" rel="noreferrer">
                            <img alt="logo" className="logo" src={logo} />
                        </a>
                    </div>
                    <h3> Robust Quantification of Therapy Response in Xenografts </h3>
                    <FormUpload />
                    {
                        !loading ? (
                            <>
                                {summary ? <Analysis /> : <div />}
                            </>
                        ) : <LoadingComponent />
                    }
                </main>
            </AnalysisContext.Provider>
        </div>
    );
}

export default Home;
