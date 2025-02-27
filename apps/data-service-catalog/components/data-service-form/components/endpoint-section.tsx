import { DataService } from '@catalog-frontend/types';
import { AddButton, FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Box, Fieldset, Textfield } from '@digdir/designsystemet-react';
import { FastField, FieldArray, useFormikContext } from 'formik';
import FieldsetWithDelete from '../../fieldset-with-delete';
import styles from '../data-service-form.module.css';

export const EndpointSection = () => {
  const errors = useFormikContext<DataService>()?.errors;
  return (
    <Box>
      <FastField
        name='endpointUrl'
        as={Textfield}
        size='sm'
        label={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.dataServiceForm.helptext.endpoint}
          >
            {localization.dataServiceForm.fieldLabel.endpoint}
          </TitleWithHelpTextAndTag>
        }
        error={errors?.endpointUrl}
      />

      <FieldsetDivider />

      <Fieldset
        size='sm'
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor='info'
            helpText={localization.dataServiceForm.helptext.endpointDescriptions}
          >
            {localization.dataServiceForm.fieldLabel.endpointDescriptions}
          </TitleWithHelpTextAndTag>
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
    </Box>
  );
};
