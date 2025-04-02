'use client';

import { useRef } from 'react';
import { Concept, ChangeRequestUpdateBody, JsonPatchOperation } from '@catalog-frontend/types';
import { pruneEmptyProperties, updateDefinitionsIfEgendefinert } from '@catalog-frontend/utils';
import jsonpatch from 'fast-json-patch';
import { useRouter } from 'next/navigation';
import ConceptForm from '../../../../../components/concept-form';
import { useCreateChangeRequest } from '../../../../../hooks/change-requests';

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

  const changeRequestMutateHook = useCreateChangeRequest({
    catalogId: catalogId,
  });

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

    const id = await changeRequestMutateHook.mutateAsync(changeRequestFromConcept);
    changeRequestIdRef.current = id;
  };

  const handleAfterSubmit = () => {
    if(changeRequestIdRef.current){
      router.push(`/catalogs/${organization.organizationId}/change-requests/${changeRequestIdRef.current}`);
    } else {
      router.push(`/catalogs/${organization.organizationId}/change-requests`);
    }    
  };

  const handleCancel = () => {
    router.push(`/catalogs/${organization.organizationId}/change-requests`);
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
