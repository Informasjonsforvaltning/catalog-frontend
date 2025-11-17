import { DataService } from '@catalog-frontend/types';
import { AddButton, FastFieldWithRef, FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Box, Fieldset, Textfield } from '@digdir/designsystemet-react';
import { FastField, FieldArray, useFormikContext } from 'formik';
import FieldsetWithDelete from '../../fieldset-with-delete';
import styles from '../data-service-form.module.css';
import React, { useEffect, useState } from 'react';

export const EndpointSection = () => {
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
    <Box>
      <FastField
        name='endpointUrl'
        as={Textfield}
        data-size='sm'
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
        data-size='sm'
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
                      <FastFieldWithRef
                        name={`endpointDescriptions[${index}]`}
                        as={Textfield}
                        ref={fieldRef}
                        data-size='sm'
                        error={errors?.endpointDescriptions?.[index]}
                      />
                    </FieldsetWithDelete>
                  </div>
                ))}

              <AddButton
                onClick={() => {
                  setFocus(true);
                  arrayHelpers.push('');
                }}
              >
                {`${localization.dataServiceForm.fieldLabel.endpointDescriptions}`}
              </AddButton>
            </>
          )}
        </FieldArray>
      </Fieldset>
    </Box>
  );
};
