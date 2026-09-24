"use client";

import { ApplicableLegislation, StorageData } from "@catalog-frontend/types";
import { DeleteButton, TitleWithHelpTextAndTag } from "@catalog-frontend/ui";
import { Fieldset, Table } from "@digdir/designsystemet-react";
import {
  DataStorage,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { useFormikContext } from "formik";
import { ApplicableLegislationModal } from "./applicable-legislation-modal";
import styles from "../../dataset-form.module.css";

type ApplicableLegislationFormValues = {
  applicableLegislations?: ApplicableLegislation[];
};

export type ApplicableLegislationTableProps = {
  autoSaveStorage?: DataStorage<StorageData>;
};

export const ApplicableLegislationTable = ({
  autoSaveStorage,
}: ApplicableLegislationTableProps) => {
  const { values, setFieldValue } =
    useFormikContext<ApplicableLegislationFormValues>();

  const handleApplicableLegislationSuccess = (
    updatedRef: ApplicableLegislation,
    i: number,
  ) => {
    setFieldValue(`applicableLegislations[${i}]`, updatedRef);

    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary("applicableLegislation");
    }
  };

  const handleApplicableLegislationCancel = () => {
    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary("applicableLegislation");
    }
  };

  return (
    <div>
      <Fieldset>
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.applicableLegislation.helptext}
            tagColor="info"
            tagTitle={localization.tag.recommended}
          >
            {localization.applicableLegislation.fieldLabel}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        {values?.applicableLegislations &&
          values.applicableLegislations.length > 0 && (
            <div>
              <Table data-size="sm" className={styles.table}>
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>
                      {localization.applicableLegislation.title}
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      {localization.applicableLegislation.description}
                    </Table.HeaderCell>
                    <Table.HeaderCell aria-label="Actions" />
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {values?.applicableLegislations &&
                    values.applicableLegislations.map(
                      (applicableLegislation, i) => (
                        <Table.Row key={`applicable-legislation-${i}`}>
                          <Table.Cell>
                            {getTranslateText(applicableLegislation?.title)}
                          </Table.Cell>
                          <Table.Cell>
                            {getTranslateText(
                              applicableLegislation?.description,
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <div>
                              <ApplicableLegislationModal
                                template={applicableLegislation}
                                type="edit"
                                onSuccess={(updatedItem) =>
                                  handleApplicableLegislationSuccess(
                                    updatedItem,
                                    i,
                                  )
                                }
                                onCancel={handleApplicableLegislationCancel}
                              />
                              <DeleteButton
                                onClick={() => {
                                  const newArray = [
                                    ...(values.applicableLegislations ?? []),
                                  ];
                                  newArray.splice(i, 1);
                                  setFieldValue(
                                    "applicableLegislations",
                                    newArray,
                                  );
                                }}
                              />
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ),
                    )}
                </Table.Body>
              </Table>
            </div>
          )}
        <ApplicableLegislationModal
          onSuccess={(formValues) =>
            setFieldValue(
              values.applicableLegislations &&
                values.applicableLegislations.length > 0
                ? `applicableLegislations[${values.applicableLegislations.length}]`
                : "applicableLegislations[0]",
              formValues,
            )
          }
          onCancel={handleApplicableLegislationCancel}
          type="new"
          template={{ title: {}, description: {} }}
        />
      </Fieldset>
    </div>
  );
};
