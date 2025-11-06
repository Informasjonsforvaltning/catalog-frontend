import { FastField, useFormikContext } from "formik";
import {
  ErrorMessage,
  Fieldset,
  Textfield,
} from "@digdir/designsystemet-react";
import styles from "./version-fieldset.module.scss";
import { Concept } from "@catalog-frontend/types";
import { TitleWithHelpTextAndTag } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { get } from "lodash";

export type VersionFieldsetProps = {
  name: string;
  changed?: string[];
  readOnly?: boolean;
};

export const VersionFieldset = ({
  name,
  changed,
  readOnly,
}: VersionFieldsetProps) => {
  const { errors } = useFormikContext<Concept>();

  return (
    <>
      <Fieldset
        size="sm"
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.versionNumber}
            changed={changed?.includes(name)}
          >
            {localization.conceptForm.fieldLabel.versionNumber}
          </TitleWithHelpTextAndTag>
        }
      >
        <div className={styles.versionFieldset}>
          <FastField
            as={Textfield}
            type="number"
            label="Major"
            min="0"
            size="sm"
            name={`${name}.major`}
            error={typeof get(errors, name) === "string"}
            readOnly={readOnly}
          />
          <FastField
            as={Textfield}
            type="number"
            label="Minor"
            min="0"
            size="sm"
            name={`${name}.minor`}
            error={typeof get(errors, name) === "string"}
            readOnly={readOnly}
          />
          <FastField
            as={Textfield}
            type="number"
            label="Patch"
            min="0"
            size="sm"
            name={`${name}.patch`}
            error={typeof get(errors, name) === "string"}
            readOnly={readOnly}
          />
        </div>
      </Fieldset>
      {typeof get(errors, name) === "string" ? (
        <ErrorMessage size="sm">{get(errors, name)}</ErrorMessage>
      ) : undefined}
    </>
  );
};
