"use client";
import { useState } from "react";
import { localization } from "@catalog-frontend/utils";
import { Field, Input, Label } from "@digdir/designsystemet-react";
import { ConfirmModal } from "@catalog-frontend/ui";
import {
  publishInformationModel,
  unpublishInformationModel,
} from "../../app/actions/actions";
import { InformationModel } from "@catalog-frontend/types";

type Props = {
  catalogId: string;
  informationModel: InformationModel;
  disabled: boolean;
};

export const PublishSwitch = ({
  catalogId,
  informationModel,
  disabled,
}: Props) => {
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);

  const handlePublishInformationModel = async () => {
    if (!informationModel.published) {
      setShowPublishConfirm(true);
    }

    if (informationModel.published) {
      setShowUnpublishConfirm(true);
    }
  };

  const handleConfirmPublish = async () => {
    try {
      await publishInformationModel(catalogId, informationModel.id);
      setShowPublishConfirm(false);
    } catch (error) {
      window.alert(error);
    }
  };

  const handleConfirmUnpublish = async () => {
    try {
      await unpublishInformationModel(catalogId, informationModel.id);
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
          {informationModel.published
            ? localization.publicationState.published
            : localization.publicationState.unpublished}
        </Label>
        <Input
          type="checkbox"
          role="switch"
          onChange={() => handlePublishInformationModel()}
          checked={informationModel.published}
          disabled={disabled}
          data-testid="information-model-publish-switch"
          aria-labelledby="information-model-publish-switch"
        />
      </Field>

      {showPublishConfirm && (
        <ConfirmModal
          title={localization.informationModelForm.alert.confirmPublish}
          content={localization.informationModelForm.alert.confirmPublish}
          successButtonText={localization.button.publish}
          onSuccess={handleConfirmPublish}
          onCancel={() => setShowPublishConfirm(false)}
        />
      )}

      {showUnpublishConfirm && (
        <ConfirmModal
          title={localization.informationModelForm.alert.confirmUnpublish}
          content={localization.informationModelForm.alert.confirmUnpublish}
          successButtonText={localization.button.unpublish}
          onSuccess={handleConfirmUnpublish}
          onCancel={() => setShowUnpublishConfirm(false)}
        />
      )}
    </>
  );
};

export default PublishSwitch;
