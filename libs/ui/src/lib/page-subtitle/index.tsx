import {Colour, theme} from '@fellesdatakatalog/theme';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface PageSubtitleProps {
  children: React.ReactNode;
}

const StyledPageSubtitle = styled.h2`
  width: 100%;
  height: ${theme.spacing('S16')};
  font-style: normal;
  font-weight: ${theme.fontWeight('FW400')};
  font-size: ${theme.fontSize('FS14')};
  line-height: ${theme.spacing('S16')};
  color: ${theme.colour(Colour.NEUTRAL, 'N60')};
`;

export function PageSubtitle({children}: PageSubtitleProps) {
  return <StyledPageSubtitle>{children}</StyledPageSubtitle>;
}

export default PageSubtitle;
