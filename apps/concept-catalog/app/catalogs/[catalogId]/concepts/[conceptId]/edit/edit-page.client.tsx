'use client';

import { Breadcrumbs, DesignBanner } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import ConceptForm from '../../../../../../components/concept-form';

export const EditPage = ({
  breadcrumbList,
  catalogId,
  concept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
  catalogPortalBaseUri,
}) => {
  return (
    <>
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
