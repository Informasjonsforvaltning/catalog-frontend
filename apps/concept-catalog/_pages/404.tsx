'use client';

import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';
import { useRouter } from 'next/navigation';

export const Custom404 = () => {
  const router = useRouter();
  const catalogId = router.asPath.substring(1, 10);

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/${catalogId}`,
          text: localization.catalogType.concept,
        },
        {
          href: `#`,
          text: localization.notFound,
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs
        baseURI={process.env.FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.notFound}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          {localization.didNotFoundPage}
        </Heading>
      </CenterContainer>
    </>
  );
};

export default Custom404;
