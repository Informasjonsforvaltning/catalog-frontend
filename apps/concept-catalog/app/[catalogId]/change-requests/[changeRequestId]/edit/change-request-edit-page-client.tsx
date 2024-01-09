'use client';

import {
  Concept,
  ChangeRequestUpdateBody,
  JsonPatchOperation,
  Organization,
  ChangeRequest,
} from '@catalog-frontend/types';
import { updateDefinitionsIfEgendefinert } from '@catalog-frontend/utils';
import jsonpatch from 'fast-json-patch';
import { useUpdateChangeRequest } from '../../../../../hooks/change-requests';
import { useRouter } from 'next/navigation';

import ChangeRequestForm from '../../../../../components/change-request-form/change-request-form';
import { FC, useState } from 'react';

interface Props {
  organization: Organization;
  changeRequest: ChangeRequest;
  changeRequestAsConcept: Concept;
  originalConcept?: Concept;
}

const ChangeRequestEditPageClient: FC<Props> = ({
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
}) => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const emptyConcept: Concept = originalConcept || {
    id: null,
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

  const changeRequestMutateHook = useUpdateChangeRequest({
    catalogId: organization.organizationId,
    changeRequestId: changeRequest.id,
  });
  const submitHandler = (values: Concept) => {
    setIsSubmitting(true);
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
      conceptId: originalConcept?.id ?? null,
      operations: jsonpatch.compare(
        originalConcept || emptyConcept,
        updateDefinitionsIfEgendefinert(values),
      ) as JsonPatchOperation[],
      title: changeRequestTitle,
    };

    changeRequestMutateHook.mutate(changeRequestFromConcept, {
      onSuccess: () => {
        router.refresh();
      },
      onSettled: () => {
        setIsSubmitting(false);
      },
    });
  };

  const clientProps = {
    changeRequestAsConcept,
    originalConcept,
    readOnly: false,
    isSubmitting,
    submitHandler,
  };

  return <ChangeRequestForm {...clientProps} />;
};

export default ChangeRequestEditPageClient;
