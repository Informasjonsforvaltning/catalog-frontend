"use client";
import { localization } from "@catalog-frontend/utils";
import { Switch } from "@digdir/designsystemet-react";
import styles from "./publish-switch.module.css";
import { publishDataset, unpublishDataset } from "../../app/actions/actions";
import { Dataset } from "@catalog-frontend/types";

type Props = {
  catalogId: string;
  dataset: Dataset;
  disabled: boolean;
};

export const PublishSwitch = ({ catalogId, dataset, disabled }: Props) => {
  const handlePublishDataset = async () => {
    if (dataset.approved && !dataset.published) {
      if (window.confirm(localization.datasetForm.alert.confirmPublish)) {
        try {
          await publishDataset(catalogId, dataset.id);
        } catch (error) {
          window.alert(error);
        }
      }
    }

    if (dataset.published) {
      if (window.confirm(localization.datasetForm.alert.confirmUnpublish)) {
        try {
          await unpublishDataset(catalogId, dataset);
        } catch (error) {
          window.alert(error);
        }
      }
    }
  };

  return (
    <>
      <Switch
        className={styles.center}
        data-size="sm"
        position="end"
        onChange={() => handlePublishDataset()}
        checked={dataset.published}
        disabled={disabled || !(dataset.approved || dataset.published)}
        label={localization.publicationState.published}
      />
    </>
  );
};

export default PublishSwitch;
