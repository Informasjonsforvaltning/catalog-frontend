"use client";

import {
  AddButton,
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
  TextareaWithPrefix,
  FastFieldWithRef,
  FieldsetDivider,
} from "@catalog-frontend/ui-v2";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Combobox, Fieldset, Textfield } from "@digdir/designsystemet-react";
import { Field, FieldArray, useFormikContext } from "formik";
import { Dataset, ReferenceDataCode } from "@catalog-frontend/types";
import styles from "./details.module.css";
import { QualifiedAttributionsSection } from "../qualified-attributions-section";
import FieldsetWithDelete from "../../../fieldset-with-delete";
import { ToggleFieldButton } from "../toggle-field-button";
import { UriWithLabelFieldsetTable } from "../uri-with-label-field-set-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { isArray, isEmpty, isNil, isObject } from "lodash";
import React from "react";

type Props = {
  datasetTypes: ReferenceDataCode[];
  provenanceStatements: ReferenceDataCode[];
  frequencies: ReferenceDataCode[];
  isMobility?: boolean;
};

const FIELD_CONFIG = [
  {
    name: "type",
    getValue: (values: Dataset) => values?.type,
    render: (props: any) => (
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.type}
          >
            {localization.datasetForm.fieldLabel.type}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <FastFieldWithRef
          as={Combobox}
          ref={props.ref}
          data-size="sm"
          value={[props.values.type]}
          virtual
          placeholder={`${localization.search.search}...`}
          onValueChange={(value: string[]) =>
            props.setFieldValue("type", value.toString())
          }
        >
          <Combobox.Option value="">{`${localization.choose}...`}</Combobox.Option>
          {props.datasetTypeOptions}
        </FastFieldWithRef>
      </Fieldset>
    ),
    hasDeleteButton: true,
  },
  {
    name: "provenance",
    getValue: (values: Dataset) => values?.provenance,
    render: (props: any) => (
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.provenance}
          >
            {localization.datasetForm.fieldLabel.provenance}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <FastFieldWithRef
          as={Combobox}
          ref={props.ref}
          value={props.values?.provenance ? [props.values?.provenance] : []}
          placeholder={`${localization.search.search}...`}
          onValueChange={(value: string[]) =>
            props.setFieldValue("provenance", value.toString())
          }
          data-size="sm"
        >
          <Combobox.Empty>{`${localization.choose}...`}</Combobox.Empty>
          {props.provenanceOptions}
        </FastFieldWithRef>
      </Fieldset>
    ),
    hasDeleteButton: true,
  },
  {
    name: "frequency",
    getValue: (values: Dataset) => values?.frequency,
    render: (props: any) => (
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.frequency}
          >
            {localization.datasetForm.fieldLabel.frequency}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <FastFieldWithRef
          data-size="sm"
          as={Combobox}
          ref={props.ref}
          value={[props.values?.frequency ?? ""]}
          virtual
          placeholder={`${localization.search.search}...`}
          onValueChange={(value: string[]) =>
            props.setFieldValue("frequency", value.toString())
          }
        >
          <Combobox.Option value="">{`${localization.choose}...`}</Combobox.Option>
          {props.frequencyOptions}
        </FastFieldWithRef>
      </Fieldset>
    ),
    hasDeleteButton: true,
  },
  {
    name: "modified",
    getValue: (values: Dataset) => values?.modified,
    render: (props: any) => (
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.modified}
          >
            {localization.datasetForm.fieldLabel.modified}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        <FastFieldWithRef
          className={styles.calendar}
          as={Textfield}
          ref={props.ref}
          name="modified"
          type="date"
          data-size="sm"
        />
      </Fieldset>
    ),
    hasDeleteButton: true,
  },
  {
    name: "currentness.hasBody",
    getValue: (values: Dataset) => values?.currentness?.hasBody,
    addValue: { nb: "", nn: "" },
    render: (props: any) => (
      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name="currentness.hasBody"
        ref={props.ref}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.currentness}
          >
            {localization.datasetForm.fieldLabel.currentness}
          </TitleWithHelpTextAndTag>
        }
      />
    ),
  },
  {
    name: "relevance.hasBody",
    getValue: (values: Dataset) => values?.relevance?.hasBody,
    addValue: { nb: "", nn: "" },
    render: (props: any) => (
      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name="relevance.hasBody"
        ref={props.ref}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.relevance}
          >
            {localization.datasetForm.fieldLabel.relevance}
          </TitleWithHelpTextAndTag>
        }
      />
    ),
  },
  {
    name: "completeness.hasBody",
    getValue: (values: Dataset) => values?.completeness?.hasBody,
    addValue: { nb: "", nn: "" },
    render: (props: any) => (
      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name="completeness.hasBody"
        ref={props.ref}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.completeness}
          >
            {localization.datasetForm.fieldLabel.completeness}
          </TitleWithHelpTextAndTag>
        }
      />
    ),
  },
  {
    name: "accuracy.hasBody",
    getValue: (values: Dataset) => values?.accuracy?.hasBody,
    addValue: { nb: "", nn: "" },
    render: (props: any) => (
      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name="accuracy.hasBody"
        ref={props.ref}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.accuracy}
          >
            {localization.datasetForm.fieldLabel.accuracy}
          </TitleWithHelpTextAndTag>
        }
      />
    ),
  },
  {
    name: "availability.hasBody",
    getValue: (values: Dataset) => values?.availability?.hasBody,
    addValue: { nb: "", nn: "" },
    render: (props: any) => (
      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name="availability.hasBody"
        ref={props.ref}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.availability}
          >
            {localization.datasetForm.fieldLabel.availability}
          </TitleWithHelpTextAndTag>
        }
      />
    ),
  },
  {
    name: "qualifiedAttributions",
    getValue: (values: Dataset) => values?.qualifiedAttributions,
    render: (props: any) => <QualifiedAttributionsSection ref={props.ref} />,
    hasDeleteButton: true,
    addValue: [],
  },
  {
    name: "landingPage",
    getValue: (values: Dataset) => values?.landingPage,
    render: (props: any) => (
      <FieldArray name="landingPage">
        {(arrayHelpers) => (
          <>
            {(arrayHelpers.form.values.landingPage || []).map(
              (_: any, index: number, array: string[]) => (
                <React.Fragment key={`landingPage-${index}`}>
                  <div className={styles.padding}>
                    <FieldsetWithDelete
                      onDelete={() => arrayHelpers.remove(index)}
                    >
                      <FastFieldWithRef
                        name={`landingPage[${index}]`}
                        ref={(
                          el: HTMLInputElement | HTMLTextAreaElement | null,
                        ) => props.setInputRef(`landingPage[${index}]`, el)}
                        label={
                          index === 0 ? (
                            <TitleWithHelpTextAndTag
                              helpText={
                                localization.datasetForm.helptext.landingPage
                              }
                            >
                              {localization.datasetForm.fieldLabel.landingPage}
                            </TitleWithHelpTextAndTag>
                          ) : (
                            ""
                          )
                        }
                        as={Textfield}
                        data-size="sm"
                        error={props.errors?.landingPage?.[index]}
                      />
                    </FieldsetWithDelete>
                  </div>
                </React.Fragment>
              ),
            )}
            <AddButton
              onClick={() => {
                arrayHelpers.push("");
                props.setFocus(
                  arrayHelpers.form.values.landingPage
                    ? `landingPage[${arrayHelpers.form.values.landingPage.length}]`
                    : "landingPage[0]",
                );
              }}
            >
              {`${localization.add} ${localization.datasetForm.fieldLabel.landingPage.toLowerCase()}`}
            </AddButton>
            {props.showDivider && <FieldsetDivider />}
          </>
        )}
      </FieldArray>
    ),
    hasDeleteButton: false,
    hideToggleButton: true,
  },
  {
    name: "conformsTo",
    getValue: (values: Dataset) => values?.conformsTo,
    render: (props: any) => (
      <UriWithLabelFieldsetTable
        fieldName="conformsTo"
        errors={props.errors.conformsTo}
        hideHeadWhenEmpty={true}
        showDivider={props.showDivider}
        label={
          !isEmpty(props.values.conformsTo) && (
            <TitleWithHelpTextAndTag
              helpText={localization.datasetForm.helptext.conformsTo}
            >
              {localization.datasetForm.fieldLabel.conformsTo}
            </TitleWithHelpTextAndTag>
          )
        }
      />
    ),
    hasDeleteButton: false,
    hideToggleButton: true,
  },
];

export const MinimizedDetailFields = ({
  datasetTypes,
  provenanceStatements,
  frequencies,
  isMobility,
}: Props) => {
  const { setFieldValue, errors, values } = useFormikContext<Dataset>();
  const [focus, setFocus] = useState<string | null>();
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});

  const isExpanded = (fieldConfig: any) => {
    const fieldValues = fieldConfig.getValue(values);
    if (
      fieldConfig.name === "qualifiedAttributions" &&
      isArray(fieldValues) &&
      fieldValues.length === 0
    ) {
      return true;
    }

    if (isArray(fieldValues)) return fieldValues.length > 0;
    if (isObject(fieldValues)) return !isEmpty(fieldValues);
    return !isNil(fieldValues);
  };

  useEffect(() => {
    if (focus && inputRefs.current[focus]) {
      inputRefs.current[focus]?.focus();
      setFocus(null);
    }
  }, [focus]);

  const setInputRef = (
    fieldName: string,
    element: HTMLInputElement | HTMLTextAreaElement | null,
  ) => {
    inputRefs.current[fieldName] = element;
  };

  const datasetTypeOptions = useMemo(
    () =>
      datasetTypes?.map((type) => (
        <Combobox.Option
          value={type.uri}
          key={type.uri}
          description={`${localization.code}: ${type.code}`}
        >
          {getTranslateText(type?.label)}
        </Combobox.Option>
      )),
    [datasetTypes],
  );

  const provenanceOptions = useMemo(
    () =>
      provenanceStatements?.map((item) => (
        <Combobox.Option value={item.uri} key={item.uri}>
          {getTranslateText(item.label)}
        </Combobox.Option>
      )),
    [provenanceStatements],
  );

  const frequencyOptions = useMemo(
    () =>
      frequencies?.map((item) => (
        <Combobox.Option value={item.uri} key={item.uri}>
          {capitalizeFirstLetter(getTranslateText(item.label))}
        </Combobox.Option>
      )),
    [frequencies],
  );

  // Helper to render a field
  const renderField = (fieldConfig: any, showDivider: boolean = true) =>
    fieldConfig.hideToggleButton ? (
      <div key={fieldConfig.name}>
        {fieldConfig.render({
          values,
          errors,
          setFieldValue,
          setInputRef,
          setFocus,
          expanded: isExpanded(fieldConfig),
          showDivider,
          datasetTypeOptions,
          provenanceOptions,
          frequencyOptions,
        })}
      </div>
    ) : (
      <ToggleFieldButton
        key={fieldConfig.name}
        fieldName={fieldConfig.name}
        hasDeleteButton={fieldConfig.hasDeleteButton}
        addValue={fieldConfig.addValue}
        setFocus={setFocus}
        expanded={isExpanded(fieldConfig)}
        showDivider={showDivider && isExpanded(fieldConfig)}
      >
        {fieldConfig.render({
          values,
          errors,
          setFieldValue,
          ref: (el: HTMLInputElement | HTMLTextAreaElement | null) =>
            setInputRef(fieldConfig.name, el),
          datasetTypeOptions,
          provenanceOptions,
          frequencyOptions,
        })}
      </ToggleFieldButton>
    );

  // remove frequency if mobility form
  const fieldsList = isMobility
    ? FIELD_CONFIG.filter((f) => f.name !== "frequency")
    : FIELD_CONFIG;

  // Split fields into expanded and minimized
  const expandedFields = fieldsList.filter((f) => isExpanded(f));
  const minimizedFields = fieldsList.filter((f) => !isExpanded(f));

  return (
    <div>
      {/* Render expanded fields first */}
      {expandedFields.map((f, i) =>
        renderField(
          f,
          !(i === expandedFields.length - 1 && minimizedFields.length === 0),
        ),
      )}
      {/* Then minimized fields */}
      {minimizedFields.map((f) => renderField(f, false))}
    </div>
  );
};
