import styled from 'styled-components';

const DropdownMenu = styled.nav`
  position: relative;
`;

const Trigger = styled.div`
  cursor: pointer;

  &,
  & * {
    color: inherit;
  }
`;

const Menu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 1.2rem);
  z-index: 1000;

  &,
  & * {
    color: inherit;
  }
`;

export default { DropdownMenu, Trigger, Menu };
