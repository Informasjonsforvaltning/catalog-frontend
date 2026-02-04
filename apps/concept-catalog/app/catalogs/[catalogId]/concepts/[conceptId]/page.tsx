import {
  getTranslateText,
  getUsername,
  localization,
  prepareStatusList,
} from "@catalog-frontend/utils";
import {
  getAllCodeLists,
  getConcept,
  getPublishedConceptRelations,
  getConceptRevisions,
  getConceptStatuses,
  getFields,
  getUnpublishedConceptRelations,
  getUnpublishedRelatedConcepts,
  getOrganization,
  getPublishedRelatedConcepts,
  getUsers,
} from "@catalog-frontend/data-access";
import {
  Concept,
  Organization,
  FieldsResult,
  CodeListsResult,
  UsersResult,
  UnionRelation,
  RelatedConcept,
} from "@catalog-frontend/types";
import { RedirectType, redirect } from "next/navigation";
import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { withReadProtectedPage } from "@concept-catalog/utils/auth";
import { conceptSchema } from "@concept-catalog/components/concept-form/validation-schema";
import ConceptPageClient from "./concept-page-client";

const ConceptPage = withReadProtectedPage(
  ({ catalogId, conceptId }) => `/catalogs/${catalogId}/concepts/${conceptId}`,
  async ({ catalogId, conceptId, session, hasWritePermission }) => {
    const concept = await getConcept(`${conceptId}`, session.accessToken).then(
      (response) => {
        if (response.ok) return response.json();
      },
    );

    if (!concept || !conceptId || concept.ansvarligVirksomhet?.id !== catalogId) {
      return redirect("/notfound", RedirectType.replace);
    }

    const conceptStatuses = await getConceptStatuses().then((body) =>
      prepareStatusList(body.conceptStatuses),
    );

    const username = getUsername(session.accessToken);

    const organization: Organization = await getOrganization(catalogId);
    const revisions: Concept[] | null = await getConceptRevisions(
      conceptId,
      session.accessToken,
    ).then((response) => response.json() || null);
    const fieldsResult: FieldsResult = await getFields(
      catalogId,
      session.accessToken,
    ).then((response) => response.json());
    const codeListsResult: CodeListsResult = await getAllCodeLists(
      catalogId,
      session.accessToken,
    ).then((response) => response.json());
    const usersResult: UsersResult = await getUsers(
      catalogId,
      session.accessToken,
    ).then((response) => response.json());

    const conceptRelations: UnionRelation[] =
      getPublishedConceptRelations(concept);
    const internalConceptRelations: UnionRelation[] =
      getUnpublishedConceptRelations(concept);
    const relatedConcepts: RelatedConcept[] = await getPublishedRelatedConcepts(
      concept,
      session.accessToken,
    );
    const internalRelatedConcepts: RelatedConcept[] =
      await getUnpublishedRelatedConcepts(concept, session.accessToken);

    const isValid = await conceptSchema({
      required: true,
      baseUri:
        process.env.NODE_ENV === "production"
          ? "http://localhost:8080"
          : "http://localhost:4200",
    }).isValid(concept);

    const clientProps = {
      username,
      organization,
      concept,
      revisions,
      fieldsResult,
      codeListsResult,
      conceptStatuses,
      usersResult,
      hasWritePermission,
      relatedConcepts,
      conceptRelations,
      internalConceptRelations,
      internalRelatedConcepts,
      isValid,
      catalogPortalUrl: `${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`,
    };

    const getTitle = (text: string | string[]) =>
      text ? text : localization.concept.noName;
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
        ] as BreadcrumbType[])
      : [];

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={process.env.CATALOG_PORTAL_BASE_URI ?? ""}
        />
        <DesignBanner
          title={localization.catalogType.concept}
          catalogId={catalogId}
        />
        <ConceptPageClient {...clientProps} />
      </>
    );
  },
);

export default ConceptPage;
