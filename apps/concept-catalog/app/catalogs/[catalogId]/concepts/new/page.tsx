import { getAllCodeLists, getConceptStatuses, getFields, getOrganization, getUsers } from '@catalog-frontend/data-access';
import { BreadcrumbType } from '@catalog-frontend/ui';
import { localization, prepareStatusList } from '@catalog-frontend/utils';
import { CodeListsResult, FieldsResult, Organization, UsersResult } from '@catalog-frontend/types';
import { withWriteProtectedPage } from '../../../../../utils/auth';

import { NewPage } from './new-page.client';

export default withWriteProtectedPage(
  ({ catalogId }) => `/catalogs//${catalogId}/concepts/new`,
  async ({ catalogId, session }) => {
    const concept = {
      ansvarligVirksomhet: {
        id: catalogId
      }
    };
    
    const conceptStatuses = await getConceptStatuses()
      .then((response) => response.json())
      .then((body) => body?.conceptStatuses ?? [])
      .then((statuses) => prepareStatusList(statuses));
      
    const organization: Organization = await getOrganization(catalogId).then((response) => response.json());
    const codeListsResult: CodeListsResult = await getAllCodeLists(catalogId, `${session?.accessToken}`).then(
      (response) => response.json(),
    );
    const fieldsResult: FieldsResult = await getFields(catalogId, `${session?.accessToken}`).then((response) =>
      response.json(),
    );
    const usersResult: UsersResult = await getUsers(catalogId, `${session?.accessToken}`).then((response) =>
      response.json(),
    );
    
    const breadcrumbList = catalogId
      ? ([
          {
            href: `/catalogs/${catalogId}`,
            text: localization.catalogType.concept,
          },
          {
            href: `/catalogs/${catalogId}/concepts/new`,
            text: localization.newConcept,
          },
        ] as BreadcrumbType[])
      : [];

    return (
      <NewPage
        catalogId={catalogId}
        breadcrumbList={breadcrumbList}
        organization={organization}
        concept={concept}
        conceptStatuses={conceptStatuses}
        codeListsResult={codeListsResult}
        fieldsResult={fieldsResult}
        usersResult={usersResult}
        catalogPortalBaseUri={process.env.CATALOG_PORTAL_BASE_URI}
      />
    );
  },
);
