import React, { useState } from 'react';
import FormUpload from '../FormUpload/FormUpload';
import Analysis from '../Analysis/Analysis';
import AnalysisContext from '../Context/AnalysisContext';
import logo from '../../images/logo.png';

function Home() {
    const [analysisState, setAnalysisState] = useState({ data: null, summary: null, loading: false, error: null });
    const { data, loading } = analysisState;
    console.log(analysisState);
    return (
        <AnalysisContext.Provider value={{ analysisState, setAnalysisState }}>
            <main className="home-form">
                <div className="header-container">
                    <img alt="logo" className="logo" src={logo} />
                </div>
                <h2>KulGap description goes here</h2>
                <FormUpload />
                {analysisState['data'] !== null ? <Analysis /> : <div/>}
            </main>
        </AnalysisContext.Provider>
    );
}

export default Home;
