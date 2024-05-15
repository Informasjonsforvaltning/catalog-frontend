'use client';

import { FC, useState } from 'react';
import { hasOrganizationAdminPermission, localization } from '@catalog-frontend/utils';
import UserIcon from './images/user-icon.svg';
import FDKLogo from './images/fdk-publishing-logo-negative.svg';
import FDKLogoDemo from './images/fdk-publishing-logo-negative-demo.svg';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './header.module.css';
import { LeaveIcon } from '@navikt/aksel-icons';
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

  const router = useRouter();
  const { data: session } = useSession();
  const userDisplayName = session?.user?.name;
  const accessToken = (session as any)?.accessToken;

  const params = useParams();
  const catalogId = params.catalogId;

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
                {urlObject.name}
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
              {hasOrganizationAdminPermission(accessToken, String(catalogId)) && (
                <>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      className={styles.dropDownItem}
                      asChild
                    >
                      {hasOrganizationAdminPermission(accessToken, String(catalogId)) && (
                        <a
                          href={catalogAdminUrl}
                          className={styles.dropDownItem}
                        >
                          {localization.manageCatalogs}
                        </a>
                      )}
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
