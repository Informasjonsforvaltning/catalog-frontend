import { FormikLanguageFieldset, TitleWithHelpTextAndTag, TextareaWithPrefix, FastFieldWithRef } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Box, Textfield, Fieldset, Combobox } from '@digdir/designsystemet-react';
import { FastField, useFormikContext } from 'formik';
import { FieldsetDivider } from '@catalog-frontend/ui';
import { AccessRightFields } from './access-rights-fields';
import { SpacialCombobox } from './spatial-combobox';
import { TemporalModal } from './details-section/temporal-modal';
import { Dataset, ReferenceData, ReferenceDataCode } from '@catalog-frontend/types';
import { useMemo } from 'react';

interface Props {
  referenceDataEnv: string;
  isMobility?: boolean;
  frequencies?: ReferenceDataCode[];
}

export const AboutSection = ({
  referenceDataEnv,
  isMobility,
  frequencies
}: Props) => {
  const { setFieldValue, errors, values } = useFormikContext<Dataset>();

  return (
    <Box>
      <FormikLanguageFieldset
        name={'title'}
        as={Textfield}
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.required}
            helpText={localization.datasetForm.helptext.title}
          >
            {localization.title}
          </TitleWithHelpTextAndTag>
        }
      />
      <FieldsetDivider />
      <FormikLanguageFieldset
        name='description'
        as={TextareaWithPrefix}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.description}
            tagTitle={localization.tag.required}
          >
            {localization.description}
          </TitleWithHelpTextAndTag>
        }
      />
      <FieldsetDivider />
      { isMobility && <>
        <SpacialCombobox 
          referenceDataEnv={referenceDataEnv}
          isMobility={isMobility}
        />
        <Fieldset
          size='sm'
          legend={
            <TitleWithHelpTextAndTag
              helpText={localization.datasetForm.helptext.frequency}
              tagTitle={localization.tag.required}
            >
              {localization.datasetForm.fieldLabel.frequency}
            </TitleWithHelpTextAndTag>
          }>
            <Combobox
              value={values?.frequency? [values.frequency] : ['']}
              portal={false}
              onValueChange={(selectedValues) => {
                setFieldValue('frequency', selectedValues.toString());
              }}
              size='sm'
              virtual
              error={errors.frequency}
            >
              <Combobox.Option
                key={`frequency`}
                value={''}
              >
                {localization.none}
              </Combobox.Option>
              {frequencies &&
                frequencies.map((frequency: any, i: number) => (
                  <Combobox.Option
                    key={`frequency-${frequency.uri}-${i}`}
                    value={frequency.uri}
                  >
                    {capitalizeFirstLetter(getTranslateText(frequency.label).toString())}
                  </Combobox.Option>
                ))}
            </Combobox>
          </Fieldset>
        <FieldsetDivider />
      </>}
      <AccessRightFields isMobility= {isMobility}/>
      <FieldsetDivider />
      <FastField
        style={{ width: 'fit-content' }}
        as={Textfield}
        size='sm'
        type='date'
        name='issued'
        label={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            helpText={localization.datasetForm.helptext.issued}
            tagColor='info'
          >
            {localization.datasetForm.fieldLabel.issued}
          </TitleWithHelpTextAndTag>
        }
      />
    </Box>
  );
};
