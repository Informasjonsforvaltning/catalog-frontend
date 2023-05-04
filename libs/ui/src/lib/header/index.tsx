import React, {FC, useState} from 'react';
import {localization} from '@catalog-frontend/utils';
import Icon from '../icon';
import UserIcon from './images/user-icon.svg';
import {Menu, Trigger} from '../dropdown-menu';
import SC from './styled';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';

export interface Props {
  /**
   * Url on logo
   * @type {string}
   */
  homeUrl?: string;
  /**
   * Use demo logo
   * @type {boolean}
   * @default {false}
   */
  useDemoLogo?: boolean;
}

export const Header: FC<Props> = ({homeUrl, useDemoLogo}) => {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  const openDropdownMenu = () => setIsDropdownMenuOpen(true);
  const closeDropdownMenu = () => setIsDropdownMenuOpen(false);

  const router = useRouter();
  const {data: session} = useSession();
  const username = session?.user?.name;

  const handleLogout = () => {
    router.push('/api/auth/logout');
  };

  return (
    <SC.Header>
      <SC.Container>
        <a
          href={homeUrl}
          aria-label="Gå til hovedsiden"
        >
          {useDemoLogo ? <SC.LogoDemo /> : <SC.Logo />}
        </a>
        <SC.MenuItems>
          <SC.MenuItem>
            <a href="https://fellesdatakatalog.digdir.no/guidance">
              {localization.header.registerData}
            </a>
          </SC.MenuItem>
          <SC.MenuItem>
            <a href="https://admin.fellesdatakatalog.digdir.no">
              {localization.header.harvestData}
            </a>
          </SC.MenuItem>
          <SC.MenuItem>
            <a href="https://datalandsbyen.norge.no">
              {localization.header.dataCommunity}
            </a>
          </SC.MenuItem>
          <SC.MenuItem>
            <a href="https://data.norge.no">
              {localization.header.nationalDataCatalog}
            </a>
          </SC.MenuItem>
        </SC.MenuItems>
        {username && (
          <SC.DropdownMenu
            isOpen={isDropdownMenuOpen}
            onClose={closeDropdownMenu}
          >
            <Trigger>
              <SC.MenuButton onClick={openDropdownMenu}>
                <SC.MenuButtonContent>
                  <UserIcon />
                  <SC.MenuButtonContentSpan>
                    {username}
                  </SC.MenuButtonContentSpan>
                  <SC.ExpandIconWrapper>
                    <Icon name="chevronDownStroke" />
                  </SC.ExpandIconWrapper>
                </SC.MenuButtonContent>
              </SC.MenuButton>
            </Trigger>
            {handleLogout && (
              <Menu>
                <SC.Menu>
                  <li>
                    <SC.MenuButton onClick={handleLogout}>
                      <span>{localization.header.logout}</span>
                    </SC.MenuButton>
                  </li>
                </SC.Menu>
              </Menu>
            )}
          </SC.DropdownMenu>
        )}
      </SC.Container>
    </SC.Header>
  );
};

export default Header;
