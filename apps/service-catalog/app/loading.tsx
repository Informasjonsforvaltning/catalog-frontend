import { CenterContainer, PageBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Heading, Spinner } from '@digdir/design-system-react';

export default function Loading() {
  return (
    <>
      <PageBanner
        title={localization.catalogType.service}
        subtitle={''}
      />
      <CenterContainer>
        <Heading
          level={2}
          size='small'
        >
          <Spinner title={localization.loading} />
        </Heading>
      </CenterContainer>
    </>
  );
}
