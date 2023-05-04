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
`;

export default GlobalStyle;
