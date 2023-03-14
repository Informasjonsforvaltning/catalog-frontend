import {createGlobalStyle} from 'styled-components';
import reset from './reset';
import {Colour, theme} from '@fellesdatakatalog/theme';

const GlobalStyle = createGlobalStyle`
  ${reset}
  
  html {
    font-family: ${theme.fontFamily()};
    font-display: swap;
    font-size: 16px; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: inherit;
    line-height: inherit;
    background-color: ${theme.colour(Colour.GREEN, 'G15')};
    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyle;
