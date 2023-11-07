import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';
import HeadingContent from './heading-content';

export const SignIn = ({ FDK_REGISTRATION_BASE_URI }) => {
  const breadcrumbList = [
    {
      href: `#`,
      text: localization.auth.login,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs
        baseURI={FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.auth.login}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          <HeadingContent />
        </Heading>
      </CenterContainer>
    </>
  );
};

export default SignIn;
