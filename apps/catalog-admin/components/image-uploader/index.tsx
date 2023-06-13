import React, { useEffect, useState } from 'react';
import styles from './image-uploader.module.css';
import { useAdminDispatch } from '../../context/admin';
import { FileImportIcon, TrashIcon } from '@navikt/aksel-icons';
import { localization } from '@catalog-frontend/utils';
import { UploadButton } from '@catalog-frontend/ui';

const allowedFileTypes = ['image/x-png', 'image/svg+xml'];

export function ImageUploader() {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const adminDispatch = useAdminDispatch();

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (await validateImageFile(file))) {
      setImage(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  useEffect(() => {
    adminDispatch({ type: 'SET_LOGO', payload: { logo: image } });
  }, [image, adminDispatch]);

  const validateImageFile = (file: File | null): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(false);
        return;
      }
      if (!file.name.match(/\.(svg|png)$/)) {
        resolve(false);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve(true); // Image content is valid
        };
        img.onerror = () => {
          alert('The content of the file is not valid.');
          resolve(false);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const resetImage = () => {
    setFileName(undefined);
    setImage(undefined);
  };

  return (
    <div className={styles.container}>
      {fileName && (
        <div className={styles.filename}>
          <div className={styles.file}>{fileName}</div>
          <TrashIcon
            title={localization.button.bin}
            onClick={resetImage}
          />
        </div>
      )}
      <UploadButton
        icon={<FileImportIcon fontSize='1.5rem' />}
        allowedMimeTypes={allowedFileTypes}
        onUpload={onImageChange}
      >
        {localization.button.importLogo}
      </UploadButton>
    </div>
  );
}

export default ImageUploader;
