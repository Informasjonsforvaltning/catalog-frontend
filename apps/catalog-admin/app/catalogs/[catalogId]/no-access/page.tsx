'use client';

import { CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading } from '@digdir/design-system-react';

export const NoAccess = () => {
  return (
    <>
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

export default NoAccess;
