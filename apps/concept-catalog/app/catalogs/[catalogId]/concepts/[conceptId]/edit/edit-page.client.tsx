'use client';

import { Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import ConceptForm from '../../../../../../components/concept-form';
import { useCatalogDesign } from '../../../../../../context/catalog-design';

export const EditPage = ({
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
  
  const design = useCatalogDesign();
  
  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${catalogPortalBaseUri}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.concept}
        subtitle={getTranslateText(organization.prefLabel).toString()}
        fontColor={design?.fontColor}
        backgroundColor={design?.backgroundColor}
        logo={design?.hasLogo ? `/api/catalog-admin/${catalogId}/design/logo` : undefined}
        logoDescription={design?.logoDescription}
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
