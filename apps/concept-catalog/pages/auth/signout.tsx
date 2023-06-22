import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const SignOut = () => {
  const router = useRouter();

  const breadcrumbList = [
    {
      href: `#`,
      text: localization.auth.logout,
    },
  ] as BreadcrumbType[];

  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      router.push('/');
    });
  }, [router]);

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.auth.logout}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          {localization.auth.loggingOut}
        </Heading>
      </CenterContainer>
    </>
  );
};

export default SignOut;
