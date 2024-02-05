'use client';

import { FC, useState } from 'react';
import { hasOrganizationAdminPermission, localization } from '@catalog-frontend/utils';
import Icon from '../icon';
import UserIcon from './images/user-icon.svg';
import FDKLogo from './images/fdk-publishing-logo-negative.svg';
import FDKLogoDemo from './images/fdk-publishing-logo-negative-demo.svg';
import DropdownMenu, { Menu, Trigger } from '../dropdown-menu';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './header.module.css';
import { LeaveIcon } from '@navikt/aksel-icons';

export interface HeaderProps {
  homeUrl?: string;
  adminGuiBaseUrl?: string;
  catalogAdminUrl?: string;
  fdkBaseUrl?: string;
  fdkCommunityBaseUrl?: string;
  fdkRegistrationBaseUrl?: string;
  useDemoLogo?: boolean;
  fontColor?: string;
  backgroundColor?: string;
}

const Header: FC<HeaderProps> = ({
  homeUrl,
  adminGuiBaseUrl,
  catalogAdminUrl,
  fdkBaseUrl,
  fdkCommunityBaseUrl,
  fdkRegistrationBaseUrl,
  useDemoLogo,
  fontColor,
  backgroundColor,
}) => {
  const urls = [
    {
      name: localization.header.registerData,
      url: fdkRegistrationBaseUrl,
      external: false,
    },
    {
      name: localization.header.harvestData,
      url: adminGuiBaseUrl,
      external: false,
    },
    {
      name: localization.header.dataCommunity,
      url: fdkCommunityBaseUrl,
      external: true,
    },
    {
      name: localization.header.nationalDataCatalog,
      url: fdkBaseUrl,
      external: true,
    },
  ];

  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  const openDropdownMenu = () => setIsDropdownMenuOpen(true);
  const closeDropdownMenu = () => setIsDropdownMenuOpen(false);

  const router = useRouter();
  const { data: session } = useSession();
  const userDisplayName = session?.user?.name;
  const accessToken = session?.accessToken;

  const params = useParams();
  const catalogId = params.catalogId;

  const handleLogout = () => {
    router.push('/api/auth/logout');
  };

  return (
    <header
      className={styles.header}
      style={{ color: fontColor ?? '#fff', background: backgroundColor ?? '#2d3741' }}
    >
      <div className={styles.headerContainer}>
        <a
          href={homeUrl}
          aria-label='Gå til hovedsiden'
          className={styles.logo}
        >
          {useDemoLogo ? <FDKLogoDemo /> : <FDKLogo />}
        </a>
        <ul className={styles.urlList}>
          {urls.map((urlObject) => (
            <li key={urlObject.name}>
              <a
                href={urlObject.url}
                target={urlObject.external ? '_blank' : ''}
                rel='noreferrer'
              >
                {urlObject.name}
              </a>
            </li>
          ))}
        </ul>
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

            <Menu>
              <ul className={styles.menu}>
                {hasOrganizationAdminPermission(accessToken, String(catalogId)) && (
                  <li className={styles.catalogAdminHeaderLink}>
                    <a href={catalogAdminUrl}>{localization.manageCatalogs}</a>
                  </li>
                )}
                {handleLogout && (
                  <li>
                    <button
                      onClick={handleLogout}
                      className={styles.logoutButton}
                    >
                      <LeaveIcon className={styles.logoutIcon} />
                      <span>{localization.auth.logout}</span>
                    </button>
                  </li>
                )}
              </ul>
            </Menu>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export { Header };
