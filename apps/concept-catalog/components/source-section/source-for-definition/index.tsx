"use client";

import { FC } from "react";
import styles from "./source-for-definition.module.css";
import { Field } from "formik";
import { Textfield } from "@digdir/designsystemet-react";
import { TrashIcon } from "@navikt/aksel-icons";
import { localization } from "@catalog-frontend/utils";
import { Button } from "@catalog-frontend/ui";

interface Props {
  sourceTitleFieldName: string;
  sourceUriFieldName: string;
  readOnly?: boolean;
  deleteClickHandler: () => void;
  numColsInputField?: number;
}

export const SourceForDefinitionField: FC<Props> = ({
  sourceTitleFieldName,
  sourceUriFieldName,
  readOnly,
  deleteClickHandler,
  numColsInputField = 20,
}) => {
  return (
    <div>
      <div className={styles.row}>
        <Field
          name={sourceTitleFieldName}
          as={Textfield}
          label={"Tittel på kilde"}
          readOnly={readOnly}
          cols={numColsInputField}
          rows={1}
        />
        <Field
          name={sourceUriFieldName}
          as={Textfield}
          label={"Lenke til kilde"}
          readOnly={readOnly}
          cols={numColsInputField}
          rows={1}
        />
        {!readOnly && (
          <Button
            color="danger"
            variant="tertiary"
            onClick={deleteClickHandler}
          >
            <>
              <TrashIcon />
              {localization.formatString(localization.button.deleteWithFormat, {
                text: localization.concept.source.toLowerCase(),
              })}
            </>
          </Button>
        )}
      </div>
    </div>
  );
};
