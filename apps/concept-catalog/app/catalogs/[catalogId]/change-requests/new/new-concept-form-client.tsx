'use client';

import { useRef, useState } from 'react';
import jsonpatch from 'fast-json-patch';
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
import { createChangeRequestAction } from '@concept-catalog/app/actions/change-requests/actions';

export const NewConceptFormClient = ({
  organization,
  changeRequestAsConcept,
  originalConcept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
}: any) => {
  const changeRequestIdRef = useRef<string | undefined>(undefined); // Ref to store the change-request id
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showGotoConceptConfirm, setShowGotoConceptConfirm] = useState(false);

  const catalogId = organization.organizationId;

  const dataStorage = new LocalDataStorage<StorageData>({
    key: 'changeRequestForm',
    secondaryKeys: {
      definition: 'changeRequestFormDefinition',
      relation: 'changeRequestFormRelation',
    },
    metadata: {
      newChangeRequestConceptId: originalConcept?.originaltBegrep,
    },
  });

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

    const clonedConcept = jsonpatch.deepClone(originalConcept || baselineConcept);
    // Remove specified fields from the concept object
    delete clonedConcept.id;
    delete clonedConcept.ansvarligVirksomhet;
    delete clonedConcept.originaltBegrep;
    delete clonedConcept.endringslogelement;
    delete clonedConcept.publiseringsTidspunkt;
    delete clonedConcept.erPublisert;
    delete clonedConcept.isArchived;

    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: originalConcept?.originaltBegrep ?? null,
      operations: jsonpatch.compare(
        pruneEmptyProperties(clonedConcept),
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
        `/catalogs/${organization.organizationId}/change-requests${!originalConcept ? '?filter.itemType=suggestionForNewConcept' : ''}`,
      );
    }
  };

  const handleCancel = () => {
    dataStorage.delete();
    window.location.replace(
      `/catalogs/${organization.organizationId}/change-requests${!originalConcept ? '?filter.itemType=suggestionForNewConcept' : ''}`,
    );
  };

  const handleGotoConcept = () => {
    window.location.replace(`/catalogs/${organization.organizationId}/concepts/${originalConcept?.id}`);
  };

  function handleRestore(data: StorageData): boolean {
    if (data?.id) {
      window.location.replace(`/catalogs/${catalogId}/change-requests/${data.id}/edit?restore=1`);
      return false;
    } else if (data?.metadata?.newChangeRequestConceptId !== originalConcept?.originaltBegrep) {
      window.location.replace(
        `/catalogs/${catalogId}/change-requests/new?concept=${data.metadata.newChangeRequestConceptId}&restore=1`,
      );
      return false;
    }
    return true;
  }

  return (
    <>
      {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.exitForm.title}
          content={localization.confirm.exitForm.message}
          onSuccess={handleCancel}
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
      />
    </>
  );
};
