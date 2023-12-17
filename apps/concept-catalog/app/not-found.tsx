import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';

const NotFound = async ({ params }) => {
  const breadcrumbList = [
    {
      href: `#`,
      text: localization.notFound,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.notFound}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          {localization.didNotFindPage}
        </Heading>
      </CenterContainer>
    </>
  );
};

export default NotFound;
