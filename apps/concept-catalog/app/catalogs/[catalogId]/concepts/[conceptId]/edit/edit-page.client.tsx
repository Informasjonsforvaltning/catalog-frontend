'use client';

import { localization } from '@catalog-frontend/utils';
import { Concept } from '@catalog-frontend/types';
import ConceptForm from '../../../../../../components/concept-form';
import { createConcept, updateConcept } from '../../../../../actions/concept/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ConfirmModal } from '@catalog-frontend/ui';

export const EditPage = ({
  catalogId,
  concept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
  hasChangeRequests,
}) => {
  const router = useRouter();
  const conceptIdRef = useRef<string | undefined>(undefined); // Ref to store the concept id
  const [autoSave, setAutoSave] = useState(hasChangeRequests ? false : true);

  const handleUpdate = async (values: Concept) => {
    if ('id' in concept) {
      try {
        const conceptId = await updateConcept(catalogId.toString(), concept, values);
        conceptIdRef.current = conceptId; // Store the created concept in the ref
      } catch (error) {
        window.alert(`${localization.alert.updateFailed} ${error}`);
      }
    } else {
      const conceptId = await createConcept(values, catalogId.toString());
      conceptIdRef.current = conceptId; // Store the created concept in the ref
    }
  };

  const handleAfterSubmit = () => {
    if (conceptIdRef.current) {
      router.push(`/catalogs/${catalogId}/concepts/${conceptIdRef.current}`);
    } else {
      router.push(`/catalogs/${catalogId}/concepts`);
    }
    router.refresh();
  };

  const handleCancel = () => {
    router.push(concept.id ? `/catalogs/${catalogId}/concepts/${concept.id}` : `/catalogs/${catalogId}/concepts`);
    router.refresh();
  };

  const handleSuccess = () => {
    setAutoSave(true);
  };

  return (
    <>
      {hasChangeRequests && (
        <ConfirmModal
          title={localization.changeRequest.changeRequest}
          content={localization.concept.confirmEditWithChangeRequest}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}

      <ConceptForm
        autoSave={autoSave}
        afterSubmit={handleAfterSubmit}
        catalogId={catalogId}
        initialConcept={concept}
        conceptStatuses={conceptStatuses}
        codeListsResult={codeListsResult}
        fieldsResult={fieldsResult}
        usersResult={usersResult}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </>
  );
};
