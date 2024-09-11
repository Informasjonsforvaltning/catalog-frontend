'use client';

import { FC } from 'react';
import { getResourceRoles, localization } from '@catalog-frontend/utils';
import UserIcon from './images/user-icon.svg';
import FDKLogo from './images/fdk-publishing-logo-negative.svg';
import FDKLogoDemo from './images/fdk-publishing-logo-negative-demo.svg';
import { useSession } from 'next-auth/react';
import styles from './header.module.css';
import { ExternalLinkIcon, LeaveIcon } from '@navikt/aksel-icons';
import { Divider, DropdownMenu } from '@digdir/designsystemet-react';

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
      name: localization.header.nationalDataCatalog,
      url: fdkBaseUrl,
      external: true,
    },
    {
      name: localization.header.dataCommunity,
      url: fdkCommunityBaseUrl,
      external: true,
    },
  ];

  const { data: session } = useSession();
  const userDisplayName = session?.user?.name;
  const accessToken = (session as any)?.accessToken;
  const resourceRoles = getResourceRoles(accessToken);

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
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
                <span className={styles.externalLink}>
                  {urlObject.name}
                  {urlObject.external ? (
                    <span className={styles.icon}>
                      <ExternalLinkIcon title='ExternalLinkIcon' />
                    </span>
                  ) : (
                    ''
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
        {userDisplayName && (
          <DropdownMenu size='small'>
            <DropdownMenu.Trigger asChild>
              <button className={styles.triggerButton}>
                <UserIcon />
                <span className={styles.triggerButtonSpan}>{userDisplayName}</span>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {resourceRoles.some((role) => role.role === 'admin') && (
                <>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      className={styles.dropDownItem}
                      asChild
                    >
                      <a
                        href={catalogAdminUrl}
                        className={styles.dropDownItem}
                      >
                        {localization.manageCatalogs}
                      </a>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                  <Divider />
                </>
              )}
              {handleLogout && (
                <DropdownMenu.Group>
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={handleLogout}
                      className={styles.dropDownItem}
                    >
                      <LeaveIcon className={styles.logoutIcon} />
                      <span>{localization.auth.logout}</span>
                    </button>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
              )}
            </DropdownMenu.Content>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export { Header };
