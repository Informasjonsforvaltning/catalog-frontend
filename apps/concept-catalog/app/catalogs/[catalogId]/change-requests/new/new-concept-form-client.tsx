'use client';

import { Concept, ChangeRequestUpdateBody, JsonPatchOperation } from '@catalog-frontend/types';
import { pruneEmptyProperties, updateDefinitionsIfEgendefinert } from '@catalog-frontend/utils';
import jsonpatch from 'fast-json-patch';
import { useRouter } from 'next/navigation';
import ConceptForm from '../../../../../components/concept-form';
import { createChangeRequestAction } from '../../../../actions/change-requests/actions';
import { useRef } from 'react';

export const NewConceptFormClient = ({
  organization,
  changeRequestAsConcept,
  originalConcept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
}) => {
  const router = useRouter();
  const changeRequestIdRef = useRef<string | undefined>(undefined); // Ref to store the change-request id

  const catalogId = organization.organizationId;

  const baselineConcept: Concept = {
    id: null,
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

  const handleSubmit = async (values: Concept) => {
    const anbefaltTerm =
      originalConcept?.anbefaltTerm?.navn.nb ||
      originalConcept?.anbefaltTerm?.navn.nn ||
      originalConcept?.anbefaltTerm?.navn.en ||
      values.anbefaltTerm?.navn.nb ||
      values.anbefaltTerm?.navn.nn ||
      values.anbefaltTerm?.navn.en;

    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: originalConcept?.originaltBegrep ?? null,
      operations: jsonpatch.compare(
        pruneEmptyProperties(originalConcept || baselineConcept),
        pruneEmptyProperties(updateDefinitionsIfEgendefinert(values)),
      ) as JsonPatchOperation[],
      title: anbefaltTerm ? `${anbefaltTerm}` : '',
    };

    const id = await createChangeRequestAction(catalogId, changeRequestFromConcept);
    changeRequestIdRef.current = id;
    return undefined;
  };

  const handleAfterSubmit = () => {
    if(changeRequestIdRef.current){
      router.push(`/catalogs/${organization.organizationId}/change-requests/${changeRequestIdRef.current}/edit?created=true`);
    } else {
      router.push(`/catalogs/${organization.organizationId}/change-requests`);
    }
    router.refresh();
  };

  const handleCancel = () => {
    router.push(`/catalogs/${organization.organizationId}/change-requests`);
    router.refresh();
  };

  return (
    <ConceptForm
      afterSubmit={handleAfterSubmit}
      catalogId={organization.organizationId}
      initialConcept={changeRequestAsConcept}
      conceptStatuses={conceptStatuses}
      codeListsResult={codeListsResult}
      fieldsResult={fieldsResult}
      usersResult={usersResult}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};
