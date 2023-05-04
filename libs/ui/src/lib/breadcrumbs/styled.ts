import Link from 'next/link';
import styled, {css} from 'styled-components';

const StyledBreadcrumbs = styled.nav`
  color: #335380;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1140px;
  margin: 1.6rem auto;
  overflow-wrap: break-word;
  padding-left: 1.6rem;
`;

const linkStyle = css`
  text-decoration: none;
  border-bottom: solid 1px;
  padding-bottom: 0.5px;
  font-style: normal;
  font-weight: 400;
  line-height: 2.4rem;
  color: #1e2b3c;

  :hover {
    border-bottom: none;
  }
`;

const InternalLink = styled(Link)`
  ${linkStyle}
`;

const ExternalLink = styled.a`
  ${linkStyle}
`;

const DeactiveLink = styled.span`
  font-style: normal;
  font-weight: 400;
  line-height: 2.4rem;
  color: #1e2b3c;
`;

const Separator = styled.span`
  height: 0.8rem;
  width: 0.4rem;
  margin: 0 1rem 0 1rem;
`;

export default StyledBreadcrumbs;
export {InternalLink, ExternalLink, Separator, DeactiveLink};
