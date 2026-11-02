import { DataService } from "@catalog-frontend/types";
import {
  ReferenceDataSuggestionSelect,
  TitleWithHelpTextAndTag,
  useSearchFileTypeByUri,
  useSearchFileTypes,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Fieldset } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { useState } from "react";

export const FormatSection = () => {
  const { setFieldValue, values } = useFormikContext<DataService>();
  const [searchQueryFileTypes, setSearchQueryFileTypes] = useState<string>("");

  const { data: fileTypes, isLoading: searchingFileTypes } =
    useSearchFileTypes(searchQueryFileTypes);

  const { data: selectedFileTypes, isLoading: loadingSelectedFileTypes } =
    useSearchFileTypeByUri(values?.formats ?? []);

  return (
    <div>
      <Fieldset>
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.dataServiceForm.helptext.format}
            tagTitle={localization.tag.recommended}
            tagColor="info"
          >
            {localization.dataServiceForm.fieldLabel.format}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <ReferenceDataSuggestionSelect
          onSearch={setSearchQueryFileTypes}
          onValueChange={(selectedValues) =>
            setFieldValue("formats", selectedValues)
          }
          selectedValuesSearchHits={selectedFileTypes ?? []}
          querySearchHits={fileTypes ?? []}
          formikValues={values?.formats ?? []}
          isFetching={loadingSelectedFileTypes || searchingFileTypes}
        />
      </Fieldset>
    </div>
  );
};
