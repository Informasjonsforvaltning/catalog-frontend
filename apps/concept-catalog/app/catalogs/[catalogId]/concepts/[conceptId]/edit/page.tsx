import { getAllCodeLists, getConcept, getConceptStatuses, getFields, getUsers } from '@catalog-frontend/data-access';
import { redirect, RedirectType } from 'next/navigation';
import { Breadcrumbs, BreadcrumbType, DesignBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization, prepareStatusList } from '@catalog-frontend/utils';
import { CodeListsResult, FieldsResult, UsersResult } from '@catalog-frontend/types';
import { withWriteProtectedPage } from '../../../../../../utils/auth';
import { EditPage } from './edit-page.client';

export default withWriteProtectedPage(
  ({ catalogId, conceptId }) => `/catalogs//${catalogId}/concepts/${conceptId}/edit`,
  async ({ catalogId, conceptId, session }) => {
    const concept = await getConcept(`${conceptId}`, `${session?.accessToken}`).then((response) => {
      if (response.ok) return response.json();
    });
    if (!concept || concept.ansvarligVirksomhet?.id !== catalogId) {
      return redirect(`/notfound`, RedirectType.replace);
    }

    const conceptStatuses = await getConceptStatuses()
      .then((response) => response.json())
      .then((body) => body?.conceptStatuses ?? [])
      .then((statuses) => prepareStatusList(statuses));

    const codeListsResult: CodeListsResult = await getAllCodeLists(catalogId, `${session?.accessToken}`).then(
      (response) => response.json(),
    );
    const fieldsResult: FieldsResult = await getFields(catalogId, `${session?.accessToken}`).then((response) =>
      response.json(),
    );
    const usersResult: UsersResult = await getUsers(catalogId, `${session?.accessToken}`).then((response) =>
      response.json(),
    );

    const getTitle = (text: string | string[]) => (text ? text : localization.concept.noName);
    const breadcrumbList = catalogId
      ? ([
          {
            href: `/catalogs/${catalogId}`,
            text: localization.catalogType.concept,
          },
          {
            href: `/catalogs/${catalogId}/concepts/${concept?.id}`,
            text: getTitle(getTranslateText(concept?.anbefaltTerm?.navn)),
          },
          {
            href: `/catalogs/${catalogId}/concepts/${concept?.id}/edit`,
            text: localization.edit,
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
        <EditPage
          catalogId={catalogId}
          breadcrumbList={breadcrumbList}
          concept={concept}
          conceptStatuses={conceptStatuses}
          codeListsResult={codeListsResult}
          fieldsResult={fieldsResult}
          usersResult={usersResult}
          catalogPortalBaseUri={process.env.CATALOG_PORTAL_BASE_URI}
        />
      </>
    );
  },
);
