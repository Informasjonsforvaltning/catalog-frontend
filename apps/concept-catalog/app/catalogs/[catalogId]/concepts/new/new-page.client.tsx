'use client';

import { Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import ConceptForm from '../../../../../components/concept-form';

export const NewPage = ({
  breadcrumbList,
  catalogId,
  organization,
  concept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
  catalogPortalBaseUri
}) => {
  

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${catalogPortalBaseUri}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={getTranslateText(organization.prefLabel).toString()}
      />
      <ConceptForm
          catalogId={catalogId}
          concept={concept}
          conceptStatuses={conceptStatuses}
          codeListsResult={codeListsResult}
          fieldsResult={fieldsResult}
          usersResult={usersResult}
        />      
    </>
  );
};
