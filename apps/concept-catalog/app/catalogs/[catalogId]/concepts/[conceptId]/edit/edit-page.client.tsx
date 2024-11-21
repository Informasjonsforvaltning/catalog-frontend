'use client';

import { Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import ConceptForm from '../../../../../../components/concept-form';

export const EditPage = ({
  breadcrumbList,
  catalogId,
  organization,
  concept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
}) => {
  

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
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
