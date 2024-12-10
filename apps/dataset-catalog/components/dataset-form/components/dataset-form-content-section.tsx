'use client';
import { Dataset } from '@catalog-frontend/types';
import { FormikLanguageFieldset, TextareaWithPrefix } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { useFormikContext } from 'formik';
import { UriWithLabelFieldsetTable } from './uri-with-label-field-set-table';

export const ContentSection = () => {
  const { values } = useFormikContext<Dataset>();
  return (
    <>
      <div>
        <UriWithLabelFieldsetTable
          values={values.conformsTo}
          fieldName={'conformsTo'}
        />
      </div>

      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name='hasRelevanceAnnotation.hasBody.nb'
        legend={localization.datasetForm.heading.relevance}
        requiredLanguages={['nb']}
      />

      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name='hasCompletenessAnnotation.hasBody'
        legend={localization.datasetForm.heading.completeness}
        requiredLanguages={['nb']}
      />

      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name='hasCompletenessAnnotation.hasBody.'
        legend={localization.datasetForm.heading.accuracy}
        requiredLanguages={['nb']}
      />

      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name='hasAvailabilityAnnotation.hasBody'
        legend={localization.datasetForm.heading.availability}
        requiredLanguages={['nb']}
      />
    </>
  );
};
