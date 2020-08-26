import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Normalize } from 'styled-normalize';
import ReactGA from 'react-ga';
import GlobalStyles from './styles/GlobalStyles';

import Home from './components/Home/Home';
import Documentation from './components/Documentation/Documentation';

const App = () => {
    // Google analytics setup.
    useEffect(() => {
        ReactGA.initialize('UA-102362625-9');
        // To Report Page View
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);

    return (
        <div>
            <Router>
                <Normalize />
                <GlobalStyles />
                <Route path="/" exact component={Home} />
                <Route path="/doc" exact component={Documentation} />
            </Router>
        </div>
    );
};

export default App;
