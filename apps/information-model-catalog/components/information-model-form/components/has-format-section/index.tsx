"use client";

import {
  InformationModel,
  ModelDocument,
  StorageData,
} from "@catalog-frontend/types";
import {
  DataStorage,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Table } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import {
  DeleteButton,
  TitleWithHelpTextAndTag,
  useSearchFileTypeByUri,
  useSearchLanguageByUri,
} from "@catalog-frontend/ui";
import { useMemo } from "react";
import { modelDocumentTemplate } from "../../utils/information-model-initial-values";
import { get } from "lodash";
import styles from "../../information-model-form.module.css";
import { HasFormatSecondaryValues } from "../../../../utils/has-format-secondary";
import { HasFormatFieldModal } from "./has-format-modal";
import { resolveLabel } from "./has-format-helpers";

type Props = {
  referenceDataEnv: string;
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
};

export const HasFormatSection = ({
  referenceDataEnv,
  autoSaveId,
  autoSaveStorage,
}: Props) => {
  const { values, errors, setFieldValue } =
    useFormikContext<InformationModel>();

  const documentsWithIndex = useMemo(
    () =>
      (values.hasFormat ?? [])
        .map((document, index) => ({ document, index }))
        .filter((entry): entry is { document: ModelDocument; index: number } =>
          Boolean(entry.document),
        ),
    [values.hasFormat],
  );

  const languageUris = useMemo(
    () =>
      documentsWithIndex
        .map(({ document }) => document.language)
        .filter((uri): uri is string => Boolean(uri)),
    [documentsWithIndex],
  );

  const formatUris = useMemo(
    () =>
      documentsWithIndex
        .map(({ document }) => document.format)
        .filter((uri): uri is string => Boolean(uri)),
    [documentsWithIndex],
  );

  const { data: selectedLanguages } = useSearchLanguageByUri(
    languageUris,
    referenceDataEnv,
  );
  const { data: selectedFormats } = useSearchFileTypeByUri(
    formatUris,
    referenceDataEnv,
  );

  const setHasFormatSecondary = (payload: HasFormatSecondaryValues) => {
    if (autoSaveStorage && autoSaveId) {
      autoSaveStorage.setSecondary("hasFormat", {
        id: autoSaveId,
        values: payload,
        lastChanged: new Date().toISOString(),
      });
    }
  };

  const handleDocumentChange = (
    updatedDocument: ModelDocument,
    index: number,
  ) => {
    setHasFormatSecondary({
      document: updatedDocument,
      index,
    });
  };

  const handleDocumentCancel = () => {
    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary("hasFormat");
    }
  };

  const handleDocumentSuccess = (
    updatedDocument: ModelDocument,
    index: number,
  ) => {
    setFieldValue(`hasFormat[${index}]`, updatedDocument);

    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary("hasFormat");
    }
  };

  return (
    <div className={styles.fieldContainer}>
      <TitleWithHelpTextAndTag
        helpText={localization.informationModelForm.helptext.hasFormat}
      >
        {localization.informationModelForm.fieldLabel.hasFormat}
      </TitleWithHelpTextAndTag>
      {documentsWithIndex.length > 0 && (
        <div
          className={get(errors, "hasFormat") ? styles.errorBorder : undefined}
        >
          <Table data-size="sm" className={styles.table}>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>
                  {localization.informationModelForm.fieldLabel.hasFormatTitle}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {
                    localization.informationModelForm.fieldLabel
                      .hasFormatLanguage
                  }
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {localization.informationModelForm.fieldLabel.hasFormatFormat}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {
                    localization.informationModelForm.fieldLabel
                      .hasFormatSeeAlso
                  }
                </Table.HeaderCell>
                <Table.HeaderCell aria-label={localization.button.actions} />
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {documentsWithIndex.map(({ document, index }) => (
                <Table.Row
                  key={`${document?.seeAlso ?? ""}-${document?.format ?? ""}-${index}`}
                >
                  <Table.Cell>
                    {getTranslateText(document?.title) || "—"}
                  </Table.Cell>
                  <Table.Cell>
                    {resolveLabel(document?.language, selectedLanguages) || "—"}
                  </Table.Cell>
                  <Table.Cell>
                    {resolveLabel(document?.format, selectedFormats) || "—"}
                  </Table.Cell>
                  <Table.Cell className={styles.urlCell}>
                    {document?.seeAlso ? (
                      <span className={styles.urlLink} title={document.seeAlso}>
                        {document.seeAlso}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className={styles.set}>
                      <HasFormatFieldModal
                        referenceDataEnv={referenceDataEnv}
                        template={document}
                        type="edit"
                        onSuccess={(updatedItem: ModelDocument) => {
                          handleDocumentSuccess(updatedItem, index);
                        }}
                        onCancel={handleDocumentCancel}
                        onChange={(updatedItem: ModelDocument) =>
                          handleDocumentChange(updatedItem, index)
                        }
                      />
                      <DeleteButton
                        onClick={() => {
                          const newArray = [...(values.hasFormat ?? [])];
                          newArray.splice(index, 1);
                          setFieldValue("hasFormat", newArray);
                        }}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
      <div>
        <HasFormatFieldModal
          referenceDataEnv={referenceDataEnv}
          template={modelDocumentTemplate()}
          type="new"
          onSuccess={(updatedItem: ModelDocument) => {
            const newIndex = values.hasFormat?.length ?? 0;
            setFieldValue(`hasFormat[${newIndex}]`, updatedItem);
            if (autoSaveStorage) {
              autoSaveStorage.deleteSecondary("hasFormat");
            }
          }}
          onCancel={handleDocumentCancel}
          onChange={(updatedItem: ModelDocument) => {
            const newIndex = values.hasFormat?.length ?? 0;
            setHasFormatSecondary({
              document: updatedItem,
              index: newIndex,
            });
          }}
        />
      </div>
    </div>
  );
};
