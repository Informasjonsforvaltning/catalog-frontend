import styled from 'styled-components';

import DropdownMenuBase from '../dropdown-menu';

import LogoFDK from './images/fdk-publishing-logo-negative.svg';
import LogoFDKDemo from './images/fdk-publishing-logo-negative-demo.svg';

const Header = styled.header<{ fontColor?: string; background?: string }>`
  background: ${(props) => props.background || '#2d3741'};
  border-bottom: 1px solid rgb(230, 230, 230);
  box-shadow: #969ba0 0px 0px 10px -5px;
  color: ${(props) => props.fontColor || '#fff'};
  display: flex;
  font-size: 16px;
  justify-content: center;
  padding: 0.5rem 0;
  height: 74px;
  width: 100%;
  z-index: 1000;
`;

const Navigation = styled.nav`
  align-items: center;
  display: flex;
  justify-content: space-between;
  overflow-wrap: break-word;
  width: 100%;
`;

const Logo = styled(LogoFDK)`
  height: 45px;
  @media (max-width: 900px) {
    & {
      height: calc(35px + (55 - 35) * ((100vw - 320px) / (900 - 320)));
    }
  }

  & > path {
    fill: #fff;
  }
`;

const LogoDemo = styled(LogoFDKDemo)`
  height: 45px;
  @media (max-width: 900px) {
    & {
      height: calc(35px + (55 - 35) * ((100vw - 320px) / (900 - 320)));
    }
  }
  & > path {
    fill: #fff;
  }
  & > .st1 {
    fill: #f2e1d5;
  }
`;

const MenuButtonContent = styled.div`
  align-items: center;
  display: flex;

  & > svg {
    height: 25px;
    margin-right: 0.3em;

    & > * {
      stroke: currentColor;
    }
  }
`;

const MenuButtonContentSpan = styled.span`
  max-width: 120px;
  @media (min-width: 900px) {
    & {
      max-width: 155px;
    }
  }
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
  font-size: ;
`;

const ButtonLabel = styled.span`
  color: currentColor;
  font-size: 1.6em;
  padding: 0em 0.5em;
`;

const MenuItems = styled.ul`
  display: none;
  margin: 0;
  color: currentColor;

  @media (min-width: 900px) {
    & {
      display: flex;
    }
  }

  & > li:nth-of-type(n + 2) {
    margin-left: 1.6em;
  }
`;

const MenuItem = styled.li`
  list-style-type: none;
  & > * {
    color: currentColor;
  }

  & > a {
    text-decoration: none;
  }

  & > * div {
    border: none;
    padding: 0;

    & > svg {
      margin-left: 0.3rem;
    }
  }
`;

const DropdownMenu = styled(DropdownMenuBase)`
  display: flex;
  color: currentColor;
`;

const MenuButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  appearance: none;
  background: none;
  border: none;
  outline: none;
  color: currentColor;
  cursor: pointer;
  font-size: 1em;
`;

const Menu = styled.ul`
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  color: #121619;
  list-style: none;
  padding: 1em;
  overflow: hidden;

  & > li > a {
    display: block;
    margin-top: 1rem;
    white-space: pre;

    &:hover {
      background: #fff;
    }

    & > div {
      border-bottom: none;
    }
  }
`;

const DropdownMenuItem = styled.li`
  display: none;
  list-style-type: none;

  @media (max-width: 900px) {
    & {
      display: flex;
    }
  }
`;

const ExpandIconWrapper = styled.div`
  & > svg {
    width: 16px;
    margin-left: 0.3em;
    & * {
      stroke: currentColor;
    }
  }
`;

export default {
  Header,
  Navigation,
  Logo,
  LogoDemo,
  LogoutButton,
  ButtonLabel,
  MenuItems,
  MenuItem,
  DropdownMenu,
  MenuButton,
  MenuButtonContent,
  MenuButtonContentSpan,
  Menu,
  DropdownMenuItem,
  ExpandIconWrapper,
};
