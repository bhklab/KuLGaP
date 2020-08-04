import React, { useState } from 'react';
import FormUpload from '../FormUpload/FormUpload';
import Analysis from '../Analysis/Analysis';
import AnalysisContext from '../Context/AnalysisContext';
import LoadingComponent from '../utils/Loading';
import logo from '../../images/logo.png';

function Home() {
    const [analysisState, setAnalysisState] = useState({
        data: null, summary: null, loading: false, error: null, showResults: false,
    });
    const {
        data, loading, summary, showResults,
    } = analysisState;
    console.log(analysisState);
    return (
        <AnalysisContext.Provider value={{ analysisState, setAnalysisState }}>
            <main className="home-form">
                <div className="header-container">
                    <img alt="logo" className="logo" src={logo} />
                </div>
                <h3>Robust Quantification of Therapy Response in Xenografts</h3>
                <FormUpload />
                {!loading ? (
                    <>
                        {showResults ? <Analysis /> : <div />}
                    </>
                ) : <LoadingComponent />}
            </main>
        </AnalysisContext.Provider>
    );
}

export default Home;
