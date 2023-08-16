import React, { useEffect, useState } from 'react';
import styles from './image-uploader.module.css';
import { useAdminDispatch } from '../../context/admin';
import { FileImportIcon, TrashIcon, UploadIcon } from '@navikt/aksel-icons';
import { localization } from '@catalog-frontend/utils';
import { UploadButton } from '@catalog-frontend/ui';
import { validateImageFile } from '@catalog-frontend/utils';
import { useDeleteLogo, useGetLogo, useUpdateLogo } from 'apps/catalog-admin/hooks/design';
import { useRouter } from 'next/router';

const allowedFileTypes = ['image/x-png', 'image/svg+xml'];

export function ImageUploader() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const adminDispatch = useAdminDispatch();

  const router = useRouter();
  const catalogId = `${router.query.catalogId}` || '';

  const { data: getLogo } = useGetLogo(catalogId);
  const dbLogo = getLogo;

  const updateLogo = useUpdateLogo(catalogId);
  const deleteLogo = useDeleteLogo(catalogId);

  const onImageChange = async (event) => {
    const file = event.target.files?.[0];
    const blob = new Blob([file], { type: file.type });
    if (file && (await validateImageFile(file))) {
      setImage(URL.createObjectURL(file));
      setFileName(file.name);

      const reader = new FileReader();
      //const test = reader.readAsBinaryString(file);

      reader.onload = (e) => {
        const svgText = e.target?.result;
        //setSvgContent(svgText);
        console.log('test', typeof svgText);
      };
      reader.readAsBinaryString(file);

      updateLogo.mutate(blob);
    }
  };

  useEffect(() => {
    adminDispatch({ type: 'SET_LOGO', payload: { logo: image } });
  }, [image, adminDispatch]);

  useEffect(() => {
    setFileName(typeof dbLogo);
  }, [dbLogo]);

  const handleDeleteLogo = () => {
    if (window.confirm('Er du sikker på at du ønsker å slette logoen?')) {
      deleteLogo.mutate();
    }
  };

  const resetImage = () => {
    setFileName(undefined);
    setImage(undefined);
    if (dbLogo) {
      handleDeleteLogo();
    }
  };

  return (
    <div className={styles.container}>
      {!fileName && <UploadIcon className={styles.uploadIcon} />}
      {fileName && (
        <div className={styles.filename}>
          <div className={styles.file}>{fileName}</div>
          <TrashIcon
            title={localization.button.bin}
            onClick={resetImage}
            fontSize={'25px'}
          />
        </div>
      )}
      <UploadButton
        allowedMimeTypes={allowedFileTypes}
        onUpload={(e) => {
          onImageChange(e);
        }}
      >
        {localization.button.importLogo}
      </UploadButton>
    </div>
  );
}

export default ImageUploader;
