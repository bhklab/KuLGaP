import React, { useState } from 'react';
import UploadForm from '../UploadForm/UploadForm';
import Analysis from '../Analysis/Analysis';
import AnalysisContext from '../Context/AnalysisContext';
import logo from '../../images/logo.png';

function Home() {
    const [analysisState, setAnalysisState] = useState({ data: null, loading: false });
    const { data, loading } = analysisState;
    return (
        <AnalysisContext.Provider value={{ analysisState, setAnalysisState }}>
            <main className="home-form">
                <div className="header-container">
                    <img alt="logo" className="logo" src={logo} />
                </div>
                <h2>KulGap description goes here</h2>
                <UploadForm />
                <Analysis />
            </main>
        </AnalysisContext.Provider>
    );
}

export default Home;
