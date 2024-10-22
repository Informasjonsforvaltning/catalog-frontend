import { getConcept, getOrganization } from '@catalog-frontend/data-access';
import { redirect, RedirectType } from 'next/navigation';
import { Breadcrumbs, BreadcrumbType, PageBanner } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Organization } from '@catalog-frontend/types';
import { withWriteProtectedPage } from '../../../../../../utils/auth';
import ConceptForm from '../../../../../../components/concept-form';

export default withWriteProtectedPage(
  ({ catalogId, conceptId }) => `/${catalogId}/${conceptId}/edit`,
  async ({ catalogId, conceptId, session }) => {
    const concept = await getConcept(`${conceptId}`, `${session?.accessToken}`).then((response) => {
      if (response.ok) return response.json();
    });
    if (!concept || concept.ansvarligVirksomhet?.id !== catalogId) {
      return redirect(`/notfound`, RedirectType.replace);
    }

    const organization: Organization = await getOrganization(catalogId).then((response) => response.json());
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
        <PageBanner
          title={localization.catalogType.concept}
          subtitle={getTranslateText(organization.prefLabel).toString()}
        />
        <div className='container'>
          <ConceptForm concept={concept} />
        </div>
      </>
    );
  },
);
