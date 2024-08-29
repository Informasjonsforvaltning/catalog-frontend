'use client';

import { CenterContainer, PageBanner, Spinner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/designsystemet-react';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

export const SignOut = () => {
  useEffect(() => {
    signOut({ redirect: false, callbackUrl: '/' }).then(({ url }) => {
      window.location.href = url;
    });
  }, []);

  return (
    <>
      <PageBanner
        title={localization.allCatalogs}
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
