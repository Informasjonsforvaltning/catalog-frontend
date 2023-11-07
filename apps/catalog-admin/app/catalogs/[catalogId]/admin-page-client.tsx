'use client';

import { BreadcrumbType, Breadcrumbs, Card } from '@catalog-frontend/ui';

import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Banner } from '../../../components/banner';
import { InformationSquareIcon, TableIcon } from '@navikt/aksel-icons';

export const AdminPageClient = ({ organization, catalogId }) => {
  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.manageCatalog),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <div>
        <Banner orgName={organization?.prefLabel} />
        <div className='card'>
          <Card
            icon={<InformationSquareIcon fontSize='3rem' />}
            title={localization.general}
            body={localization.catalogAdmin.description.general}
            href={`/catalogs/${catalogId}/general`}
          />
          <Card
            icon={
              <TableIcon
                title='a11y-title'
                fontSize='3rem'
              />
            }
            title={localization.catalogType.concept}
            body={localization.catalogAdmin.description.conceptCatalog}
            href={`/catalogs/${catalogId}/concepts`}
          />
        </div>
      </div>
    </>
  );
};

export default AdminPageClient;
