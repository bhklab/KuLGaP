import React from 'react';
import { Normalize } from 'styled-normalize';
import GlobalStyles from './styles/GlobalStyles';

import Home from './components/Home/Home';

function App() {
    return (
        <div className="App">
            <Normalize />
            <GlobalStyles />
            <Home />
        </div>
    );
}

export default App;
