import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';
import { useRouter } from 'next/router';

export const Custom500 = () => {
  const router = useRouter();
  const catalogId = router.asPath.substring(1, 10);

  const breadcrumbList = catalogId
    ? ([
        {
          href: `#`,
          text: localization.noAccess,
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.error}
      />
      <div className='container grow center'>
        <Heading
          level={2}
          size='small'
        >
          {localization.youHaveNoAccess}
        </Heading>
      </div>
    </>
  );
};

export default Custom500;
