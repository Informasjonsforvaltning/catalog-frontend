'use client';

import { AddButton, FormikLanguageFieldset, TitleWithHelpTextAndTag, TextareaWithPrefix } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Fieldset, Textfield } from '@digdir/designsystemet-react';
import { FastField, FieldArray, useFormikContext } from 'formik';
import { Dataset, ReferenceDataCode } from '@catalog-frontend/types';
import styles from './details.module.css';
import { QualifiedAttributionsSection } from '../qualified-attributions-section';
import FieldsetWithDelete from '../../../fieldset-with-delete';
import { ToggleFieldButton } from '../toggle-field-button';
import { UriWithLabelFieldsetTable } from '../uri-with-label-field-set-table';
import { useMemo } from 'react';
import _ from 'lodash';

type Props = {
  datasetTypes: ReferenceDataCode[];
  provenanceStatements: ReferenceDataCode[];
  frequencies: ReferenceDataCode[];
};

export const HiddenDetailFields = ({ datasetTypes, provenanceStatements, frequencies }: Props) => {
  const { setFieldValue, errors, values } = useFormikContext<Dataset>();

  const datasetTypeOptions = useMemo(
    () =>
      datasetTypes.map((type) => (
        <Combobox.Option
          value={type.uri}
          key={type.uri}
          description={`${localization.code}: ${type.code}`}
        >
          {getTranslateText(type?.label)}
        </Combobox.Option>
      )),
    [datasetTypes],
  );

  const provenanceOptions = useMemo(
    () =>
      provenanceStatements.map((item) => (
        <Combobox.Option
          value={item.uri}
          key={item.uri}
        >
          {getTranslateText(item.label)}
        </Combobox.Option>
      )),
    [provenanceStatements],
  );

  const frequencyOptions = useMemo(
    () =>
      frequencies.map((item) => (
        <Combobox.Option
          value={item.uri}
          key={item.uri}
        >
          {capitalizeFirstLetter(getTranslateText(item.label).toString())}
        </Combobox.Option>
      )),
    [frequencies],
  );

  return (
    <div>
      <div>
        <FieldArray name='landingPage'>
          {(arrayHelpers) => (
            <>
              {(arrayHelpers.form.values.landingPage || []).map((_: any, index: number) => (
                <div
                  key={`landingPage-${index}`}
                  className={styles.padding}
                >
                  <FieldsetWithDelete onDelete={() => arrayHelpers.remove(index)}>
                    <FastField
                      name={`landingPage[${index}]`}
                      label={
                        index === 0 ? (
                          <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.landingPage}>
                            {localization.datasetForm.fieldLabel.landingPage}
                          </TitleWithHelpTextAndTag>
                        ) : (
                          ''
                        )
                      }
                      as={Textfield}
                      size='sm'
                      error={errors?.landingPage?.[index]}
                    />
                  </FieldsetWithDelete>
                </div>
              ))}

              <AddButton onClick={() => arrayHelpers.push('')}>
                {`${localization.datasetForm.fieldLabel.landingPage}`}
              </AddButton>
            </>
          )}
        </FieldArray>
      </div>

      <ToggleFieldButton
        fieldName={'type'}
        hasDeleteButton
        fieldValues={values?.type}
      >
        <Fieldset
          size='sm'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.type}>
              {localization.datasetForm.fieldLabel.type}
            </TitleWithHelpTextAndTag>
          }
        >
          <FastField
            as={Combobox}
            size='sm'
            value={[values.type]}
            virtual
            placeholder={`${localization.search.search}...`}
            onValueChange={(value: string[]) => setFieldValue('type', value.toString())}
          >
            <Combobox.Option value={''}>{`${localization.choose}...`}</Combobox.Option>
            {datasetTypeOptions}
          </FastField>
        </Fieldset>
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='provenance.uri'
        hasDeleteButton
        fieldValues={values?.provenance?.uri}
      >
        <Fieldset
          size='sm'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.provenance}>
              {localization.datasetForm.fieldLabel.provenance}
            </TitleWithHelpTextAndTag>
          }
        >
          <Combobox
            value={values?.provenance?.uri ? [values?.provenance?.uri] : []}
            placeholder={`${localization.search.search}...`}
            onValueChange={(value: string[]) => setFieldValue('provenance.uri', value.toString())}
            size='sm'
          >
            <Combobox.Empty>{`${localization.choose}...`}</Combobox.Empty>
            {provenanceOptions}
          </Combobox>
        </Fieldset>
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='accrualPeriodicity.uri'
        fieldValues={values?.accrualPeriodicity?.uri}
        hasDeleteButton
      >
        <Fieldset
          size='sm'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.accrualPeriodicity}>
              {localization.datasetForm.fieldLabel.accrualPeriodicity}
            </TitleWithHelpTextAndTag>
          }
        >
          <Combobox
            size='sm'
            value={[values?.accrualPeriodicity?.uri ?? '']}
            virtual
            placeholder={`${localization.search.search}...`}
            onValueChange={(value: string[]) => setFieldValue('accrualPeriodicity.uri', value.toString())}
          >
            <Combobox.Option value=''>{`${localization.choose}...`}</Combobox.Option>
            {frequencyOptions}
          </Combobox>
        </Fieldset>
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='modified'
        fieldValues={values?.modified}
        hasDeleteButton
      >
        <FastField
          className={styles.calendar}
          as={Textfield}
          name='modified'
          type='date'
          label={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.modified}>
              {localization.datasetForm.fieldLabel.modified}
            </TitleWithHelpTextAndTag>
          }
          size='sm'
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='hasCurrentnessAnnotation.hasBody'
        fieldValues={values?.hasCurrentnessAnnotation?.hasBody}
        addValue={{ nb: '' }}
      >
        <FormikLanguageFieldset
          as={TextareaWithPrefix}
          name='hasCurrentnessAnnotation.hasBody'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.hasCurrentnessAnnotation}>
              {localization.datasetForm.fieldLabel.hasCurrentnessAnnotation}
            </TitleWithHelpTextAndTag>
          }
        />
      </ToggleFieldButton>

      <UriWithLabelFieldsetTable
        values={values.conformsTo}
        fieldName={'conformsTo'}
        label={
          !_.isEmpty(values.conformsTo) &&
          _.some(values.conformsTo, (item) => !_.isUndefined(item)) && (
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.conformsTo}>
              {localization.datasetForm.fieldLabel.conformsTo}
            </TitleWithHelpTextAndTag>
          )
        }
      />

      <ToggleFieldButton
        fieldName='hasRelevanceAnnotation.hasBody'
        fieldValues={values?.hasRelevanceAnnotation?.hasBody}
        addValue={{ nb: '' }}
      >
        <FormikLanguageFieldset
          as={TextareaWithPrefix}
          name='hasRelevanceAnnotation.hasBody'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.hasRelevanceAnnotation}>
              {localization.datasetForm.fieldLabel.hasRelevanceAnnotation}
            </TitleWithHelpTextAndTag>
          }
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='hasCompletenessAnnotation.hasBody'
        fieldValues={values?.hasCompletenessAnnotation?.hasBody}
        addValue={{ nb: '' }}
      >
        <FormikLanguageFieldset
          as={TextareaWithPrefix}
          name='hasCompletenessAnnotation.hasBody'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.hasCompletenessAnnotation}>
              {localization.datasetForm.fieldLabel.hasCompletenessAnnotation}
            </TitleWithHelpTextAndTag>
          }
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='hasAccuracyAnnotation.hasBody'
        fieldValues={values?.hasAccuracyAnnotation?.hasBody}
        addValue={{ nb: '' }}
      >
        <FormikLanguageFieldset
          as={TextareaWithPrefix}
          name='hasAccuracyAnnotation.hasBody'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.hasAccuracyAnnotation}>
              {localization.datasetForm.fieldLabel.hasAccuracyAnnotation}
            </TitleWithHelpTextAndTag>
          }
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='hasAvailabilityAnnotation.hasBody'
        fieldValues={values?.hasAvailabilityAnnotation?.hasBody}
        addValue={{ nb: '' }}
      >
        <FormikLanguageFieldset
          as={TextareaWithPrefix}
          name='hasAvailabilityAnnotation.hasBody'
          legend={
            <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.hasAvailabilityAnnotation}>
              {localization.datasetForm.fieldLabel.hasAvailabilityAnnotation}
            </TitleWithHelpTextAndTag>
          }
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName={'qualifiedAttributions'}
        fieldValues={values?.qualifiedAttributions}
        hasDeleteButton
        addValue={[]}
      >
        <QualifiedAttributionsSection />
      </ToggleFieldButton>
    </div>
  );
};
