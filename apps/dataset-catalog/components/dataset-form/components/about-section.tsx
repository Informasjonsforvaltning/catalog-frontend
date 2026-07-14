"use client";

import {
  FieldsetDivider,
  FormikLanguageFieldset,
  SingleSuggestionSelect,
  TitleWithHelpTextAndTag,
  TextareaWithPrefix,
  SpatialCombobox,
  useSuggestionMounted,
} from "@catalog-frontend/ui";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Textfield, Fieldset, Paragraph } from "@digdir/designsystemet-react";
import { FastField, useFormikContext } from "formik";
import { useMemo } from "react";
import { AccessRightFields } from "./access-rights-fields";
import {
  ApplicationProfile,
  Dataset,
  ReferenceDataCode,
} from "@catalog-frontend/types";

interface Props {
  referenceDataEnv: string;
  isMobility?: boolean;
  frequencies?: ReferenceDataCode[];
}

export const AboutSection = ({
  referenceDataEnv,
  isMobility,
  frequencies,
}: Props) => {
  const { setFieldValue, errors, values } = useFormikContext<Dataset>();
  const isMounted = useSuggestionMounted();

  const frequencyOptions = useMemo(
    () =>
      frequencies?.map((frequency) => ({
        value: frequency.uri,
        label: capitalizeFirstLetter(getTranslateText(frequency.label)),
      })) ?? [],
    [frequencies],
  );

  return (
    <div>
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={
              values?.applicationProfile === ApplicationProfile.MOBILITYDCATAP
                ? localization.datasetForm.helptext
                    .applicationProfileMobilityDcat
                : localization.datasetForm.helptext.applicationProfileDcat
            }
          >
            {localization.tag.applicationProfile}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <Paragraph data-size="sm">
          {values?.applicationProfile === ApplicationProfile.MOBILITYDCATAP
            ? localization.tag.mobilityDcatAp
            : localization.tag.dcatApNo}
        </Paragraph>
      </Fieldset>
      <FieldsetDivider />
      <FormikLanguageFieldset
        name="title"
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
        name="description"
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
      {isMobility && (
        <>
          <Fieldset data-size="sm">
            <Fieldset.Legend>
              <TitleWithHelpTextAndTag
                tagColor={isMobility ? undefined : "info"}
                tagTitle={
                  isMobility
                    ? localization.tag.required
                    : localization.tag.recommended
                }
                helpText={localization.datasetForm.helptext.spatial}
              >
                {localization.datasetForm.fieldLabel.spatial}
              </TitleWithHelpTextAndTag>
            </Fieldset.Legend>
            <SpatialCombobox referenceDataEnv={referenceDataEnv} />
          </Fieldset>
          <FieldsetDivider />
          <SingleSuggestionSelect
            ariaLabel={localization.datasetForm.fieldLabel.frequency}
            emptyMessage={localization.search.noHits}
            error={errors.frequency}
            fieldsetLegend={
              <TitleWithHelpTextAndTag
                helpText={localization.datasetForm.helptext.frequency}
                tagTitle={localization.tag.required}
              >
                {localization.datasetForm.fieldLabel.frequency}
              </TitleWithHelpTextAndTag>
            }
            isMounted={isMounted}
            onValueChange={(value) => setFieldValue("frequency", value)}
            options={frequencyOptions}
            placeholder={`${localization.search.search}...`}
            value={values.frequency}
          />
          <FieldsetDivider />
        </>
      )}
      <AccessRightFields isMobility={isMobility} />
      <FieldsetDivider />
      <FastField
        style={{ width: "fit-content" }}
        as={Textfield}
        data-size="sm"
        type="date"
        name="issued"
        label={
          <TitleWithHelpTextAndTag
            tagTitle={localization.tag.recommended}
            helpText={localization.datasetForm.helptext.issued}
            tagColor="info"
          >
            {localization.datasetForm.fieldLabel.issued}
          </TitleWithHelpTextAndTag>
        }
      />
    </div>
  );
};
