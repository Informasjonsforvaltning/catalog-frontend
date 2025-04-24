'use client';

import { Concept, ChangeRequestUpdateBody, JsonPatchOperation } from '@catalog-frontend/types';
import { localization, pruneEmptyProperties, updateDefinitionsIfEgendefinert } from '@catalog-frontend/utils';
import jsonpatch from 'fast-json-patch';
import { useRouter } from 'next/navigation';
import ConceptForm from '../../../../../components/concept-form';
import { createChangeRequestAction } from '../../../../actions/change-requests/actions';
import { useRef, useState } from 'react';
import { Button, ButtonBar, ConfirmModal, LinkButton } from '@catalog-frontend/ui';
import { ArrowLeftIcon } from '@navikt/aksel-icons';

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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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
    if (changeRequestIdRef.current) {
      router.replace(
        `/catalogs/${organization.organizationId}/change-requests/${changeRequestIdRef.current}/edit?created=true`,
      );
    } else {
      router.replace(`/catalogs/${organization.organizationId}/change-requests`);
    }
  };

  const handleCancel = () => {
    router.replace(`/catalogs/${organization.organizationId}/change-requests`);
  };

  return (
    <>
      {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.cancelForm.title}
          content={localization.confirm.cancelForm.message}
          onSuccess={handleCancel}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
      <ButtonBar>
        <ButtonBar.Left>
          <Button
            variant='tertiary'
            color='second'
            size='sm'
          >
            <ArrowLeftIcon />
            {localization.button.backToOverview}
          </Button>
        </ButtonBar.Left>
      </ButtonBar>
      <ConceptForm
        afterSubmit={handleAfterSubmit}
        autoSaveKey='changeRequestForm'
        catalogId={organization.organizationId}
        initialConcept={changeRequestAsConcept}
        conceptStatuses={conceptStatuses}
        codeListsResult={codeListsResult}
        fieldsResult={fieldsResult}
        usersResult={usersResult}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </>
  );
};
