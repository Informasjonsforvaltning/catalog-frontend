'use client';

import { Concept, ChangeRequestUpdateBody, JsonPatchOperation, Organization } from '@catalog-frontend/types';
import jsonpatch from 'fast-json-patch';
import { useCreateChangeRequest } from '../../../../hooks/change-requests';
import ChangeRequestForm from '../../../../components/change-request-form/change-request-form';
import { FC } from 'react';

interface Props {
  organization: Organization;
  changeRequestAsConcept: Concept;
  originalConcept: Concept;
}

const ChangeRequestOrNewClient: FC<Props> = ({ organization, changeRequestAsConcept, originalConcept }) => {
  const catalogId = organization.organizationId;

  const changeRequestMutateHook = useCreateChangeRequest({
    catalogId: catalogId,
  });
  const submitHandler = (values: Concept) => {
    const anbefaltTerm =
      originalConcept.anbefaltTerm?.navn.nb ||
      originalConcept.anbefaltTerm?.navn.nn ||
      originalConcept.anbefaltTerm?.navn.en ||
      values.anbefaltTerm?.navn.nb ||
      values.anbefaltTerm?.navn.nn ||
      values.anbefaltTerm?.navn.en;
    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: originalConcept.id,
      operations: jsonpatch.compare(originalConcept, values) as JsonPatchOperation[],
      title: anbefaltTerm || '',
    };
    changeRequestMutateHook.mutate(changeRequestFromConcept);
  };

  return (
    <ChangeRequestForm
      changeRequestAsConcept={changeRequestAsConcept}
      readOnly={false}
      submitHandler={submitHandler}
    />
  );
};

export default ChangeRequestOrNewClient;
