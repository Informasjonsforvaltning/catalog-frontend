"use client";

import { useFormikContext } from "formik";
import {
  Alert,
  Button,
  Heading,
  Paragraph,
} from "@digdir/designsystemet-react";
import { Code, Concept } from "@catalog-frontend/types";
import {
  FormikLanguageFieldset,
  FormikMultivalueTextfield,
  MultiSuggestionSelect,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import styles from "../concept-form.module.scss";
import { getParentPath } from "../../../utils/codeList";
import { ReactNode, useMemo } from "react";
import { isEmpty } from "lodash";

type SubjectSectionProps = {
  codes: Code[] | undefined;
  changed?: string[];
  readOnly?: boolean;
};

const getCodeLabel = (code: Code) => getTranslateText(code.name);

export const SubjectSection = ({
  codes,
  changed,
  readOnly,
}: SubjectSectionProps) => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();

  const selected = values.fagområdeKoder?.filter((v) =>
    codes?.find((code) => code.id === v),
  );
  const codeListActivated = codes !== undefined;

  const subjectCodeOptions = useMemo(
    () =>
      codes?.map((code) => {
        const parentPath = getParentPath(code, codes);
        const description =
          parentPath.length > 0
            ? `Overordnet: ${parentPath.join(" - ")}`
            : undefined;

        return {
          value: code.id,
          label: getCodeLabel(code),
          description,
        };
      }) ?? [],
    [codes],
  );

  const ConflictAlert = () => {
    if (!codeListActivated && !isEmpty(values.fagområdeKoder)) {
      return (
        <Alert data-size="sm" data-color="warning">
          <Heading level={3} data-size="2xs">
            {localization.conceptForm.alert.warning}
          </Heading>
          <Paragraph data-size="sm">
            {localization.conceptForm.alert.codeListToText}
          </Paragraph>
          <div className={styles.topMargin2}>
            <Button
              data-size="sm"
              variant="secondary"
              disabled={readOnly}
              onClick={() => setFieldValue("fagområdeKoder", [])}
            >
              Slett koder
            </Button>
          </div>
        </Alert>
      );
    }

    if (codeListActivated && !isEmpty(values.fagområde)) {
      return (
        <Alert data-size="sm" data-color="warning">
          <Heading level={3} data-size="2xs">
            {localization.conceptForm.alert.warning}
          </Heading>
          <Paragraph data-size="sm">
            {localization.conceptForm.alert.textToCodeList}
          </Paragraph>
          <div className={styles.topMargin2}>
            <Button
              data-size="sm"
              variant="secondary"
              disabled={readOnly}
              onClick={() => setFieldValue("fagområde", null)}
            >
              Slett fritekst verdier
            </Button>
          </div>
        </Alert>
      );
    }
    return null;
  };

  const Fields = () => {
    const fields: ReactNode[] = [];

    if (!codeListActivated || !isEmpty(values.fagområde)) {
      fields.push(
        <FormikLanguageFieldset
          key="fagområde"
          name="fagområde"
          multiple
          readOnly={codeListActivated || readOnly}
          showError={!codeListActivated}
          legend={
            <TitleWithHelpTextAndTag
              {...(!codeListActivated
                ? {
                    tagTitle: localization.tag.recommended,
                    tagColor: "info",
                  }
                : {})}
              helpText={localization.conceptForm.helpText.subjectFree}
              changed={changed?.includes("fagområde")}
            >
              {localization.conceptForm.fieldLabel.subjectFree}
            </TitleWithHelpTextAndTag>
          }
        />,
      );
    }

    const codeListLabel = (
      <TitleWithHelpTextAndTag
        {...(codeListActivated
          ? {
              tagTitle: localization.tag.recommended,
              tagColor: "info",
            }
          : {})}
        helpText={localization.conceptForm.helpText.subjectCodeList}
        changed={changed?.includes("fagområdeKoder")}
      >
        {localization.conceptForm.fieldLabel.subjectCodeList}
      </TitleWithHelpTextAndTag>
    );

    if (codeListActivated) {
      fields.push(
        <MultiSuggestionSelect
          key="fagområdeKoder"
          ariaLabel={localization.conceptForm.fieldLabel.subjectCodeList}
          emptyMessage={localization.search.noHits}
          error={
            typeof errors.fagområdeKoder === "string"
              ? errors.fagområdeKoder
              : undefined
          }
          fieldsetLegend={codeListLabel}
          onSelectedChange={(selectedValues) =>
            setFieldValue("fagområdeKoder", selectedValues)
          }
          options={subjectCodeOptions}
          readOnly={!codeListActivated || readOnly}
          selectedValues={selected}
        />,
      );
    } else if (!isEmpty(values.fagområdeKoder)) {
      fields.push(
        <FormikMultivalueTextfield
          key="fagområdeKoder"
          name="fagområdeKoder"
          label={codeListLabel}
          readOnly
        />,
      );
    }

    return codeListActivated ? fields : fields.reverse();
  };

  return (
    <div>
      <div className={styles.fieldSet}>
        <ConflictAlert />
        <Fields />
      </div>
    </div>
  );
};
