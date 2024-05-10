import {
  hasOrganizationReadPermission,
  getUsername,
  validOrganizationNumber,
  validUUID,
  hasSystemAdminPermission,
  hasOrganizationWritePermission,
  prepareStatusList,
  authOptions,
  getConceptIdFromRdfUri,
} from '@catalog-frontend/utils';
import {
  getAllCodeLists,
  getConcept,
  getConceptRelations,
  getConceptRevisions,
  getConceptStatuses,
  getFields,
  getInternalConceptRelations,
  getInternalRelatedConcepts,
  getOrganization,
  getRelatedConcepts,
  getUsers,
} from '@catalog-frontend/data-access';
import {
  Concept,
  Organization,
  FieldsResult,
  CodeListsResult,
  UsersResult,
  Relasjon,
  SkosConcept,
  Search,
  RelatedConcept,
} from '@catalog-frontend/types';
import { getServerSession } from 'next-auth';
import ConceptPageClient from './concept-page-client';
import { RedirectType, redirect } from 'next/navigation';

type SearchObject = Search.SearchObject;

const ConceptPage = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const { catalogId, conceptId } = params;

  if (!(validOrganizationNumber(catalogId) && validUUID(conceptId))) {
    redirect(`/notfound`, RedirectType.replace);
  }

  if (!(session?.user && Date.now() < (session?.accessTokenExpiresAt ?? 0) * 1000)) {
    redirect(`/auth/signin?callbackUrl=/${catalogId}/${conceptId}`);
  }

  const hasReadPermission =
    session &&
    (hasOrganizationReadPermission(session?.accessToken, catalogId) || hasSystemAdminPermission(session?.accessToken));
  if (!hasReadPermission) {
    redirect(`/${catalogId}/no-access`);
  }

  const concept = await getConcept(conceptId, `${session?.accessToken}`).then((response) => {
    if (response.ok) return response.json();
  });
  if (!concept) {
    redirect(`/notfound`, RedirectType.replace);
  }

  const conceptStatuses = await getConceptStatuses()
    .then((response) => response.json())
    .then((body) => {
      return body?.conceptStatuses ?? [];
    })
    .then((statuses) => prepareStatusList(statuses));

  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);
  const username = session && getUsername(session?.accessToken);

  const organization: Organization = await getOrganization(catalogId).then((response) => response.json());
  const revisions: Concept[] | null = await getConceptRevisions(conceptId, `${session?.accessToken}`).then(
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

  const conceptRelations: Relasjon[] = getConceptRelations(concept);
  const internalConceptRelations: Relasjon[] = getInternalConceptRelations(concept);
  const relatedConcepts: RelatedConcept[] = (await getRelatedConcepts(concept)).map(
    ({ id, uri, title, description, organization }) => {
      const isInternal = organization?.id === catalogId;
      const internalId = getConceptIdFromRdfUri(process.env.CONCEPT_CATALOG_BASE_URI, uri);

      return {
        id,
        title,
        description,
        identifier: uri,
        externalHref: !isInternal,
        href: isInternal && internalId ? `/${catalogId}/${internalId}` : `${process.env.FDK_BASE_URI}/concepts/${id}`,
      } as RelatedConcept;
    },
  );
  const internalRelatedConcepts: RelatedConcept[] = (
    await getInternalRelatedConcepts(concept, session?.accessToken)
  ).map(
    ({ id, anbefaltTerm, definisjon }) =>
      ({
        id,
        title: anbefaltTerm?.navn,
        description: definisjon?.tekst,
        identifier: id,
        externalHref: false,
        href: `/${catalogId}/${id}`,
      } as RelatedConcept),
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
    FDK_REGISTRATION_BASE_URI: process.env.FDK_REGISTRATION_BASE_URI,
  };

  return <ConceptPageClient {...clientProps} />;
};

export default ConceptPage;
