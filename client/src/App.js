import React, { useEffect } from 'react';
import { Normalize } from 'styled-normalize';
import GlobalStyles from './styles/GlobalStyles';
import ReactGA from 'react-ga';

import Home from './components/Home/Home';

const App = () => {
    // Google analytics setup.
    useEffect(() => {
        ReactGA.initialize('UA-102362625-9');
        // To Report Page View
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);

    return (
        <div className="App">
            <Normalize />
            <GlobalStyles />
            <Home />
        </div>
    );
}

export default App;
