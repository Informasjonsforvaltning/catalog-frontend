import {
  hasOrganizationReadPermission,
  getUsername,
  validOrganizationNumber,
  validUUID,
  hasSystemAdminPermission,
  hasOrganizationWritePermission,
  prepareStatusList,
  authOptions,
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
} from '@catalog-frontend/types';
import { getServerSession } from 'next-auth';
import ConceptPageClient from './concept-page-client';
import { RedirectType, redirect } from 'next/navigation';

const ConceptPage = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const { catalogId, conceptId } = params;

  if (!(validOrganizationNumber(catalogId) && validUUID(conceptId))) {
    redirect(`/notfound`, RedirectType.replace);
  }

  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    redirect(`/auth/signin?callbackUrl=/${catalogId}/${conceptId}`);
  }

  const hasReadPermission =
    session &&
    (hasOrganizationReadPermission(session?.accessToken, catalogId) || hasSystemAdminPermission(session?.accessToken));
  if (!hasReadPermission) {
    redirect(`/${catalogId}/no-access`);
  }

  const concept: Concept | null = await getConcept(conceptId, `${session?.accessToken}`).then((response) => {
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

  const conceptToSkosConceptMapper = (relatedConcepts: Concept[]): SkosConcept[] => {
    return relatedConcepts.map(({ id, anbefaltTerm, definisjon }) => ({
      identifier: id,
      prefLabel: anbefaltTerm?.navn,
      definition: { text: definisjon?.tekst },
    })) as SkosConcept[];
  };

  const relatedConcepts: SkosConcept[] = await getRelatedConcepts(concept);
  const conceptRelations: Relasjon[] = getConceptRelations(concept);
  const internalConceptRelations: Relasjon[] = getInternalConceptRelations(concept);
  const internalRelatedConcepts: SkosConcept[] = conceptToSkosConceptMapper(
    await getInternalRelatedConcepts(concept, session?.accessToken),
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
    changeRequestEnabled: process.env.CHANGE_REQUEST_FEATURE_TOGGLE === 'true',
  };

  return <ConceptPageClient {...clientProps} />;
};

export default ConceptPage;
