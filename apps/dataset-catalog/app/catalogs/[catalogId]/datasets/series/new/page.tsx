import { getOrganization } from '@catalog-frontend/data-access';
import { Organization } from '@catalog-frontend/types';
import { FormContainer, PageBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Textfield } from '@digdir/designsystemet-react';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

export default async function NewDatasetSeriesPage({ params }: Params) {
  const { catalogId } = params;
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  return (
    <div className='container'>
      <PageBanner
        title={localization.catalogType.dataset}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <FormContainer>
        <FormContainer.Header title='test' />
        <Textfield />
      </FormContainer>
    </div>
  );
}
