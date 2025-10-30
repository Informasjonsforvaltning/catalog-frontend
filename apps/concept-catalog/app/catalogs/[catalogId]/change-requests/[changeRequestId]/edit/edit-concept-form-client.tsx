'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@navikt/aksel-icons';
import { Button, ButtonBar, ConfirmModal } from '@catalog-frontend/ui';
import type { Concept, ChangeRequestUpdateBody, JsonPatchOperation, StorageData } from '@catalog-frontend/types';
import { LocalDataStorage, localization, updateDefinitionsIfEgendefinert } from '@catalog-frontend/utils';
import ConceptForm from '@concept-catalog/components/concept-form';
import { updateChangeRequestAction } from '@concept-catalog/app/actions/change-requests/actions';
import { conceptJsonPatchOperations } from '@concept-catalog/utils/json-patch';

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [newChangeRequest, setNewChangeRequest] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showGotoConceptConfirm, setShowGotoConceptConfirm] = useState(false);

  const dataStorage = new LocalDataStorage<StorageData>({
    key: 'changeRequestForm',
    secondaryKeys: {
      definition: 'changeRequestFormDefinition',
      relation: 'changeRequestFormRelation',
    },
  });

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
      operations: conceptJsonPatchOperations(
        originalConcept || emptyConcept,
        updateDefinitionsIfEgendefinert(values),
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

  const handleGotoConcept = () => {
    window.location.replace(`/catalogs/${organization.organizationId}/concepts/${originalConcept?.id}`);
  };

  const handleRestore = (data: StorageData): boolean => {
    if (data?.id !== changeRequest.id) {
      if (!data?.id) {
        if (data?.metadata?.newChangeRequestConceptId) {
          window.location.replace(
            `/catalogs/${organization.organizationId}/change-requests/new?concept=${data.metadata.newChangeRequestConceptId}&restore=1`,
          );
        } else {
          window.location.replace(`/catalogs/${organization.organizationId}/change-requests/new?restore=1`);
        }
      } else {
        window.location.replace(`/catalogs/${organization.organizationId}/change-requests/${data.id}/edit?restore=1`);
      }
      return false;
    }
    return true;
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
          title={localization.confirm.exitForm.title}
          content={localization.confirm.exitForm.message}
          onSuccess={handleGotoOverview}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}
      {showGotoConceptConfirm && (
        <ConfirmModal
          title={localization.confirm.exitForm.title}
          content={localization.confirm.exitForm.message}
          onSuccess={handleGotoConcept}
          onCancel={() => setShowGotoConceptConfirm(false)}
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
        <div style={{ flexGrow: 1 }}></div>
        {originalConcept && (
          <Button
            variant='secondary'
            color='second'
            size='sm'
            onClick={() => setShowGotoConceptConfirm(true)}
          >
            {localization.button.gotoConcept}
          </Button>
        )}
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
        onRestore={handleRestore}
        showSnackbarSuccessOnInit={newChangeRequest}
      />
    </>
  );
};
