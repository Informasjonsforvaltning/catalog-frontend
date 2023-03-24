import Link from 'next/link';
import styled, {css} from 'styled-components';

const StyledBreadcrumbs = styled.nav`
  color: #335380;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 1.6rem 1.6rem 0 1.6rem;
  overflow-wrap: break-word;
`;

const linkStyle = css`
  text-decoration: none;
  border-bottom: solid 1px;
  padding-bottom: 0.5px;
  font-style: normal;
  font-weight: 400;
  line-height: 2.4rem;
  color: #335380;

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
  color: #335380;
`;

const Separator = styled.span`
  height: 0.8rem;
  width: 0.4rem;
  margin: 0 1rem 0 1rem;
`;

const Divider = styled.hr`
  margin-top: 1.2rem;
  border: #d5e1f2 1px solid;
  width: 100vw;
`;

export default StyledBreadcrumbs;
export {InternalLink, ExternalLink, Separator, DeactiveLink, Divider};
