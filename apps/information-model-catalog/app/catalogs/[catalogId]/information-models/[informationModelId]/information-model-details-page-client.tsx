"use client";

import { InformationModel, ReferenceDataCode } from "@catalog-frontend/types";
import {
  ConfirmModal,
  DeleteButton,
  DetailsPageLayout,
  LinkButton,
  ProductStatusTagProps,
  Tag,
} from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import React, { useEffect, useState } from "react";
import { deleteInformationModel } from "../../../../actions/actions";
import styles from "./information-model-details-page.module.css";
import { LeftColumn } from "../../../../../components/details-page-columns/details-page-left-column";
import { RightColumn } from "../../../../../components/details-page-columns/details-page-right-column";
import { useRouter } from "next/navigation";

interface InformationModelDetailsPageProps {
  informationModel: InformationModel;
  catalogId: string;
  informationModelId: string;
  hasWritePermission: boolean;
  statuses: ReferenceDataCode[];
}

const InformationModelDetailsPageClient = ({
  informationModel,
  catalogId,
  informationModelId,
  hasWritePermission,
  statuses,
}: InformationModelDetailsPageProps) => {
  const [language, setLanguage] = useState("nb");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentInformationModel, setCurrentInformationModel] =
    useState(informationModel);
  const router = useRouter();

  useEffect(() => {
    setCurrentInformationModel(informationModel);
  }, [informationModel]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (currentInformationModel) {
      try {
        await deleteInformationModel(catalogId, currentInformationModel.id);
        router.replace(`/catalogs/${catalogId}/information-models`);
      } catch (error) {
        window.alert(
          error instanceof Error
            ? error.message
            : localization.alert.deleteFailed,
        );
        setShowDeleteConfirm(false);
      }
    }
  };

  const handlePublishedChange = (published: boolean) => {
    setCurrentInformationModel((prev) => ({ ...prev, published }));
  };

  const status = statuses.find(
    (item) => item.uri === currentInformationModel.status,
  );

  return (
    <>
      {showDeleteConfirm && (
        <ConfirmModal
          title={localization.informationModelForm.alert.confirmDeleteTitle}
          content={localization.informationModelForm.alert.confirmDelete}
          successButtonText={localization.button.delete}
          onSuccess={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
      <DetailsPageLayout
        handleLanguageChange={handleLanguageChange}
        language={language}
        headingTitle={getTranslateText(
          currentInformationModel?.title,
          language,
        )}
        headingTag={
          status?.code &&
          status?.label && (
            <Tag.ProductStatus
              statusKey={status.code as ProductStatusTagProps["statusKey"]}
              statusLabel={getTranslateText(status.label)}
            />
          )
        }
        data-testid="information-model-details-page"
      >
        <DetailsPageLayout.Buttons>
          {hasWritePermission && (
            <div
              className={styles.set}
              data-testid="information-model-action-buttons"
            >
              <LinkButton
                href={`/catalogs/${catalogId}/information-models/${informationModelId}/edit`}
                data-testid="edit-information-model-button"
              >
                {localization.button.edit}
              </LinkButton>

              <DeleteButton
                disabled={currentInformationModel.published}
                variant="secondary"
                onClick={handleDeleteClick}
                data-testid="delete-information-model-button"
              />
            </div>
          )}
        </DetailsPageLayout.Buttons>
        <DetailsPageLayout.Left>
          <LeftColumn
            informationModel={currentInformationModel}
            language={language}
          />
        </DetailsPageLayout.Left>
        <DetailsPageLayout.Right>
          <RightColumn
            informationModel={currentInformationModel}
            language={language}
            hasWritePermission={hasWritePermission}
            onPublishedChange={handlePublishedChange}
          />
        </DetailsPageLayout.Right>
      </DetailsPageLayout>
    </>
  );
};

export default InformationModelDetailsPageClient;
