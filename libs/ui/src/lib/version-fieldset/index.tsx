"use client";

import { ReactNode } from "react";
import { FastField, useFormikContext } from "formik";
import {
  ValidationMessage,
  Fieldset,
  Textfield,
} from "@digdir/designsystemet-react";
import { get } from "lodash";
import TitleWithHelpTextAndTag from "../title-with-help-text-and-tag";
import styles from "./version-fieldset.module.scss";

export type VersionFieldsetProps = {
  name: string;
  label: ReactNode;
  helpText?: string;
  changed?: boolean;
  readOnly?: boolean;
};

export const VersionFieldset = ({
  name,
  label,
  helpText,
  changed,
  readOnly,
}: VersionFieldsetProps) => {
  const { errors } = useFormikContext();

  return (
    <>
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag helpText={helpText} changed={changed}>
            {label}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <div className={styles.versionFieldset}>
          <FastField
            as={Textfield}
            type="number"
            label="Major"
            min="0"
            data-size="sm"
            name={`${name}.major`}
            error={typeof get(errors, name) === "string"}
            readOnly={readOnly}
          />
          <FastField
            as={Textfield}
            type="number"
            label="Minor"
            min="0"
            data-size="sm"
            name={`${name}.minor`}
            error={typeof get(errors, name) === "string"}
            readOnly={readOnly}
          />
          <FastField
            as={Textfield}
            type="number"
            label="Patch"
            min="0"
            data-size="sm"
            name={`${name}.patch`}
            error={typeof get(errors, name) === "string"}
            readOnly={readOnly}
          />
        </div>
      </Fieldset>
      {typeof get(errors, name) === "string" ? (
        <ValidationMessage data-size="sm">
          {get(errors, name)}
        </ValidationMessage>
      ) : undefined}
    </>
  );
};
