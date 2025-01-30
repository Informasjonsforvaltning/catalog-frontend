import { DataService } from '@catalog-frontend/types';
import { AddButton, HelpMarkdown, LabelWithHelpTextAndTag, TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Fieldset, Textfield } from '@digdir/designsystemet-react';
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

      <Fieldset
        size='sm'
        legend={
          <TitleWithTag
            title={
              <>
                {localization.dataServiceForm.fieldLabel.endpointDescriptions}
                <HelpMarkdown
                  title={localization.dataServiceForm.fieldLabel.endpointDescriptions}
                  type='button'
                  size='sm'
                >
                  {localization.dataServiceForm.helptext.endpointDescriptions}
                </HelpMarkdown>
              </>
            }
            tagColor='info'
            tagTitle={localization.tag.recommended}
          />
        }
      >
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
      </Fieldset>
    </>
  );
};
