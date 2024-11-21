import { getUsername, prepareStatusList } from '@catalog-frontend/utils';
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
} from '@catalog-frontend/data-access';
import {
  Concept,
  Organization,
  FieldsResult,
  CodeListsResult,
  UsersResult,
  UnionRelation,
  RelatedConcept,
} from '@catalog-frontend/types';
import ConceptPageClient from './concept-page-client';
import { RedirectType, redirect } from 'next/navigation';
import { withReadProtectedPage } from '../../../../../utils/auth';

const ConceptPage = withReadProtectedPage(
  ({ catalogId, conceptId }) => `/${catalogId}/${conceptId}`,
  async ({ catalogId, conceptId, session, hasWritePermission }) => {
    const concept = await getConcept(`${conceptId}`, `${session?.accessToken}`).then((response) => {
      if (response.ok) return response.json();
    });

    if (!concept || concept.ansvarligVirksomhet?.id !== catalogId) {
      redirect(`/notfound`, RedirectType.replace);
    }

    const conceptStatuses = await getConceptStatuses()
      .then((response) => response.json())
      .then((body) => {
        return body?.conceptStatuses ?? [];
      })
      .then((statuses) => prepareStatusList(statuses));

    const username = session && getUsername(session?.accessToken);

    const organization: Organization = await getOrganization(catalogId).then((response) => response.json());
    const revisions: Concept[] | null = await getConceptRevisions(`${conceptId}`, `${session?.accessToken}`).then(
      (response) => response.json() || null,
    );
    const fieldsResult: FieldsResult = await getFields(catalogId, `${session?.accessToken}`).then((response) =>
      response.json(),
    );
    const codeListsResult: CodeListsResult = await getAllCodeLists(catalogId, `${session?.accessToken}`).then(
      (response) => response.json(),
    );
    const usersResult: UsersResult = await getUsers(catalogId, `${session?.accessToken}`).then((response) =>
      response.json(),
    );

    const conceptRelations: UnionRelation[] = getPublishedConceptRelations(concept);
    const internalConceptRelations: UnionRelation[] = getUnpublishedConceptRelations(concept);
    const relatedConcepts: RelatedConcept[] = await getPublishedRelatedConcepts(concept, session?.accessToken);
    const internalRelatedConcepts: RelatedConcept[] = await getUnpublishedRelatedConcepts(
      concept,
      session?.accessToken,
    );

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
      catalogPortalUrl: `${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`,
    };

    return <ConceptPageClient {...clientProps} />;
  },
);

export default ConceptPage;
