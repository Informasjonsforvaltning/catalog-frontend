import {Colour, theme} from '@fellesdatakatalog/theme';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface PageTitleProps {
  children: React.ReactNode;
}

const StyledPageTitle = styled.h1`
  width: 100%;
  height: ${theme.spacing('S32')};
  font-style: normal;
  font-weight: ${theme.fontWeight('FW700')};
  font-size: ${theme.fontSize('FS28')};
  line-height: ${theme.spacing('S16')};
  color: ${theme.colour(Colour.NEUTRAL, 'N60')};
`;

export function PageTitle({children}: PageTitleProps) {
  return <StyledPageTitle>{children}</StyledPageTitle>;
}

export default PageTitle;
