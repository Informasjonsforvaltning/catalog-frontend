import { FastField, useFormikContext } from "formik";
import {
  ValidationMessage,
  Fieldset,
  Textfield,
} from "@digdir/designsystemet-react";
import styles from "./version-fieldset.module.scss";
import { Concept } from "@catalog-frontend/types";
import { TitleWithHelpTextAndTag } from "@catalog-frontend/ui-v2";
import { localization } from "@catalog-frontend/utils";
import { get } from "lodash";

export type VersionFieldsetProps = {
  name: string;
  changed?: string[];
  readOnly?: boolean;
};

export const VersionFieldset = ({ name, changed, readOnly }) => {
  const { errors } = useFormikContext<Concept>();

  return (
    <>
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.versionNumber}
            changed={changed?.includes(name)}
          >
            {localization.conceptForm.fieldLabel.versionNumber}
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
