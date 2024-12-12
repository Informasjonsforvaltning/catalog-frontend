'use client';

import { AddButton, FormikLanguageFieldset, TextareaWithPrefix } from '@catalog-frontend/ui';
import { capitalizeFirstLetter, getTranslateText, localization } from '@catalog-frontend/utils';
import { Combobox, Textfield } from '@digdir/designsystemet-react';
import { Field, FieldArray, useFormikContext } from 'formik';
import { Dataset, ReferenceDataCode } from '@catalog-frontend/types';
import styles from './details.module.css';
import { QualifiedAttributionsSection } from '../dataset-form-qualified-attributions-section';
import FieldsetWithDelete from '../../../fieldset-with-delete';
import { ToggleFieldButton } from '../toggle-field-button';
import { UriWithLabelFieldsetTable } from '../uri-with-label-field-set-table';

type Props = {
  datasetTypes: ReferenceDataCode[];
  provenanceStatements: ReferenceDataCode[];
  frequencies: ReferenceDataCode[];
};

export const HiddenDetailFields = ({ datasetTypes, provenanceStatements, frequencies }: Props) => {
  const { setFieldValue, errors, values } = useFormikContext<Dataset>();

  return (
    <>
      <div>
        <FieldArray name='landingPage'>
          {(arrayHelpers) => (
            <>
              {arrayHelpers.form.values.landingPage &&
                arrayHelpers.form.values.landingPage.map((_: string, index: number) => (
                  <div
                    key={`landingPage-${index}`}
                    className={styles.padding}
                  >
                    <FieldsetWithDelete onDelete={() => arrayHelpers.remove(index)}>
                      <Field
                        name={`landingPage[${index}]`}
                        label={localization.datasetForm.heading.landingPage}
                        as={Textfield}
                        size='sm'
                        error={errors?.landingPage?.[index]}
                      />
                    </FieldsetWithDelete>
                  </div>
                ))}

              <AddButton onClick={() => arrayHelpers.push('')}>
                {`${localization.datasetForm.heading.landingPage}`}
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
        <Field
          as={Combobox}
          size='sm'
          value={[values.type]}
          virtual
          label={localization.datasetForm.fieldLabel.type}
          placeholder={`${localization.search.search}...`}
          onValueChange={(value: string[]) => setFieldValue('type', value.toString())}
        >
          <Combobox.Option value={''}>{`${localization.choose}...`}</Combobox.Option>
          {datasetTypes.map((type) => (
            <Combobox.Option
              value={type.uri}
              key={type.uri}
              description={`${localization.code}: ${type.code}`}
            >
              {getTranslateText(type?.label)}
            </Combobox.Option>
          ))}
        </Field>
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='provenance.uri'
        hasDeleteButton
        fieldValues={values?.provenance?.uri}
      >
        <Combobox
          value={values?.provenance?.uri ? [values?.provenance?.uri] : []}
          placeholder={`${localization.search.search}...`}
          onValueChange={(value: string[]) => setFieldValue('provenance.uri', value.toString())}
          label={localization.datasetForm.heading.provenance}
          size='sm'
        >
          <Combobox.Empty>{`${localization.choose}...`}</Combobox.Empty>
          {provenanceStatements.map((item) => (
            <Combobox.Option
              value={item.uri}
              key={item.uri}
            >
              {getTranslateText(item.label)}
            </Combobox.Option>
          ))}
        </Combobox>
      </ToggleFieldButton>
      <ToggleFieldButton
        fieldName='accrualPeriodicity.uri'
        fieldValues={values?.accrualPeriodicity?.uri}
        hasDeleteButton
      >
        <Combobox
          size='sm'
          value={[values?.accrualPeriodicity?.uri ?? '']}
          virtual
          placeholder={`${localization.search.search}...`}
          onValueChange={(value: string[]) => setFieldValue('accrualPeriodicity.uri', value.toString())}
          label={localization.datasetForm.heading.frequency}
        >
          <Combobox.Option value=''>{`${localization.choose}...`}</Combobox.Option>
          {frequencies.map((item) => (
            <Combobox.Option
              value={item.uri}
              key={item.uri}
            >
              {capitalizeFirstLetter(getTranslateText(item.label).toString())}
            </Combobox.Option>
          ))}
        </Combobox>
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='modified'
        fieldValues={values?.modified}
        hasDeleteButton
      >
        <Field
          as={Textfield}
          name='modified'
          type='date'
          label={localization.datasetForm.heading.lastUpdated}
          size='sm'
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='hasCurrentnessAnnotation.hasBody'
        fieldValues={values?.hasCurrentnessAnnotation?.hasBody}
      >
        <FormikLanguageFieldset
          as={TextareaWithPrefix}
          name='hasCurrentnessAnnotation.hasBody'
          legend={localization.datasetForm.heading.actuality}
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName={'conformsTo'}
        fieldValues={values?.conformsTo}
      >
        <UriWithLabelFieldsetTable
          values={values.conformsTo}
          fieldName={'conformsTo'}
          showLabel={false}
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='hasRelevanceAnnotation.hasBody'
        fieldValues={values?.hasRelevanceAnnotation?.hasBody}
      >
        <FormikLanguageFieldset
          as={TextareaWithPrefix}
          name='hasRelevanceAnnotation.hasBody'
          legend={localization.datasetForm.heading.relevance}
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='hasCompletenessAnnotation.hasBody'
        fieldValues={values?.hasCompletenessAnnotation?.hasBody}
      >
        <FormikLanguageFieldset
          as={TextareaWithPrefix}
          name='hasCompletenessAnnotation.hasBody'
          legend={localization.datasetForm.heading.completeness}
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='hasAccuracyAnnotation.hasBody'
        fieldValues={values?.hasAccuracyAnnotation?.hasBody}
      >
        <FormikLanguageFieldset
          as={TextareaWithPrefix}
          name='hasAccuracyAnnotation.hasBody'
          legend={localization.datasetForm.heading.accuracy}
        />
      </ToggleFieldButton>

      <ToggleFieldButton
        fieldName='hasAvailabilityAnnotation.hasBody'
        fieldValues={values?.hasAvailabilityAnnotation?.hasBody}
      >
        <FormikLanguageFieldset
          as={TextareaWithPrefix}
          name='hasAvailabilityAnnotation.hasBody'
          legend={localization.datasetForm.heading.availability}
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
    </>
  );
};
