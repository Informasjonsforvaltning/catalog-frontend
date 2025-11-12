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
        title={localization.catalogOverview}
        subtitle={localization.auth.logout}
      />
      <CenterContainer>
        <Heading
          level={2}
          data-size='sm'
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
