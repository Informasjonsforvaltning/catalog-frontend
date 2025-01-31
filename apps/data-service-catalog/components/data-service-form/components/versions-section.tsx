import {
  AddButton,
  FormikLanguageFieldset,
  HelpMarkdown,
  LabelWithHelpTextAndTag,
  TitleWithTag
} from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import {Fieldset, HelpText, Paragraph, Textfield} from '@digdir/designsystemet-react';
import {FastField, FieldArray} from "formik";
import styles from "./endpoint.module.css";
import FieldsetWithDelete from "../../fieldset-with-delete";

export const VersionsSection = () => {
  return (
    <>
      <Fieldset
        size='sm'
        legend={
          <LabelWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.versions}
            helpAriaLabel={localization.dataServiceForm.fieldLabel.versions}
          >
            {localization.dataServiceForm.fieldLabel.versions}
          </LabelWithHelpTextAndTag>
        }
      >
        <FieldArray name='versions'>
          {(arrayHelpers) => (
            <>
              {arrayHelpers.form.values.versions &&
                arrayHelpers.form.values.versions.map((_, index: number) => (
                  <div
                    key={`versions-${index}`}
                    className={styles.padding}
                  >
                    <FieldsetWithDelete onDelete={() => arrayHelpers.remove(index)}>
                      <FastField
                        name={`versions[${index}]`}
                        as={Textfield}
                        size='sm'
                      />
                    </FieldsetWithDelete>
                  </div>
                ))}

              <AddButton onClick={() => arrayHelpers.push('')}>
                {`${localization.dataServiceForm.fieldLabel.versions}`}
              </AddButton>
            </>
          )}
        </FieldArray>
      </Fieldset>
    </>
  );
};
