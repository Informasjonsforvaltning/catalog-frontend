import Link from 'next/link';
import styled, {css} from 'styled-components';
import {Colour, theme} from '@fellesdatakatalog/theme';

const StyledBreadcrumbs = styled.nav`
  color: ${theme.colour(Colour.BLUE, 'B60')};
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: ${theme.spacing('S16')} ${theme.spacing('S16')} 0
    ${theme.spacing('S16')};
  overflow-wrap: break-word;
`;

const linkStyle = css`
  text-decoration: none;
  border-bottom: solid 1px;
  padding-bottom: 0.5px;
  font-style: normal;
  font-weight: ${theme.fontWeight('FW400')};
  line-height: ${theme.spacing('S24')};
  color: ${theme.colour(Colour.BLUE, 'B60')};

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
  font-weight: ${theme.fontWeight('FW400')};
  line-height: ${theme.spacing('S24')};
  color: ${theme.colour(Colour.BLUE, 'B60')};
`;

const Separator = styled.span`
  height: ${theme.spacing('S8')};
  width: ${theme.spacing('S4')};
  margin: 0 ${theme.spacing('S10')} 0 ${theme.spacing('S10')};
`;

const Divider = styled.hr`
  margin-top: ${theme.spacing('S12')};
  border: ${theme.colour(Colour.BLUE, 'B30')} 1px solid;
  width: 100vw;
`;

export default StyledBreadcrumbs;
export {InternalLink, ExternalLink, Separator, DeactiveLink, Divider};
