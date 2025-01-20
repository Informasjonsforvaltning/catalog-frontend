import { DataService } from '@catalog-frontend/types';
import { AddButton, LabelWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield } from '@digdir/designsystemet-react';
import { FastField, FieldArray, useFormikContext } from 'formik';
import FieldsetWithDelete from '../../fieldset-with-delete';
import styles from './pages.module.css';

export const PagesSection = () => {
  const errors = useFormikContext<DataService>()?.errors;
  return (
    <>
      <FastField
        name='landingPage'
        as={Textfield}
        size='sm'
        label={
          <LabelWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.landingPage}
            helpAriaLabel={localization.dataServiceForm.fieldLabel.landingPage}
          >
            {localization.dataServiceForm.fieldLabel.landingPage}
          </LabelWithHelpTextAndTag>
        }
        error={errors?.landingPage}
      />

      <div>
        <FieldArray name='pages'>
          {(arrayHelpers) => (
            <>
              {arrayHelpers.form.values.pages &&
                arrayHelpers.form.values.pages.map((_, index: number) => (
                  <div
                    key={`pages-${index}`}
                    className={styles.padding}
                  >
                    <FieldsetWithDelete onDelete={() => arrayHelpers.remove(index)}>
                      <FastField
                        name={`pages[${index}]`}
                        label={
                          index < 1 ? (
                            <LabelWithHelpTextAndTag
                              helpAriaLabel={localization.dataServiceForm.fieldLabel.pages}
                              helpText={localization.dataServiceForm.helptext.pages}
                            >
                              {localization.dataServiceForm.fieldLabel.pages}
                            </LabelWithHelpTextAndTag>
                          ) : (
                            ''
                          )
                        }
                        as={Textfield}
                        size='sm'
                        error={errors?.pages?.[index]}
                      />
                    </FieldsetWithDelete>
                  </div>
                ))}

              <AddButton onClick={() => arrayHelpers.push('')}>
                {`${localization.dataServiceForm.fieldLabel.pages}`}
              </AddButton>
            </>
          )}
        </FieldArray>
      </div>
    </>
  );
};
