import { createGlobalStyle } from 'styled-components';
import colors from './colors';
import bgImg from '../images/bg.png';

const GlobalStyles = createGlobalStyle`

    h1, h2, h3 {
        margin: 0;
        color: ${colors.main};
        font-family: 'Sen', sans-serif;
        font-weight: 400;
        text-align: center;
    }
  
    h1 {
        text-align: left !important;
        font-size: calc(5vw + 5em);
        letter-spacing: 3px;
    }
    h2 {
        font-size: calc(1vw + 1.5em);
    }
    h3 {
        margin-top: 15px !important;
        font-size: calc(0.5vw + 1.5em);
    }
    main {
        width: 60%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 50%;
        // background:rgb(0,0,0,0.5);
    }
    .logo {
        width: 80% !important;
        padding-top: 30px;
    }
    .header-container {
        width:100%;
        display:flex;
        justify-content: center;
        align-items:center;
    }
    .App {
        width: 100%;
    }
    .top-nav {
        h1 {
            text-align: left;
        }
    }
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 300px;
        padding: 10px;
        margin: auto;
        width: 150px;
        text-align: center;
        h3 {
            color: white;
        }
    }

    // plotly styling
    .js-plotly-plot {
        width: 100%;
    }

    #root {
        width: 100vw;
        min-height: 100vh;
        display: flex;
        background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0), 
            rgba(0, 0, 0, 0)
        ),url('${bgImg}');
        background-size: cover;
        background-attachment: fixed;
        background-position: center;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        display: flex;
        z-index: 0
        .main-wrapper {
        overflow-x:hidden;
        }
    }
}
`;

export default GlobalStyles;
