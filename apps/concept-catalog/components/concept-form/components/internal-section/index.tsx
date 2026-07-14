"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { FastField, FormikErrors, useFormikContext } from "formik";
import {
  Checkbox,
  EXPERIMENTAL_Suggestion as Suggestion,
  Fieldset,
  Input,
  Textfield,
} from "@digdir/designsystemet-react";
import {
  AssignedUser,
  Code,
  CodeList,
  Concept,
  InternalField,
} from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import {
  FormikMultivalueTextfield,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import styles from "../../concept-form.module.scss";
import { getParentPath } from "../../../../utils/codeList";

export type InternalSectionProps = {
  internalFields: InternalField[];
  userList: AssignedUser[];
  codeLists: CodeList[];
  readOnly?: boolean;
  changed?: string[];
};

type SuggestionOption = {
  value: string;
  label: string;
  description?: string;
};

type SingleSuggestionSelectProps = {
  ariaLabel: string;
  fieldsetLegend: ReactNode;
  isMounted: boolean;
  onValueChange: (value: string | undefined) => void;
  options: SuggestionOption[];
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
};

const SingleSuggestionSelect = ({
  ariaLabel,
  fieldsetLegend,
  isMounted,
  onValueChange,
  options,
  placeholder,
  readOnly,
  value,
}: SingleSuggestionSelectProps) => {
  const selectedItem = value
    ? (options.find((option) => option.value === value) ?? {
        value,
        label: value,
      })
    : null;

  return (
    <Fieldset data-size="sm">
      <Fieldset.Legend>{fieldsetLegend}</Fieldset.Legend>
      {isMounted ? (
        <Suggestion
          data-size="sm"
          selected={selectedItem}
          onSelectedChange={(selected) => onValueChange(selected?.value)}
        >
          <Suggestion.Input
            aria-label={ariaLabel}
            placeholder={placeholder}
            readOnly={readOnly}
          />
          <Suggestion.List>
            <Suggestion.Empty>Fant ingen treff</Suggestion.Empty>
            {options.map((option) => (
              <Suggestion.Option
                key={option.value}
                value={option.value}
                label={option.label}
              >
                {option.description ? (
                  <div>
                    <div>{option.label}</div>
                    <div>{option.description}</div>
                  </div>
                ) : (
                  option.label
                )}
              </Suggestion.Option>
            ))}
          </Suggestion.List>
        </Suggestion>
      ) : (
        <Input
          data-size="sm"
          aria-label={ariaLabel}
          disabled
          placeholder={placeholder}
          readOnly
        />
      )}
    </Fieldset>
  );
};

const getCodeOption = (code: Code, codes: Code[]): SuggestionOption => {
  const parentPath = getParentPath(code, codes);
  const description =
    parentPath.length > 0 ? `Overordnet: ${parentPath.join(" - ")}` : undefined;

  return {
    value: code.id,
    label: getTranslateText(code.name),
    description,
  };
};

export const InternalSection = ({
  internalFields,
  userList,
  codeLists,
  readOnly = false,
  changed,
}: InternalSectionProps) => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const userOptions: SuggestionOption[] = userList.map(
    ({ id, name: userName }) => ({
      value: id ?? "",
      label: userName ?? "",
    }),
  );

  const renderInternalField = ({
    values,
    setFieldValue,
    internalField,
    userList,
    codeLists,
  }: {
    values: Concept;
    setFieldValue: (
      field: string,
      value: unknown,
      validate?: boolean,
    ) => Promise<void | FormikErrors<Concept>>;
    internalField: InternalField;
    userList: AssignedUser[];
    codeLists: CodeList[];
  }) => {
    const name = `interneFelt[${internalField.id}].value`;
    const fieldValue = values.interneFelt?.[internalField.id]?.value;
    const fieldLabel = capitalizeFirstLetter(
      getTranslateText(internalField.label),
    );

    const FieldLabel = () => (
      <TitleWithHelpTextAndTag
        helpText={getTranslateText(internalField.description)}
        changed={changed?.includes(name)}
      >
        {fieldLabel}
      </TitleWithHelpTextAndTag>
    );

    if (internalField.type === "text_short") {
      return (
        <FastField
          name={name}
          data-size="sm"
          label={<FieldLabel />}
          as={Textfield}
          readOnly={readOnly}
        />
      );
    }

    if (internalField.type === "text_long") {
      return (
        <FastField
          name={name}
          data-size="sm"
          as={Textfield}
          multiline
          label={<FieldLabel />}
          rows={3}
          readOnly={readOnly}
        />
      );
    }

    if (internalField.type === "boolean") {
      return (
        <Fieldset data-size="sm">
          <Fieldset.Legend>
            <FieldLabel />
          </Fieldset.Legend>
          <Checkbox
            value={internalField.id}
            checked={fieldValue === "true"}
            onChange={(e) =>
              setFieldValue(name, e.target.checked ? "true" : "false")
            }
            aria-label={`${internalField.label}, ja eller nei`}
            readOnly={readOnly}
          />
        </Fieldset>
      );
    }

    if (internalField.type === "user_list") {
      const selectedValue =
        fieldValue && userList.find((user) => user.id === fieldValue)
          ? fieldValue
          : undefined;

      return (
        <SingleSuggestionSelect
          ariaLabel={fieldLabel}
          fieldsetLegend={<FieldLabel />}
          isMounted={isMounted}
          onValueChange={(value) => setFieldValue(name, value)}
          options={userOptions}
          placeholder="select user"
          readOnly={readOnly}
          value={selectedValue}
        />
      );
    }

    if (internalField.type === "code_list") {
      const codes = codeLists.find(
        (list) => list.id === internalField.codeListId,
      )?.codes;
      const codeOptions =
        codes?.map((code) => getCodeOption(code, codes)) ?? [];
      const selectedValue =
        fieldValue && codes?.find((code) => code.id === fieldValue)
          ? fieldValue
          : undefined;

      return (
        <SingleSuggestionSelect
          ariaLabel={fieldLabel}
          fieldsetLegend={<FieldLabel />}
          isMounted={isMounted}
          onValueChange={(value) => setFieldValue(name, value)}
          options={codeOptions}
          readOnly={readOnly}
          value={selectedValue}
        />
      );
    }

    return null;
  };

  const assignedUserLabel = localization.conceptForm.fieldLabel.assignedUser;
  const selectedAssignedUser =
    values.assignedUser &&
    userList.find((user) => user.id === values.assignedUser)
      ? values.assignedUser
      : undefined;

  return (
    <div className={styles.internalSection}>
      <SingleSuggestionSelect
        ariaLabel={assignedUserLabel}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.assignedUser}
            changed={changed?.includes("assignedUser")}
          >
            {assignedUserLabel}
          </TitleWithHelpTextAndTag>
        }
        isMounted={isMounted}
        onValueChange={(value) => setFieldValue("assignedUser", value)}
        options={userOptions}
        readOnly={readOnly}
        value={selectedAssignedUser}
      />

      <FastField
        as={Textfield}
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.abbreviation}
            changed={changed?.includes("abbreviatedLabel")}
          >
            {localization.conceptForm.fieldLabel.abbreviationLabel}
          </TitleWithHelpTextAndTag>
        }
        data-size="sm"
        name="abbreviatedLabel"
        error={errors?.["abbreviatedLabel"]}
        readOnly={readOnly}
      />

      <FormikMultivalueTextfield
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.labels}
            changed={changed?.includes("merkelapp")}
          >
            {localization.conceptForm.fieldLabel.labels}
          </TitleWithHelpTextAndTag>
        }
        name="merkelapp"
        error={errors?.["merkelapp"]}
        readOnly={readOnly}
      />

      {internalFields?.map((internalField) => (
        <div key={internalField.id}>
          {renderInternalField({
            internalField,
            values,
            setFieldValue,
            userList,
            codeLists,
          })}
        </div>
      ))}
    </div>
  );
};
