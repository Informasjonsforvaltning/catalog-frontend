import { localization, prepareStatusList } from '@catalog-frontend/utils';
import { CodeListsResult, FieldsResult, UsersResult } from '@catalog-frontend/types';
import { getAllCodeLists, getConceptStatuses, getFields, getUsers } from '@catalog-frontend/data-access';
import { SearchPageClient } from './search-page-client';
import { withReadProtectedPage } from '../../../../utils/auth';
import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';

const SearchPage = withReadProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}`,
  async ({ catalogId, session, hasWritePermission, hasAdminPermission }) => {
    const fieldsResult: FieldsResult = await getFields(catalogId, `${session?.accessToken}`).then((response) =>
      response.json(),
    );
    const codeListsResult: CodeListsResult = await getAllCodeLists(catalogId, `${session?.accessToken}`).then(
      (response) => response.json(),
    );

    const usersResult: UsersResult = await getUsers(catalogId, `${session?.accessToken}`).then((response) =>
      response.json(),
    );

    const conceptStatuses = await getConceptStatuses()
      .then((response) => response.json())
      .then((body) => body?.conceptStatuses ?? [])
      .then((statuses) => prepareStatusList(statuses));

    const breadcrumbList = catalogId
      ? ([
          {
            href: `/catalogs/${catalogId}`,
            text: localization.catalogType.concept,
          },
        ] as BreadcrumbType[])
      : [];

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.catalogType.concept}
          catalogId={catalogId}
        />
        <SearchPageClient
          catalogId={catalogId}
          hasWritePermission={!!hasWritePermission}
          hasAdminPermission={!!hasAdminPermission}
          fieldsResult={fieldsResult}
          codeListsResult={codeListsResult}
          usersResult={usersResult}
          conceptStatuses={conceptStatuses}
        />
      </>
    );
  },
);

export default SearchPage;
