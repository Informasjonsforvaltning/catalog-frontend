'use client';

import { BreadcrumbType, Breadcrumbs, Card } from '@catalog-frontend/ui';
import React from 'react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Banner } from '../../../../components/banner';
import { PaletteIcon, PersonIcon } from '@navikt/aksel-icons';

export const GeneralPageClient = ({ catalogId, organization }) => {
  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.manageCatalog),
        },
        {
          href: `/catalogs/${catalogId}/general`,
          text: getTranslateText(localization.general),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <Banner orgName={organization?.prefLabel} />
      <div className='card'>
        <Card
          icon={<PaletteIcon fontSize='3rem' />}
          title={localization.catalogAdmin.design}
          body={localization.catalogAdmin.manage.design}
          href={`/catalogs/${catalogId}/general/design`}
        />
        <Card
          icon={<PersonIcon fontSize='3rem' />}
          title={localization.catalogAdmin.usernameList}
          body={localization.catalogAdmin.manage.usernameList}
          href={`/catalogs/${catalogId}/general/users`}
        />
      </div>
    </>
  );
};

export default GeneralPageClient;
