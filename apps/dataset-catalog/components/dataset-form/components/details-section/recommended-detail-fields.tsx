"use client";
import {
  FieldsetDivider,
  SpatialCombobox,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui-v2";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { Checkbox, Fieldset } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { Dataset, ReferenceDataCode } from "@catalog-frontend/types";
import { sortBy } from "lodash";
import { TemporalDialog } from "./temporal-modal";

interface Props {
  referenceDataEnv: string;
  languages: ReferenceDataCode[];
  isMobility?: boolean;
}

export const RecommendedDetailFields = ({
  referenceDataEnv,
  languages,
  isMobility,
}: Props) => {
  const { values, setFieldValue } = useFormikContext<Dataset>();
  const langNOR = languages.filter((lang) => lang.code === "NOR")[0];

  const customLanguageOrder = [
    "http://publications.europa.eu/resource/authority/language/NOB",
    "http://publications.europa.eu/resource/authority/language/NNO",
    "http://publications.europa.eu/resource/authority/language/ENG",
    "http://publications.europa.eu/resource/authority/language/SMI",
  ];

  const sortedLanguages = sortBy(languages, (item) => {
    return customLanguageOrder.indexOf(item.uri);
  });

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
        {values.language &&
          values.language.some((lang) => lang.includes("NOR")) && (
            <Checkbox
              key={langNOR.uri}
              value={langNOR.uri}
              label={getTranslateText(langNOR.label)}
              onChange={(values) => setFieldValue("language", values)}
            />
          )}
        {sortedLanguages
          .filter((lang) => lang.code !== "NOR")
          .map((lang) => (
            <Checkbox
              key={lang.uri}
              value={lang.uri}
              label={getTranslateText(lang.label)}
              onChange={(values) => setFieldValue("language", values)}
            />
          ))}
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
      <TemporalDialog
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
