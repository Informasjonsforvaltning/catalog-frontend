import { DataService, ReferenceDataCode } from '@catalog-frontend/types';
import { AddButton, HelpMarkdown, LabelWithHelpTextAndTag, TitleWithTag } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Fieldset, Textfield } from '@digdir/designsystemet-react';
import { FastField, FieldArray, useFormikContext } from 'formik';
import FieldsetWithDelete from '../../fieldset-with-delete';
import styles from './details.module.css';

type Props = { availabilities?: ReferenceDataCode[] };

export const DetailsSection = ({ availabilities }: Props) => {
  const { values, setFieldValue, errors } = useFormikContext<DataService>();
  return (
    <>
      <Fieldset
        legend={
          <LabelWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.availability}
            helpAriaLabel={localization.dataServiceForm.fieldLabel.availability}
            tagColor={'info'}
            tagTitle={localization.tag.recommended}
          >
            {localization.dataServiceForm.fieldLabel.availability}
          </LabelWithHelpTextAndTag>
        }
      >
        <Combobox
          value={[values?.availability ?? '']}
          portal={false}
          onValueChange={(selectedValues) => setFieldValue('availability', selectedValues.toString())}
          size='sm'
        >
          <Combobox.Option value=''>{`${localization.dataServiceForm.noAvailability}`}</Combobox.Option>
          {availabilities &&
            availabilities.map((availabilityRef, i) => (
              <Combobox.Option
                key={`availability-${availabilityRef.uri}-${i}`}
                value={availabilityRef.uri}
              >
                {capitalizeFirstLetter(getTranslateText(availabilityRef.label)?.toString())}
              </Combobox.Option>
            ))}
        </Combobox>
      </Fieldset>

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

      <Fieldset
        size='sm'
        legend={
          <LabelWithHelpTextAndTag
            helpAriaLabel={localization.dataServiceForm.fieldLabel.pages}
            helpText={localization.dataServiceForm.helptext.pages}
          >
            {localization.dataServiceForm.fieldLabel.pages}
          </LabelWithHelpTextAndTag>
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
