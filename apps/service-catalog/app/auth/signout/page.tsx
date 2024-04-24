'use client';

import { CenterContainer, PageBanner, Spinner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/designsystemet-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
        title={localization.catalogType.service}
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
