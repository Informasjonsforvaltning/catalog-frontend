import React, { FC, useState } from 'react';
import { hasOrganizationAdminPermission, localization } from '@catalog-frontend/utils';
import Icon from '../icon';
import UserIcon from './images/user-icon.svg';
import { Menu, Trigger } from '../dropdown-menu';
import SC from './styled';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export interface HeaderProps {
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
  /**
   * font color
   * @type {string}
   */
  fontColor?: string;
  /**
   * background color
   * @type {string}
   */
  backgroundColor?: string;
  catalogAdminUrl?: string;
}

export const Header: FC<HeaderProps> = ({ homeUrl, useDemoLogo, fontColor, backgroundColor, catalogAdminUrl }) => {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  const openDropdownMenu = () => setIsDropdownMenuOpen(true);
  const closeDropdownMenu = () => setIsDropdownMenuOpen(false);

  const router = useRouter();
  const { data: session } = useSession();
  const userDisplayName = session?.user?.name;
  const accessToken = session?.accessToken;
  const catalogId = `${router.query.catalogId}`;

  const handleLogout = () => {
    router.push('/api/auth/logout');
  };

  return (
    <SC.Header
      fontColor={fontColor}
      background={backgroundColor}
    >
      <div className='container'>
        <SC.Navigation>
          <a
            href={homeUrl}
            aria-label='Gå til hovedsiden'
          >
            {useDemoLogo ? <SC.LogoDemo /> : <SC.Logo />}
          </a>
          {userDisplayName && (
            <SC.DropdownMenu
              isOpen={isDropdownMenuOpen}
              onClose={closeDropdownMenu}
            >
              <Trigger>
                <SC.MenuButton onClick={openDropdownMenu}>
                  <SC.MenuButtonContent>
                    <UserIcon />
                    <SC.MenuButtonContentSpan>{userDisplayName}</SC.MenuButtonContentSpan>
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
                        <span>{localization.auth.logout}</span>
                      </SC.MenuButton>
                    </li>
                    {hasOrganizationAdminPermission(accessToken, catalogId) && (
                      <>
                        <hr />
                        <li>
                          <SC.CatalogAdminHeaderLink href={catalogAdminUrl}>
                            {localization.manageCatalogs}
                          </SC.CatalogAdminHeaderLink>
                        </li>
                      </>
                    )}
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
