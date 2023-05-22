import React, { FC, useState } from 'react';
import { localization } from '@catalog-frontend/utils';
import Icon from '../icon';
import UserIcon from './images/user-icon.svg';
import { Menu, Trigger } from '../dropdown-menu';
import SC from './styled';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

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

export const Header: FC<Props> = ({ homeUrl, useDemoLogo }) => {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  const openDropdownMenu = () => setIsDropdownMenuOpen(true);
  const closeDropdownMenu = () => setIsDropdownMenuOpen(false);

  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.name;

  const handleLogout = () => {
    router.push('/api/auth/logout');
  };

  return (
    <SC.Header>
      <div className='container'>
        <SC.Navigation>
          <a
            href={homeUrl}
            aria-label='Gå til hovedsiden'
          >
            {useDemoLogo ? <SC.LogoDemo /> : <SC.Logo />}
          </a>
          {username && (
            <SC.DropdownMenu
              isOpen={isDropdownMenuOpen}
              onClose={closeDropdownMenu}
            >
              <Trigger>
                <SC.MenuButton onClick={openDropdownMenu}>
                  <SC.MenuButtonContent>
                    <UserIcon />
                    <SC.MenuButtonContentSpan>{username}</SC.MenuButtonContentSpan>
                    <SC.ExpandIconWrapper>
                      <Icon name='chevronDownStroke' />
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
        </SC.Navigation>
      </div>
    </SC.Header>
  );
};

export default Header;
