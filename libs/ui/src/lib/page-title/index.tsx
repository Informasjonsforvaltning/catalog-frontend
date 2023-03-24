import styled from 'styled-components';

/* eslint-disable-next-line */
export interface PageTitleProps {
  children: React.ReactNode;
}

const StyledPageTitle = styled.h1`
  width: 100%;
  height: 3.2rem;
  font-style: normal;
  font-weight: 700;
  font-size: 2.8rem;
  line-height: 1.6rem;
  color: #2d3741;
`;

export function PageTitle({children}: PageTitleProps) {
  return <StyledPageTitle>{children}</StyledPageTitle>;
}

export default PageTitle;
