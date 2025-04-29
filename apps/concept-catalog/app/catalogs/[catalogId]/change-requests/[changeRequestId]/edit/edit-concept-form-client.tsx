'use client';

import { useEffect, useState } from 'react';
import jsonpatch from 'fast-json-patch';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import type { Concept, ChangeRequestUpdateBody, JsonPatchOperation, StorageData } from '@catalog-frontend/types';
import {
  LocalDataStorage,
  localization,
  pruneEmptyProperties,
  updateDefinitionsIfEgendefinert,
} from '@catalog-frontend/utils';
import ConceptForm from '@concept-catalog/components/concept-form';
import { updateChangeRequestAction } from '@concept-catalog/app/actions/change-requests/actions';

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [newChangeRequest, setNewChangeRequest] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const dataStorage = new LocalDataStorage<StorageData>({ key: 'changeRequestForm' });

  const emptyConcept: Concept = originalConcept || {
    id: null,
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

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

    return await updateChangeRequestAction(organization.organizationId, changeRequest.id, changeRequestFromConcept);
  };

  const handleAfterSubmit = () => {
    if (!newChangeRequest) {
      window.location.replace(
        `/catalogs/${organization.organizationId}/change-requests/${changeRequest.id}?saved=true`,
      );
    }
  };

  const handleCancel = () => {
    window.location.replace(`/catalogs/${organization.organizationId}/change-requests/${changeRequest.id}`);
  };

  const handleGotoOverview = () => {
    dataStorage.delete();
    window.location.replace(
      `/catalogs/${organization.organizationId}/change-requests${!originalConcept ? '?filter.itemType=suggestionForNewConcept' : ''}`,
    );
  };

  useEffect(() => {
    if (searchParams.get('created') === 'true') {
      setNewChangeRequest(true);

      // Remove the param and update the URL shallowly
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('created');

      const newUrl = newParams.toString().length > 0 ? `${pathname}?${newParams.toString()}` : pathname;

      window.history.replaceState(null, '', newUrl);
    }
  }, [searchParams, pathname]);

  return (
    <>
      {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.cancelForm.title}
          content={localization.confirm.cancelForm.message}
          onSuccess={handleGotoOverview}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
      <ButtonBar>
        <Button
          variant='tertiary'
          color='second'
          size='sm'
          onClick={() => setShowCancelConfirm(true)}
        >
          <ArrowLeftIcon fontSize='1.25em' />
          {localization.button.backToOverview}
        </Button>
      </ButtonBar>
      <ConceptForm
        afterSubmit={handleAfterSubmit}
        autoSaveId={changeRequest.id}
        autoSaveStorage={dataStorage}
        catalogId={organization.organizationId}
        initialConcept={changeRequestAsConcept}
        conceptStatuses={conceptStatuses}
        codeListsResult={codeListsResult}
        fieldsResult={fieldsResult}
        usersResult={usersResult}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        showSnackbarSuccessOnInit={newChangeRequest}
      />
    </>
  );
};
