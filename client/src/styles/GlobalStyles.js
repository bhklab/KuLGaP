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

    .documentation-button {
        align-self: flex-end !important;
        margin: 30px;
        background: ${colors.main};
        color: white;
        border: none;
        cursor: pointer;
        padding: 10px;
        border-radius: 6px;
        font-weight: 600;
        outline: none;
        transition: all ease-out 0.25s;
        min-height: 40px;
        font-size: calc(0.20vw + 1.0em);
        &:hover {
            color: ${colors.main};
            background: white;
        };
        &.disabled {
            cursor: default;
            background: #778899;
            color: white;
        }
    }

    main {
        width: 60%;
        margin-top: 8vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 50%;
        // background:rgb(0,0,0,0.5);
    }
    
    .logo {
        width: 80% !important;
        padding-top: 20px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .App {
        width: 100vw;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0), 
            rgba(0, 0, 0, 0)
        ),url('${bgImg}');
        background-size: cover;
        background-attachment: fixed;
        background-position: center;
        z-index: 0
        .main-wrapper {
            overflow-x: hidden;
        }
    }
}
`;

export default GlobalStyles;
