"use client";

import { Box, Button, Modal, Paragraph } from "@digdir/designsystemet-react";
import Link from "next/link";
import { localization } from "@catalog-frontend/utils";
import style from "./new-dataset-modal.module.scss";

type NewDatasetModalProps = {
  catalogId: string;
  trigger: React.ReactNode;
};

export const NewDatasetModal = ({
  catalogId,
  trigger,
}: NewDatasetModalProps) => {
  return (
    <Modal.Root>
      <Modal.Trigger asChild>{trigger}</Modal.Trigger>
      <Modal.Dialog>
        <Modal.Header className={style.header}>
          {localization.datasetForm.datasetTypeModal.title}
        </Modal.Header>
        <Modal.Content className={style.content}>
          <Paragraph size="sm" className={style.intro}>
            {localization.datasetForm.datasetTypeModal.intro}
          </Paragraph>
          <div className={style.options}>
            <Box className={style.option}>
              <h3 className={style.optionTitle}>
                {
                  localization.datasetForm.datasetTypeModal.standardDataset
                    .title
                }
              </h3>
              <p className={style.optionDescription}>
                {
                  localization.datasetForm.datasetTypeModal.standardDataset
                    .description
                }
              </p>
              <Button
                size="sm"
                variant="primary"
                asChild
                className={style.selectButton}
              >
                <Link href={`/catalogs/${catalogId}/datasets/new`}>
                  {localization.datasetForm.datasetTypeModal.selectButton}
                </Link>
              </Button>
            </Box>
            <Box className={style.option}>
              <h3 className={style.optionTitle}>
                {
                  localization.datasetForm.datasetTypeModal.mobilityDataset
                    .title
                }
              </h3>
              <p className={style.optionDescription}>
                {
                  localization.datasetForm.datasetTypeModal.mobilityDataset
                    .description
                }
              </p>
              <Button
                size="sm"
                variant="primary"
                asChild
                className={style.selectButton}
              >
                <Link href={`/catalogs/${catalogId}/datasets/new-transport`}>
                  {localization.datasetForm.datasetTypeModal.selectButton}
                </Link>
              </Button>
            </Box>
          </div>
        </Modal.Content>
      </Modal.Dialog>
    </Modal.Root>
  );
};
