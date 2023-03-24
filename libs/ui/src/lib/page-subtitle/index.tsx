import styled from 'styled-components';

/* eslint-disable-next-line */
export interface PageSubtitleProps {
  children: React.ReactNode;
}

const StyledPageSubtitle = styled.h2`
  width: 100%;
  height: 1.6rem;
  font-style: normal;
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 1.6rem;
  color: #2d3741;
`;

export function PageSubtitle({children}: PageSubtitleProps) {
  return <StyledPageSubtitle>{children}</StyledPageSubtitle>;
}

export default PageSubtitle;
