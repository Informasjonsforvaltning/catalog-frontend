'use client';

import { Concept } from '@catalog-frontend/types';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createConcept } from '../../../../actions/concept/actions';
import ConceptForm from '../../../../../components/concept-form';

export const NewPage = ({ catalogId, concept, conceptStatuses, codeListsResult, fieldsResult, usersResult }) => {
  const router = useRouter();
  const conceptIdRef = useRef<string | undefined>(undefined); // Ref to store the concept id
  
  const handleCreate = async (values: Concept) => {
    const conceptId = await createConcept(values, catalogId.toString());
    conceptIdRef.current = conceptId;
    return undefined;
  };

  const handleAfterSubmit = () => {
    if (conceptIdRef.current) {
      router.replace(`/catalogs/${catalogId}/concepts/${conceptIdRef.current}/edit?created=true`);
    } else {
      router.replace(`/catalogs/${catalogId}/concepts`);
    }    
  };
 
  const handleCancel = () => {
    router.replace(`/catalogs/${catalogId}/concepts`);
  };

  return (
    <ConceptForm
      afterSubmit={handleAfterSubmit}
      catalogId={catalogId}
      initialConcept={concept}
      conceptStatuses={conceptStatuses}
      codeListsResult={codeListsResult}
      fieldsResult={fieldsResult}
      usersResult={usersResult}
      onSubmit={handleCreate}
      onCancel={handleCancel}
    />
  );
};
