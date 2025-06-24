import { UploadButton } from '@catalog-frontend/ui';
import { FileImportIcon } from '@navikt/aksel-icons';
import { localization } from '@catalog-frontend/utils';
import React from 'react';
import { useImportRdfConcepts } from '@concept-catalog/hooks/import';


interface Props {
  catalogId: string;
}

export const ImportConceptRdf = ( { catalogId }: Props) => {

  const extension2Type: Map<string, string> = new Map<string, string>();
  extension2Type.set('.ttl', 'text/turtle');
  extension2Type.set('.rdf', 'application/rdf+xml');
  extension2Type.set('.xml', 'application/rdf+xml');
  extension2Type.set('.jsonld', 'application/ld+json');
  extension2Type.set('.json', 'application/rdf+json');
  const allowedExtensions = Array.from(extension2Type.keys());
  const allowedMimeTypes = Array.from(extension2Type.values());
  const uploadRdf = useImportRdfConcepts(catalogId);
  const onFileUpload = async (event) => {
    const file: File = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const contentType = extension2Type.get(`.${fileExtension}`);
      if (!fileExtension || ! contentType) {
        console.error('Uploaded file has no extension or unsupported extension:', fileExtension);
        return;
      }
      reader.onload = function (evt) {
        if (evt.target && typeof evt.target.result === 'string') {
            uploadRdf.mutate({fileContent: evt.target.result, contentType: contentType });
        } else console.error('File content is not a string');
      };
    }
  }

  return (
    <UploadButton
      allowedMimeTypes={allowedExtensions}
      onUpload={(e) => onFileUpload(e)}
    >
      <FileImportIcon fontSize='1.5rem' />
      <span>{localization.button.importConceptRDF}</span>
    </UploadButton>
  );
};

export default ImportConceptRdf;