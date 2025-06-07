import { UploadButton } from '@catalog-frontend/ui';
import { FileImportIcon } from '@navikt/aksel-icons';
import { localization } from '@catalog-frontend/utils';
import React from 'react';
import { useImportRdfConcepts } from '@concept-catalog/hooks/import';


interface Props {
  catalogId: string;
}

export const ImportConceptRdf = ( { catalogId }: Props) => {

  console.log("Concept-RDF-upload:", process.env.CONCEPT_CATALOG_BASE_URI);
  const allowedFileTypesRDF = ['.ttl', '.n3', '.rdf', '.owl', '.xml', '.jsonld'];
  const uploadRdf = useImportRdfConcepts(catalogId, "text/turtle");
  const onFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = function (evt) {
        console.log("Checking if the content is a string");
        if (evt.target && typeof evt.target.result === 'string') {
          console.log("The file is string, proceeding with upload");
          console.log("File extension", file.name.split('.').pop());
          if (file.name.split('.').pop() === 'ttl') {
            uploadRdf.mutate(evt.target.result);
          }
        }
      };
    }
  }

  return (
    <UploadButton
      allowedMimeTypes={allowedFileTypesRDF}
      onUpload={(e) => onFileUpload(e)}
    >
      <FileImportIcon fontSize='1.5rem' />
      <span>{localization.button.importConceptRDF}</span>
    </UploadButton>
  );
};

export default ImportConceptRdf;