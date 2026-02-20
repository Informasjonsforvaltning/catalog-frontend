import { Dataset } from "@catalog-frontend/types";
import {
  FieldsetDivider,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui-v2";
import {
  accessRights,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Fieldset, Radio, useRadioGroup } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { UriWithLabelFieldsetTable } from "./uri-with-label-field-set-table";

interface Props {
  isMobility?: boolean;
}

export const AccessRightFields = ({ isMobility: isMobility }: Props) => {
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();

  const { getRadioProps } = useRadioGroup({
    value: values.accessRight,
    onChange: (value) => setFieldValue("accessRight", value),
    error: errors.accessRight,
  });

  return (
    <>
      <div>
        <Fieldset data-size="sm">
          <Fieldset.Legend>
            <TitleWithHelpTextAndTag
              helpText={localization.datasetForm.helptext.accessRights}
              tagColor="info"
              tagTitle={localization.tag.recommended}
            >
              {localization.access}
            </TitleWithHelpTextAndTag>
          </Fieldset.Legend>
          <Radio
            label={`${localization.accessRight.none}`}
            {...getRadioProps({ value: undefined })}
          />
          {accessRights?.map((option) => (
            <Radio
              label={getTranslateText(option.label)}
              key={option.uri}
              {...getRadioProps({ value: option.uri })}
            />
          ))}
        </Fieldset>
      </div>

      {!isMobility && (
        <div>
          <FieldsetDivider />
          <UriWithLabelFieldsetTable
            fieldName="legalBasisForRestriction"
            errors={errors.legalBasisForRestriction}
            hideHeadWhenEmpty={true}
            label={
              <TitleWithHelpTextAndTag
                helpText={
                  localization.datasetForm.helptext.legalBasisForRestriction
                }
                tagTitle={localization.tag.recommended}
                tagColor="info"
              >
                {localization.datasetForm.fieldLabel.legalBasisForRestriction}
              </TitleWithHelpTextAndTag>
            }
          />

          <FieldsetDivider />

          <UriWithLabelFieldsetTable
            fieldName="legalBasisForProcessing"
            errors={errors.legalBasisForProcessing}
            hideHeadWhenEmpty={true}
            label={
              <TitleWithHelpTextAndTag
                helpText={
                  localization.datasetForm.helptext.legalBasisForProcessing
                }
                tagTitle={localization.tag.recommended}
                tagColor="info"
              >
                {localization.datasetForm.fieldLabel.legalBasisForProcessing}
              </TitleWithHelpTextAndTag>
            }
          />

          <FieldsetDivider />

          <UriWithLabelFieldsetTable
            fieldName="legalBasisForAccess"
            errors={errors.legalBasisForAccess}
            hideHeadWhenEmpty={true}
            label={
              <TitleWithHelpTextAndTag
                helpText={localization.datasetForm.helptext.legalBasisForAccess}
                tagTitle={localization.tag.recommended}
                tagColor="info"
              >
                {localization.datasetForm.fieldLabel.legalBasisForAccess}
              </TitleWithHelpTextAndTag>
            }
          />
        </div>
      )}
    </>
  );
};
