'use client';

import {
  Concept,
  ChangeRequestUpdateBody,
  JsonPatchOperation,
  Organization,
  ChangeRequest,
} from '@catalog-frontend/types';
import jsonpatch from 'fast-json-patch';
import { useUpdateChangeRequest } from '../../../../../hooks/change-requests';
import { useRouter } from 'next/navigation';

import ChangeRequestForm from '../../../../../components/change-request-form/change-request-form';
import { FC } from 'react';

interface Props {
  organization: Organization;
  changeRequest: ChangeRequest;
  changeRequestAsConcept: Concept;
  originalConcept: Concept;
}

const ChangeRequestEditPageClient: FC<Props> = ({
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
}) => {
  const router = useRouter();

  const changeRequestMutateHook = useUpdateChangeRequest({
    catalogId: organization.organizationId,
    changeRequestId: changeRequest.id,
  });
  const submitHandler = (values: Concept) => {
    const changeRequestTitle =
      originalConcept.anbefaltTerm?.navn?.nb ||
      originalConcept.anbefaltTerm?.navn?.nn ||
      originalConcept.anbefaltTerm?.navn?.en ||
      '';
    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: originalConcept.id,
      operations: jsonpatch.compare(originalConcept, values) as JsonPatchOperation[],
      title: changeRequestTitle,
    };

    changeRequestMutateHook.mutate(changeRequestFromConcept, {
      onSuccess: () => {
        router.refresh();
      },
    });
  };

  return (
    <ChangeRequestForm
      changeRequestAsConcept={changeRequestAsConcept}
      readOnly={false}
      submitHandler={submitHandler}
    />
  );
};

export default ChangeRequestEditPageClient;
