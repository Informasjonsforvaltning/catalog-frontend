'use client';

import { FC } from 'react';
import {
  getResourceRoles,
  hasOrganizationAdminPermission,
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  localization,
} from '@catalog-frontend/utils';
import FDKLogo from './images/fdk-publishing-logo-negative.svg';
import FDKLogoDemo from './images/fdk-publishing-logo-negative-demo.svg';
import { useSession } from 'next-auth/react';
import styles from './header.module.scss';
import { ExternalLinkIcon, LeaveIcon, MenuHamburgerIcon, PersonIcon } from '@navikt/aksel-icons';
import { Button, Divider, DropdownMenu } from '@digdir/designsystemet-react';
import classNames from 'classnames';
import { useParams } from 'next/navigation';

interface HeaderProps {
  homeUrl?: string;
  adminGuiBaseUrl?: string;
  catalogAdminUrl?: string;
  fdkBaseUrl?: string;
  fdkRegistrationBaseUrl?: string;
  termsOfUseUrl?: string;
  useDemoLogo?: boolean;
  fontColor?: string;
  backgroundColor?: string;
}

const Header: FC<HeaderProps> = ({
  homeUrl,
  adminGuiBaseUrl,
  catalogAdminUrl,
  fdkBaseUrl,
  fdkRegistrationBaseUrl,
  termsOfUseUrl,
  useDemoLogo,
  fontColor,
  backgroundColor,
}) => {
  const urls = [
    [
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
    ],
    [
      {
        name: localization.footer.termsOfUse,
        url: termsOfUseUrl ?? 'https://data.norge.no/publishing/terms-of-use',
        external: true,
      },
      {
        name: localization.footer.privacyStatement,
        url: 'https://www.digdir.no/om-oss/personvernerklaering/706',
        external: true,
      },
      {
        name: localization.footer.cookies,
        url: 'https://www.digdir.no/om-oss/informasjonskapsler/707',
        external: true,
      },
      {
        name: localization.footer.accessibility,
        url: 'https://uustatus.no/nb/erklaringer/publisert/8020b962-b706-4cdf-ab8b-cdb5f480a696',
        external: true,
      },
      {
        name: localization.header.contactUs,
        url: 'https://data.norge.no/nb/contact',
        external: true,
      },
    ],
  ];

  const { catalogId } = useParams();
  const { data: session } = useSession();
  const userDisplayName = session?.user?.name;
  const accessToken = (session as any)?.accessToken;
  const resourceRoles = getResourceRoles(accessToken);

  const userRole = (() => {
    if (hasSystemAdminPermission(accessToken)) {
      return localization.userRole.sysAdminRole;
    } else if (hasOrganizationAdminPermission(accessToken, `${catalogId}`)) {
      return localization.userRole.adminRole;
    }
    if (hasOrganizationWritePermission(accessToken, `${catalogId}`)) {
      return localization.userRole.writerRole;
    }
    if (hasOrganizationReadPermission(accessToken, `${catalogId}`)) {
      return localization.userRole.readerRole;
    }

    return null;
  })();

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
          title='Gå til hovedsiden'
          className={styles.logo}
        >
          {useDemoLogo ? <FDKLogoDemo /> : <FDKLogo />}
        </a>
        {userDisplayName && (
          <DropdownMenu size='small'>
            <DropdownMenu.Trigger asChild>
              <Button
                variant='tertiary'
                className={styles.menuButton}
              >
                <MenuHamburgerIcon
                  aria-hidden
                  fontSize='1.5rem'
                />
                {localization.header.menu}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Group key='menu-group-user'>
                <DropdownMenu.Item
                  className={classNames(styles.dropDownItem, styles.userInfo)}
                  asChild
                >
                  <div>
                    <span>
                      <PersonIcon
                        fontSize='1.3rem'
                        role='presentation'
                      />
                      {userDisplayName}
                    </span>
                    {userRole && <span>{userRole}</span>}
                  </div>
                </DropdownMenu.Item>
                <Divider />
              </DropdownMenu.Group>
              {resourceRoles.some((role) => role.role === 'admin') && (
                <DropdownMenu.Group key='menu-group-admin'>
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
                  <Divider />
                </DropdownMenu.Group>
              )}
              {urls.map((group, index) => (
                <DropdownMenu.Group key={`menu-group-${index}`}>
                  {group.map((urlObject, itemIndex) => (
                    <DropdownMenu.Item
                      key={`menu-item-${index}-${itemIndex}`}
                      className={styles.dropDownItem}
                      asChild
                    >
                      <a
                        href={urlObject.url}
                        className={styles.dropDownItem}
                        target={urlObject.external ? '_blank' : ''}
                        rel='noreferrer'
                      >
                        {urlObject.name}
                        {urlObject.external ? (
                          <span className={styles.icon}>
                            <ExternalLinkIcon title='ExternalLinkIcon' />
                          </span>
                        ) : (
                          ''
                        )}
                      </a>
                    </DropdownMenu.Item>
                  ))}
                  <Divider />
                </DropdownMenu.Group>
              ))}
              {handleLogout && (
                <DropdownMenu.Group key='menu-group-logout'>
                  <DropdownMenu.Item asChild>
                    <button
                      onClick={handleLogout}
                      className={styles.dropDownItem}
                    >
                      <LeaveIcon fontSize='1.3rem' />
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
