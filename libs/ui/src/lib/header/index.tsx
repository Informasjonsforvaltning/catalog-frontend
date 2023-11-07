'use client';

import { FC, useState } from 'react';
import { hasOrganizationAdminPermission, localization } from '@catalog-frontend/utils';
import Icon from '../icon';
import UserIcon from './images/user-icon.svg';
import FDKLogo from './images/fdk-publishing-logo-negative.svg';
import FDKLogoDemo from './images/fdk-publishing-logo-negative-demo.svg';
import DropdownMenu, { Menu, Trigger } from '../dropdown-menu';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './header.module.css';

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

const Header: FC<HeaderProps> = ({ homeUrl, useDemoLogo, catalogAdminUrl }) => {
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
    <header className={styles.header}>
      <div className='container'>
        <nav className={styles.navigation}>
          <a
            href={homeUrl}
            aria-label='Gå til hovedsiden'
            className={styles.logo}
          >
            {useDemoLogo ? <FDKLogoDemo /> : <FDKLogo />}
          </a>
          {userDisplayName && (
            <DropdownMenu
              className={styles.dropdownMenu}
              isOpen={isDropdownMenuOpen}
              onClose={closeDropdownMenu}
            >
              <Trigger>
                <button
                  className={styles.menuButton}
                  onClick={openDropdownMenu}
                >
                  <div className={styles.menuButtonContent}>
                    <UserIcon />
                    <span className={styles.menuButtonContentSpan}>{userDisplayName}</span>
                    <div className={styles.expandIconWrapper}>
                      <Icon name='chevronDownStroke' />
                    </div>
                  </div>
                </button>
              </Trigger>
              {handleLogout && (
                <Menu>
                  <ul className={styles.menu}>
                    <li>
                      <button
                        className={styles.menuButton}
                        onClick={handleLogout}
                      >
                        <span>{localization.auth.logout}</span>
                      </button>
                    </li>
                    {hasOrganizationAdminPermission(accessToken, catalogId) && (
                      <>
                        <hr />
                        <li>
                          <a
                            className={styles.catalogAdminHeaderLink}
                            href={catalogAdminUrl}
                          >
                            {localization.manageCatalogs}
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </Menu>
              )}
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
};

export { Header };
