import React, { ChangeEvent, useEffect, useState } from "react";
import { TrashIcon, UploadIcon } from "@navikt/aksel-icons";
import { localization, validateImageFile } from "@catalog-frontend/utils";
import { useDeleteLogo, useGetLogo, useUpdateLogo } from "../../hooks/design";
import { useAdminDispatch } from "../../context/admin";
import styles from "./image-uploader.module.css";
import { UploadButton } from "@catalog-frontend/ui";

const allowedFileTypes = ["image/x-png", "image/svg+xml"];

export function ImageUploader({ catalogId }: { catalogId: string }) {
  const [image, setImage] = useState<string | null | undefined>();
  const [fileName, setFileName] = useState<string | null | undefined>(null);
  const adminDispatch = useAdminDispatch();
  const { data: getLogo } = useGetLogo(catalogId);
  const dbLogo = getLogo?.body;
  const dbFileName = getLogo?.headers
    ?.get("Content-Disposition")
    ?.match(/filename="([^"]+)"/)?.[1];

  const updateLogo = useUpdateLogo(catalogId);
  const deleteLogo = useDeleteLogo(catalogId);

  const onImageChange = async (event: ChangeEvent) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const file = event.target.files?.[0];
    if (file && (await validateImageFile(file))) {
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
      setFileName(file.name);

      updateLogo.mutate(file, {
        onError: () => {
          // Remove local preview
          URL.revokeObjectURL(previewUrl);
          setImage(null);
          setFileName(dbFileName);
          alert(localization.alert.updateFailed);
        },
      });
    }
  };

  useEffect(() => {
    adminDispatch({ type: "SET_LOGO", payload: { logo: image } });
  }, [image, adminDispatch]);

  useEffect(() => {
    setFileName(dbFileName);
  }, [dbFileName, dbLogo]);

  const clearImage = () => {
    setFileName(null);
    setImage(null);
  };

  const resetImage = () => {
    if (!dbLogo) {
      clearImage();
      return;
    }
    if (window.confirm("Er du sikker på at du ønsker å slette logoen?")) {
      deleteLogo.mutate(undefined, {
        onSuccess: clearImage,
        onError: () => alert(localization.alert.deleteFailed),
      });
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
            fontSize="25px"
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
