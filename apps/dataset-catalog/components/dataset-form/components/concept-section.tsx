"use client";
import { Fieldset } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import {
  ConceptCombobox,
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui-v2";

interface Props {
  searchEnv: string; // Environment variable to search service
}

export const ConceptSection = ({ searchEnv }: Props) => {
  return (
    <>
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor="info"
            helpText={localization.datasetForm.helptext.concepts}
          >
            {localization.datasetForm.fieldLabel.concepts}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <ConceptCombobox fieldLabel="concepts" searchEnv={searchEnv} />
      </Fieldset>

      <FormikLanguageFieldset
        multiple
        name="keywords"
        legend={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor="info"
            helpText={localization.datasetForm.helptext.keywords}
          >
            {localization.datasetForm.fieldLabel.keywords}
          </TitleWithHelpTextAndTag>
        }
      />
    </>
  );
};
