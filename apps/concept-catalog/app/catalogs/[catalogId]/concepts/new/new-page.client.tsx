'use client';
import ConceptForm from '../../../../../components/concept-form';

export const NewPage = ({ catalogId, concept, conceptStatuses, codeListsResult, fieldsResult, usersResult }) => {
  return (
    <>
      <ConceptForm
        catalogId={catalogId}
        concept={concept}
        conceptStatuses={conceptStatuses}
        codeListsResult={codeListsResult}
        fieldsResult={fieldsResult}
        usersResult={usersResult}
      />
    </>
  );
};
