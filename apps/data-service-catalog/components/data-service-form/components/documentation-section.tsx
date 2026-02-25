import { DataService } from "@catalog-frontend/types";
import {
  AddButton,
  FastFieldWithRef,
  FieldsetDivider,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui-v2";
import { localization } from "@catalog-frontend/utils";
import { Fieldset, Textfield } from "@digdir/designsystemet-react";
import { FieldArray, useFormikContext } from "formik";
import FieldsetWithDelete from "../../fieldset-with-delete";
import styles from "../data-service-form.module.css";
import React, { useEffect, useState } from "react";

export const DocumentationSection = () => {
  const errors = useFormikContext<DataService>()?.errors;
  const [focus, setFocus] = useState<boolean | null>();
  const fieldRef = React.createRef<HTMLInputElement | HTMLTextAreaElement>();

  useEffect(() => {
    if (focus) {
      fieldRef?.current?.focus();
      setFocus(false);
    }
  }, [focus, fieldRef]);

  return (
    <div>
      <FastFieldWithRef
        name="landingPage"
        as={Textfield}
        data-size="sm"
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.landingPage}
          >
            {localization.dataServiceForm.fieldLabel.landingPage}
          </TitleWithHelpTextAndTag>
        }
        error={errors?.landingPage}
      />

      <FieldsetDivider />

      <Fieldset>
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.pages}
          >
            {localization.dataServiceForm.fieldLabel.pages}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <FieldArray name="pages">
          {(arrayHelpers) => (
            <>
              {arrayHelpers.form.values.pages &&
                arrayHelpers.form.values.pages.map((_, index: number) => (
                  <div key={`pages-${index}`} className={styles.padding}>
                    <FieldsetWithDelete
                      onDelete={() => arrayHelpers.remove(index)}
                    >
                      <FastFieldWithRef
                        name={`pages[${index}]`}
                        as={Textfield}
                        data-size="sm"
                        ref={fieldRef}
                        error={errors?.pages?.[index]}
                      />
                    </FieldsetWithDelete>
                  </div>
                ))}

              <AddButton
                onClick={() => {
                  setFocus(true);
                  arrayHelpers.push("");
                }}
              >
                {`${localization.dataServiceForm.fieldLabel.pages}`}
              </AddButton>
            </>
          )}
        </FieldArray>
      </Fieldset>
    </div>
  );
};
