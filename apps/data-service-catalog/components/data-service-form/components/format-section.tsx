import { DataService } from '@catalog-frontend/types';
import { FormikReferenceDataCombobox, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Fieldset } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useSearchFileTypeByUri, useSearchFileTypes } from '../../../hooks/useReferenceDataSearch';

type Props = {
  referenceDataEnv: string;
};

export const FormatSection = ({ referenceDataEnv }: Props) => {
  const { setFieldValue, values } = useFormikContext<DataService>();
  const [searchQueryFileTypes, setSearchQueryFileTypes] = useState<string>('');

  const { data: fileTypes, isLoading: searchingFileTypes } = useSearchFileTypes(searchQueryFileTypes, referenceDataEnv);

  const { data: selectedFileTypes, isLoading: loadingSelectedFileTypes } = useSearchFileTypeByUri(
    values?.formats ?? [],
    referenceDataEnv,
  );

  return (
    <div>
      <Fieldset
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.format}
            tagTitle={localization.tag.recommended}
            tagColor='info'
          >
            {localization.dataServiceForm.fieldLabel.format}
          </TitleWithHelpTextAndTag>
        }
        data-size='sm'
      >
        <FormikReferenceDataCombobox
          onChange={(event) => setSearchQueryFileTypes(event.target.value)}
          onValueChange={(selectedValues) => setFieldValue('formats', selectedValues)}
          value={values?.formats || []}
          selectedValuesSearchHits={selectedFileTypes ?? []}
          querySearchHits={fileTypes ?? []}
          formikValues={values?.formats ?? []}
          loading={loadingSelectedFileTypes || searchingFileTypes}
          hideClearButton
          portal={false}
        />
      </Fieldset>
    </div>
  );
};
