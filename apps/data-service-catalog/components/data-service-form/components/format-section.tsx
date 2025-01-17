import { DataService } from '@catalog-frontend/types';
import { FormikSearchCombobox, LabelWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Fieldset } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import {
  useSearchFileTypeByUri,
  useSearchFileTypes,
  useSearchMediaTypeByUri,
  useSearchMediaTypes,
} from '../../../hooks/useReferenceDataSearch';

type Props = {
  referenceDataEnv: string;
};

export const FormatSection = ({ referenceDataEnv }: Props) => {
  const { setFieldValue, values } = useFormikContext<DataService>();
  const [searchQueryMediaTypes, setSearchQueryMediaTypes] = useState<string>('');
  const [searchQueryFileTypes, setSearchQueryFileTypes] = useState<string>('');

  const { data: mediaTypes, isLoading: searchingMediaTypes } = useSearchMediaTypes(
    searchQueryMediaTypes,
    referenceDataEnv,
  );

  const { data: selectedMediaTypes, isLoading: loadingSelectedMediaTypes } = useSearchMediaTypeByUri(
    values?.mediaTypes ?? [],
    referenceDataEnv,
  );

  const { data: fileTypes, isLoading: searchingFileTypes } = useSearchFileTypes(searchQueryFileTypes, referenceDataEnv);

  const { data: selectedFileTypes, isLoading: loadingSelectedFileTypes } = useSearchFileTypeByUri(
    values?.formats ?? [],
    referenceDataEnv,
  );

  return (
    <>
      <Fieldset
        legend={
          <LabelWithHelpTextAndTag
            helpAriaLabel={localization.dataServiceForm.fieldLabel.fileTypes}
            helpText={localization.dataServiceForm.helptext.fileTypes}
            tagTitle={localization.tag.recommended}
            tagColor='info'
          >
            {localization.dataServiceForm.fieldLabel.fileTypes}
          </LabelWithHelpTextAndTag>
        }
      >
        <FormikSearchCombobox
          onChange={(event) => setSearchQueryFileTypes(event.target.value)}
          onValueChange={(selectedValues) => setFieldValue('formats', selectedValues)}
          value={values?.formats || []}
          selectedValuesSearchHits={selectedFileTypes ?? []}
          querySearchHits={fileTypes ?? []}
          formikValues={values?.formats ?? []}
          loading={loadingSelectedFileTypes || searchingFileTypes}
          portal={false}
        />
      </Fieldset>
      <Fieldset
        legend={
          <LabelWithHelpTextAndTag
            helpAriaLabel={localization.dataServiceForm.fieldLabel.mediaTypes}
            helpText={localization.dataServiceForm.helptext.mediaTypes}
          >
            {localization.dataServiceForm.fieldLabel.mediaTypes}
          </LabelWithHelpTextAndTag>
        }
      >
        <FormikSearchCombobox
          onChange={(event) => setSearchQueryMediaTypes(event.target.value)}
          onValueChange={(selectedValues) => setFieldValue('mediaTypes', selectedValues)}
          value={values?.mediaTypes || []}
          selectedValuesSearchHits={selectedMediaTypes ?? []}
          querySearchHits={mediaTypes ?? []}
          formikValues={values?.mediaTypes ?? []}
          loading={loadingSelectedMediaTypes || searchingMediaTypes}
          portal={false}
          virtual={true}
        />
      </Fieldset>
    </>
  );
};
