"use client";
import {
  FieldsetDivider,
  SpatialCombobox,
  LanguageSuggestion,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Fieldset } from "@digdir/designsystemet-react";
import { TemporalModal } from "./temporal-modal";

interface Props {
  referenceDataEnv: string;
  isMobility?: boolean;
}

export const RecommendedDetailFields = ({
  referenceDataEnv,
  isMobility,
}: Props) => {
  return (
    <>
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            tagColor="info"
            tagTitle={localization.tag.recommended}
            helpText={localization.datasetForm.helptext.language}
          >
            {localization.datasetForm.fieldLabel.language}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <LanguageSuggestion referenceDataEnv={referenceDataEnv} />
      </Fieldset>

      <FieldsetDivider />
      {!isMobility && (
        <>
          <Fieldset data-size="sm">
            <Fieldset.Legend>
              <TitleWithHelpTextAndTag
                tagTitle={localization.tag.recommended}
                tagColor="info"
                helpText={localization.datasetForm.helptext.spatial}
              >
                {localization.datasetForm.fieldLabel.spatial}
              </TitleWithHelpTextAndTag>
            </Fieldset.Legend>
            <SpatialCombobox referenceDataEnv={referenceDataEnv} />
          </Fieldset>
          <FieldsetDivider />
        </>
      )}
      <TemporalModal
        label={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            tagColor="info"
            helpText={localization.datasetForm.helptext.temporal}
          >
            {localization.datasetForm.fieldLabel.temporal}
          </TitleWithHelpTextAndTag>
        }
      />
      <FieldsetDivider />
    </>
  );
};
