'use client';

import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';

const NoAccess = () => {
  const breadcrumbList = [
    {
      href: `#`,
      text: localization.noAccess,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.manageCatalogs}
        subtitle={localization.noAccess}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          {localization.youHaveNoAccess}
        </Heading>
      </CenterContainer>
    </>
  );
};

export default NoAccess;
