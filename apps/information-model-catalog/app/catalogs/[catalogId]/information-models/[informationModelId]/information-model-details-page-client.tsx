"use client";

import { InformationModel } from "@catalog-frontend/types";
import {
  ConfirmModal,
  DeleteButton,
  DetailsPageLayout,
  LinkButton,
} from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import React, { useState } from "react";
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
}

const InformationModelDetailsPageClient = ({
  informationModel,
  catalogId,
  informationModelId,
  hasWritePermission,
}: InformationModelDetailsPageProps) => {
  const [language, setLanguage] = useState("nb");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (informationModel) {
      try {
        await deleteInformationModel(catalogId, informationModel?.id);
        router.replace(`/catalogs/${catalogId}/information-models`);
      } catch (error) {
        console.error(error);
      }
    }
  };

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
        headingTitle={getTranslateText(informationModel?.title, language)}
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
                disabled={informationModel?.published}
                variant="secondary"
                onClick={handleDeleteClick}
                data-testid="delete-information-model-button"
              />
            </div>
          )}
        </DetailsPageLayout.Buttons>
        <DetailsPageLayout.Left>
          <LeftColumn informationModel={informationModel} language={language} />
        </DetailsPageLayout.Left>
        <DetailsPageLayout.Right>
          <RightColumn
            informationModel={informationModel}
            hasWritePermission={hasWritePermission}
          />
        </DetailsPageLayout.Right>
      </DetailsPageLayout>
    </>
  );
};

export default InformationModelDetailsPageClient;
