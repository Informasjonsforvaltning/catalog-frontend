import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';
import { useRouter } from 'next/router';

export const NoAccess = ({ REGISTRATION_HOST }) => {
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
      <Breadcrumbs
        baseURI={REGISTRATION_HOST}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.error}
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

export async function getServerSideProps() {
  return {
    props: {
      REGISTRATION_HOST: process.env.REGISTRATION_HOST,
    },
  };
}

export default NoAccess;
