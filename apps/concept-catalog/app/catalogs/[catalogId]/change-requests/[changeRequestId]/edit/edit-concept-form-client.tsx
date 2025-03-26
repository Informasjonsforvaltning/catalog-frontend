'use client';

import {
  Concept,
  ChangeRequestUpdateBody,
  JsonPatchOperation,
} from '@catalog-frontend/types';
import { pruneEmptyProperties, updateDefinitionsIfEgendefinert } from '@catalog-frontend/utils';
import jsonpatch from 'fast-json-patch';
import { useRouter } from 'next/navigation';
import { useUpdateChangeRequest } from '../../../../../../hooks/change-requests';
import ConceptForm from '../../../../../../components/concept-form';

export const EditConceptFormClient = ({
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
}) => {
  const router = useRouter();

  const emptyConcept: Concept = originalConcept || {
    id: null,
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

  const changeRequestMutateHook = useUpdateChangeRequest({
    catalogId: organization.organizationId,
    changeRequestId: changeRequest.id,
  });

  const handleSubmit = async (values: Concept) => {
    const changeRequestTitle =
      (originalConcept &&
        (originalConcept.anbefaltTerm?.navn?.nb ||
          originalConcept.anbefaltTerm?.navn?.nn ||
          originalConcept.anbefaltTerm?.navn?.en)) ||
      values.anbefaltTerm?.navn?.nb ||
      values.anbefaltTerm?.navn?.nn ||
      values.anbefaltTerm?.navn?.en ||
      '';

    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: originalConcept?.originaltBegrep ?? null,
      operations: jsonpatch.compare(
        pruneEmptyProperties(originalConcept || emptyConcept),
        pruneEmptyProperties(updateDefinitionsIfEgendefinert(values)),
      ) as JsonPatchOperation[],
      title: `${changeRequestTitle}`,
    };

    await changeRequestMutateHook.mutateAsync(changeRequestFromConcept);
  };

  const handleAfterSubmit = () => {
    router.push(`/catalogs/${organization.organizationId}/change-requests/${changeRequest.id}`);
  };

  const handleCancel = () => {
    router.push(`/catalogs/${organization.organizationId}/change-requests/${changeRequest.id}`);
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
