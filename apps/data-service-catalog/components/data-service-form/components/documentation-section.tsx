import { DataService } from '@catalog-frontend/types';
import { AddButton, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Fieldset, Textfield } from '@digdir/designsystemet-react';
import { FastField, FieldArray, useFormikContext } from 'formik';
import FieldsetWithDelete from '../../fieldset-with-delete';
import styles from './documentation.module.css';

export const DocumentationSection = () => {
  const errors = useFormikContext<DataService>()?.errors;
  return (
    <>
      <FastField
        name='landingPage'
        as={Textfield}
        size='sm'
        label={
          <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.landingPage}>
            {localization.dataServiceForm.fieldLabel.landingPage}
          </TitleWithHelpTextAndTag>
        }
        error={errors?.landingPage}
      />

      <Fieldset
        size='sm'
        legend={
          <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.pages}>
            {localization.dataServiceForm.fieldLabel.pages}
          </TitleWithHelpTextAndTag>
        }
      >
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
      </Fieldset>
    </>
  );
};
