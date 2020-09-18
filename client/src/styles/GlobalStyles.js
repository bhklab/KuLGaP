import { createGlobalStyle } from 'styled-components';
import colors from './colors';
import bgImg from '../images/bg.png';

const GlobalStyles = createGlobalStyle`
    * {
        font-family: 'Sen', sans-serif;
    }
    
    h1, h2, h3 {
        margin: 0;
        color: ${colors.main};
        font-weight: 500;
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
        font-weight: 700 !important;
    }

    .documentation-button, .home-button {
        align-self: flex-end !important;
        button {
            margin-top: 30px;
            margin-left: 30px;
            margin-right: 30px;
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
            font-size: calc(0.15vw + 1.0em);
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
    }

    .home-button {
        float: right;
    }

    main {
        width: 55%;
        margin-top: 6vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 50%;
        // background:rgb(0,0,0,0.5);
    }

    @media only screen and (max-width: 1200px) {
        main {
            width: 65%
        }
    }

    @media only screen and (max-width: 1160px) {
        main {
            width: 67%
        }
    }

    @media only screen and (max-width: 1130px) {
        main {
            width: 69%
        }
    }

    @media only screen and (max-width: 1100px) {
        main {
            width: 75%
        }
    }
    
    .logo, .images {
        width: 80% !important;
        padding-top: 20px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    .images {
        width: 55% !important;
        padding-bottom: 20px;
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
