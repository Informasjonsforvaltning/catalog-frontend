"use client";
import { useEffect, useState } from "react";
import { localization } from "@catalog-frontend/utils";
import { Field, Input, Label } from "@digdir/designsystemet-react";
import { ConfirmModal } from "@catalog-frontend/ui";
import {
  publishInformationModel,
  unpublishInformationModel,
} from "../../app/actions/actions";
import { InformationModel } from "@catalog-frontend/types";
import { useRouter } from "next/navigation";

type Props = {
  catalogId: string;
  informationModel: InformationModel;
  disabled: boolean;
  onPublishedChange?: (published: boolean) => void;
};

export const PublishSwitch = ({
  catalogId,
  informationModel,
  disabled,
  onPublishedChange,
}: Props) => {
  const router = useRouter();
  const [published, setPublished] = useState(informationModel.published);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);

  useEffect(() => {
    setPublished(informationModel.published);
  }, [informationModel.published]);

  const handlePublishInformationModel = async () => {
    if (!published) {
      setShowPublishConfirm(true);
    }

    if (published) {
      setShowUnpublishConfirm(true);
    }
  };

  const handleConfirmPublish = async () => {
    try {
      await publishInformationModel(catalogId, informationModel.id);
      setPublished(true);
      onPublishedChange?.(true);
      setShowPublishConfirm(false);
      router.refresh();
    } catch (error) {
      window.alert(error);
    }
  };

  const handleConfirmUnpublish = async () => {
    try {
      await unpublishInformationModel(catalogId, informationModel.id);
      setPublished(false);
      onPublishedChange?.(false);
      setShowUnpublishConfirm(false);
      router.refresh();
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
          {published
            ? localization.publicationState.published
            : localization.publicationState.unpublished}
        </Label>
        <Input
          type="checkbox"
          role="switch"
          onChange={() => handlePublishInformationModel()}
          checked={published}
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
