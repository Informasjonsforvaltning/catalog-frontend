import { DataService } from '@catalog-frontend/types';
import { AddButton, LabelWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Textfield } from '@digdir/designsystemet-react';
import { FastField, FieldArray, useFormikContext } from 'formik';
import FieldsetWithDelete from '../../fieldset-with-delete';
import styles from './endpoint.module.css';

export const EndpointSection = () => {
  const errors = useFormikContext<DataService>()?.errors;
  return (
    <>
      <FastField
        name='endpointUrl'
        as={Textfield}
        size='sm'
        label={
          <LabelWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.dataServiceForm.helptext.endpoint}
            helpAriaLabel={localization.dataServiceForm.fieldLabel.endpoint}
          >
            {localization.dataServiceForm.fieldLabel.endpoint}
          </LabelWithHelpTextAndTag>
        }
        error={errors?.endpointUrl}
      />

      <div>
        <FieldArray name='endpointDescriptions'>
          {(arrayHelpers) => (
            <>
              {arrayHelpers.form.values.endpointDescriptions &&
                arrayHelpers.form.values.endpointDescriptions.map((_, index: number) => (
                  <div
                    key={`endpointDescriptions-${index}`}
                    className={styles.padding}
                  >
                    <FieldsetWithDelete onDelete={() => arrayHelpers.remove(index)}>
                      <FastField
                        name={`endpointDescriptions[${index}]`}
                        label={
                          index < 1 ? (
                            <LabelWithHelpTextAndTag
                              helpAriaLabel={localization.dataServiceForm.fieldLabel.endpointDescriptions}
                              helpText={localization.dataServiceForm.helptext.endpointDescriptions}
                            >
                              {localization.dataServiceForm.fieldLabel.endpointDescriptions}
                            </LabelWithHelpTextAndTag>
                          ) : (
                            ''
                          )
                        }
                        as={Textfield}
                        size='sm'
                        error={errors?.endpointDescriptions?.[index]}
                      />
                    </FieldsetWithDelete>
                  </div>
                ))}

              <AddButton onClick={() => arrayHelpers.push('')}>
                {`${localization.dataServiceForm.fieldLabel.endpointDescriptions}`}
              </AddButton>
            </>
          )}
        </FieldArray>
      </div>
    </>
  );
};
