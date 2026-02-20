"use client";
import { localization } from "@catalog-frontend/utils";
import { Switch } from "@digdir/designsystemet-react";
import styles from "./publish-switch.module.css";
import { publishDataset } from "../../app/actions/actions";
import { Dataset, PublicationStatus } from "@catalog-frontend/types";
import { ReactNode } from "react";

type Props = {
  catalogId: string;
  dataset: Dataset;
  disabled: boolean;
  label?: ReactNode;
};

export const PublishSwitch = ({
  catalogId,
  dataset,
  disabled,
  label,
}: Props) => {
  const handlePublishDataset = async () => {
    if (dataset.approved && !dataset.published) {
      if (window.confirm(localization.datasetForm.alert.confirmPublish)) {
        const publishedDataset = {
          ...dataset,
          published: true,
        };
        try {
          await publishDataset(catalogId, dataset, publishedDataset);
        } catch (error) {
          window.alert(error);
        }
      }
    }

    if (dataset.published) {
      if (window.confirm(localization.datasetForm.alert.confirmUnpublish)) {
        const approvedDataset = {
          ...dataset,
          approved: true,
          published: false,
        };
        try {
          await publishDataset(catalogId, dataset, approvedDataset);
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
        position="end"
        onChange={() => handlePublishDataset()}
        checked={dataset.published}
        disabled={disabled || !(dataset.approved || dataset.published)}
        label={label || localization.publicationState.published}
        data-color="success"
      >
        {localization.publicationState.published}
      </Switch>
    </>
  );
};

export default PublishSwitch;
