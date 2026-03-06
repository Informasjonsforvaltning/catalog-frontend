import { Dataset } from "@catalog-frontend/types";
import { FieldsetDivider, TitleWithHelpTextAndTag } from "@catalog-frontend/ui";
import {
  accessRights,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Box, Radio } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { UriWithLabelFieldsetTable } from "./uri-with-label-field-set-table";

interface Props {
  isMobility?: boolean;
}

export const AccessRightFields = ({ isMobility: isMobility }: Props) => {
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();

  return (
    <>
      <Box>
        <Radio.Group
          size="sm"
          legend={
            <TitleWithHelpTextAndTag
              helpText={localization.datasetForm.helptext.accessRights}
              tagColor="info"
              tagTitle={localization.tag.recommended}
            >
              {localization.access}
            </TitleWithHelpTextAndTag>
          }
          value={values?.accessRight || "none"}
          onChange={(values) => setFieldValue("accessRight", values.toString())}
        >
          <Radio value="none">{`${localization.accessRight.none}`}</Radio>
          {accessRights?.map((option, index) => (
            <Radio key={`${option.uri}-${index}`} value={option.uri}>
              {getTranslateText(option.label)}
            </Radio>
          ))}
        </Radio.Group>
      </Box>

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
