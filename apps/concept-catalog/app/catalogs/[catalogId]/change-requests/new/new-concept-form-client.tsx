'use client';

import { useRef, useState } from 'react';
import jsonpatch from 'fast-json-patch';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import type { Concept, ChangeRequestUpdateBody, JsonPatchOperation, StorageData } from '@catalog-frontend/types';
import {
  LocalDataStorage,
  localization,
  pruneEmptyProperties,
  updateDefinitionsIfEgendefinert,
} from '@catalog-frontend/utils';
import ConceptForm from '../../../../../components/concept-form';
import { createChangeRequestAction } from '../../../../actions/change-requests/actions';

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

  const dataStorage = new LocalDataStorage<StorageData>({ key: 'changeRequestForm' });

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
      window.location.replace(
        `/catalogs/${organization.organizationId}/change-requests/${changeRequestIdRef.current}/edit?created=true`,
      );
    } else {
      window.location.replace(
        `/catalogs/${organization.organizationId}/change-requests?filter.itemType=suggestionForNewConcept`,
      );
    }
  };

  const handleCancel = () => {
    dataStorage.delete();
    window.location.replace(
      `/catalogs/${organization.organizationId}/change-requests?filter.itemType=suggestionForNewConcept`,
    );
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
        <Button
          variant='tertiary'
          color='second'
          size='sm'
          onClick={handleCancel}
        >
          <ArrowLeftIcon fontSize='1.25em' />
          {localization.button.backToOverview}
        </Button>
      </ButtonBar>
      <ConceptForm
        afterSubmit={handleAfterSubmit}
        autoSaveStorage={dataStorage}
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
