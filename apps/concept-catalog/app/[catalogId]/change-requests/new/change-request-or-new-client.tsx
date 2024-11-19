'use client';

import { Concept, ChangeRequestUpdateBody, JsonPatchOperation, Organization } from '@catalog-frontend/types';
import jsonpatch from 'fast-json-patch';
import { useCreateChangeRequest } from '../../../../hooks/change-requests';
import ChangeRequestForm from '../../../../components/change-request-form/change-request-form';
import { FC, useState } from 'react';
import { pruneEmptyProperties, updateDefinitionsIfEgendefinert } from '@catalog-frontend/utils';

interface Props {
  organization: Organization;
  changeRequestAsConcept: Concept;
  originalConcept?: Concept;
}

const ChangeRequestOrNewClient: FC<Props> = ({ organization, changeRequestAsConcept, originalConcept }) => {
  const catalogId = organization.organizationId;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeRequestMutateHook = useCreateChangeRequest({
    catalogId: catalogId,
  });

  const baselineConcept: Concept = {
    id: null,
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

  const submitHandler = async ({ values }: { values: Concept }) => {
    setIsSubmitting(true);
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
      title: anbefaltTerm ?? '',
    };

    changeRequestMutateHook.mutate(changeRequestFromConcept, {
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <ChangeRequestForm
      changeRequestAsConcept={changeRequestAsConcept}
      readOnly={false}
      submitHandler={submitHandler}
      isSubmitting={isSubmitting}
    />
  );
};

export default ChangeRequestOrNewClient;
