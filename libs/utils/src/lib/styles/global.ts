import {createGlobalStyle} from 'styled-components';
import reset from './reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  
  html {
    font-family: Heebo,sans-serif;
    font-display: swap;
    font-size: 16px; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: inherit;
    line-height: inherit;
    background-color: #FAFAFA;
    margin: 0;
    padding: 0;
  }

  .container {
    width: 100%;
    padding-right: 0.75rem;
    padding-left: 0.75rem;
    margin-right: auto;
    margin-left: auto;
  }

  @media (min-width: 1200px) {
    .container {
      max-width: 1140px;
    }
  }

  @media (min-width: 1400px) {
    .container {
      max-width: 1320px;
    }
  }  
`;

export default GlobalStyle;
