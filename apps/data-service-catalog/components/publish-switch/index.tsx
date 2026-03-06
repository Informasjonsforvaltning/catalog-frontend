"use client";
import { useState } from "react";
import { localization } from "@catalog-frontend/utils";
import { Field, Input, Label } from "@digdir/designsystemet-react";
import { ConfirmModal } from "@catalog-frontend/ui-v2";
import {
  publishDataService,
  unpublishDataService,
} from "../../app/actions/actions";
import { DataService } from "@catalog-frontend/types";

type Props = {
  catalogId: string;
  dataService: DataService;
  disabled: boolean;
};

export const PublishSwitch = ({ catalogId, dataService, disabled }: Props) => {
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);

  const handlePublishDataService = async () => {
    if (!dataService.published) {
      setShowPublishConfirm(true);
    }

    if (dataService.published) {
      setShowUnpublishConfirm(true);
    }
  };

  const handleConfirmPublish = async () => {
    try {
      await publishDataService(catalogId, dataService.id);
      setShowPublishConfirm(false);
    } catch (error) {
      window.alert(error);
    }
  };

  const handleConfirmUnpublish = async () => {
    try {
      await unpublishDataService(catalogId, dataService.id);
      setShowUnpublishConfirm(false);
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <>
      <Field
        position="end"
        style={{
          alignItems: "center",
          padding: "var(--ds-size-2) 0",
        }}
      >
        <Label>
          {dataService.published
            ? localization.publicationState.published
            : localization.publicationState.unpublished}
        </Label>
        <Input
          type="checkbox"
          role="switch"
          onChange={() => handlePublishDataService()}
          checked={dataService.published}
          disabled={disabled}
          data-testid="data-service-publish-switch"
          aria-labelledby="data-service-publish-switch"
        />
      </Field>

      {showPublishConfirm && (
        <ConfirmModal
          title={
            localization.dataServiceForm.alert.confirmPublish ||
            "Bekreft publisering"
          }
          content={localization.dataServiceForm.alert.confirmPublish}
          successButtonText={localization.button.publish}
          onSuccess={handleConfirmPublish}
          onCancel={() => setShowPublishConfirm(false)}
        />
      )}

      {showUnpublishConfirm && (
        <ConfirmModal
          title={
            localization.dataServiceForm.alert.confirmUnpublish ||
            "Bekreft avpublisering"
          }
          content={localization.dataServiceForm.alert.confirmUnpublish}
          successButtonText={localization.button.unpublish}
          onSuccess={handleConfirmUnpublish}
          onCancel={() => setShowUnpublishConfirm(false)}
        />
      )}
    </>
  );
};

export default PublishSwitch;
