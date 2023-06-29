import { BreadcrumbType, Breadcrumbs, CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const SignOut = ({ FDK_REGISTRATION_BASE_URI }) => {
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
      <Breadcrumbs
        baseURI={FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
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

export async function getServerSideProps() {
  return {
    props: {
      FDK_REGISTRATION_BASE_URI: process.env.NEXT_PUBLIC_FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default SignOut;
