'use client';

import { CenterContainer, PageBanner, Spinner, useRouter } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export const SignOut = () => {
  const router = useRouter();

  useEffect(() => {
    signOut({ redirect: false }).then(() => {
      router.push('/');
    });
  }, [router]);

  return (
    <>
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={localization.auth.logout}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          <>
            <div>{localization.auth.loggingOut}</div>
            <Spinner />
          </>
        </Heading>
      </CenterContainer>
    </>
  );
};

export default SignOut;
