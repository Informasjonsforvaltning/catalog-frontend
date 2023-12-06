'use client';

import {
  Concept,
  ChangeRequest,
  ChangeRequestUpdateBody,
  JsonPatchOperation,
  Organization,
} from '@catalog-frontend/types';
import jsonpatch from 'fast-json-patch';
import { useCreateChangeRequest } from '../../../../hooks/change-requests';
import ChangeRequestForm from '../../../../components/change-request-form/change-request-form';
import { FC } from 'react';

interface Props {
  organization: Organization;
  changeRequestAsConcept: Concept;
  originalConcept: Concept;
}

const NewConceptSuggestionClient: FC<Props> = ({ organization, changeRequestAsConcept, originalConcept }) => {
  const catalogId = organization.organizationId;

  const changeRequestMutateHook = useCreateChangeRequest({ catalogId: catalogId });
  const submitHandler = (values: Concept) => {
    const anbefaltTerm = values.anbefaltTerm?.navn.nb || values.anbefaltTerm?.navn.nn || values.anbefaltTerm?.navn.en;
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

export default NewConceptSuggestionClient;
