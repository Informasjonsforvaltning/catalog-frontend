import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';
import { useRouter } from 'next/router';

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
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.notFound}
      />
      <div className='container grow center'>
        <Heading
          level={2}
          size='small'
        >
          {localization.didNotFoundPage}
        </Heading>
      </div>
    </>
  );
};

export default Custom404;
