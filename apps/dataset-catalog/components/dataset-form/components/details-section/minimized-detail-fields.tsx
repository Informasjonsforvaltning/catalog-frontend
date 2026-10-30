"use client";

import {
  AddButton,
  CostsModal,
  CostsTable,
  FastFieldWithRef,
  FieldsetDivider,
  FormikLanguageFieldset,
  MultiSuggestionSelect,
  SingleSuggestionSelect,
  TextareaWithPrefix,
  TitleWithHelpTextAndTag,
  UriWithLabelFieldsetTable,
} from "@catalog-frontend/ui";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
} from "@catalog-frontend/utils";
import { Fieldset, Textfield } from "@digdir/designsystemet-react";
import { FieldArray, useFormikContext } from "formik";
import {
  Dataset,
  QualityDimension,
  ReferenceDataCode,
} from "@catalog-frontend/types";
import styles from "./details.module.css";
import { QualifiedAttributionsSection } from "../qualified-attributions-section";
import FieldsetWithDelete from "../../../fieldset-with-delete";
import { ToggleFieldButton } from "../toggle-field-button";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { isArray, isEmpty, isNil, isObject } from "lodash";
import React from "react";
import {
  emptyQualityAnnotation,
  LEGACY_QUALITY_DIMENSIONS,
  LEGACY_QUALITY_FIELD_NAMES,
  QualityAnnotationsEditor,
  QualityAnnotationsModal,
} from "./components/quality-annotations";

type Props = {
  datasetTypes: ReferenceDataCode[];
  provenanceStatements: ReferenceDataCode[];
  frequencies: ReferenceDataCode[];
  currencies?: ReferenceDataCode[];
  qualityDimensions?: QualityDimension[];
  isMobility?: boolean;
};

const FIELD_CONFIG = [
  {
    name: "type",
    getValue: (values: Dataset) => values?.type,
    render: (props: any) => (
      <MultiSuggestionSelect
        emptyMessage={localization.search.noHits}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.type}
          >
            {localization.datasetForm.fieldLabel.type}
          </TitleWithHelpTextAndTag>
        }
        inputRef={props.ref}
        onSelectedChange={(selectedValues) =>
          props.setFieldValue("type", selectedValues)
        }
        options={props.datasetTypeSuggestionOptions}
        placeholder={`${localization.search.search}...`}
        selectedValues={props.values.type}
      />
    ),
    hasDeleteButton: true,
  },
  {
    name: "provenance",
    getValue: (values: Dataset) => values?.provenance,
    render: (props: any) => (
      <SingleSuggestionSelect
        emptyMessage={localization.search.noHits}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.provenance}
          >
            {localization.datasetForm.fieldLabel.provenance}
          </TitleWithHelpTextAndTag>
        }
        inputRef={props.ref}
        onValueChange={(value) =>
          props.setFieldValue("provenance", value ?? "")
        }
        options={props.provenanceSuggestionOptions}
        placeholder={`${localization.search.search}...`}
        value={props.values.provenance}
      />
    ),
    hasDeleteButton: true,
  },
  {
    name: "frequency",
    getValue: (values: Dataset) => values?.frequency,
    render: (props: any) => (
      <SingleSuggestionSelect
        emptyMessage={localization.search.noHits}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.frequency}
          >
            {localization.datasetForm.fieldLabel.frequency}
          </TitleWithHelpTextAndTag>
        }
        inputRef={props.ref}
        onValueChange={(value) => props.setFieldValue("frequency", value ?? "")}
        options={props.frequencySuggestionOptions}
        placeholder={`${localization.search.search}...`}
        value={props.values.frequency}
      />
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
  ...LEGACY_QUALITY_DIMENSIONS.map((field) => ({
    name: `${field}.hasBody`,
    getValue: (values: Dataset) => values?.[field]?.hasBody,
    addValue: { nb: "", nn: "" },
    render: (props: any) => (
      <FormikLanguageFieldset
        as={TextareaWithPrefix}
        name={`${field}.hasBody`}
        ref={props.ref}
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext[field]}
          >
            {localization.datasetForm.fieldLabel[field]}
          </TitleWithHelpTextAndTag>
        }
      />
    ),
  })),
  {
    name: "qualityAnnotations",
    getValue: (values: Dataset) => values?.qualityAnnotations,
    render: (props: any) =>
      isEmpty(props.values?.qualityAnnotations) ? (
        <QualityAnnotationsModal
          template={emptyQualityAnnotation()}
          type="new"
          qualityDimensions={props.qualityDimensions}
          onSuccess={(formValues) =>
            props.setFieldValue("qualityAnnotations[0]", formValues)
          }
        />
      ) : (
        <>
          <QualityAnnotationsEditor
            qualityDimensions={props.qualityDimensions}
          />
          {props.showDivider && <FieldsetDivider />}
        </>
      ),
    hasDeleteButton: false,
    hideToggleButton: true,
  },
  {
    name: "qualifiedAttributions",
    getValue: (values: Dataset) => values?.qualifiedAttributions,
    render: (props: any) => <QualifiedAttributionsSection ref={props.ref} />,
    hasDeleteButton: true,
    addValue: [],
  },
  {
    name: "costs",
    getValue: (values: Dataset) => values?.costs,
    render: (props: any) =>
      isEmpty(props.values?.costs) ? (
        <CostsModal
          template={{ description: {} }}
          type="new"
          currencies={props.currencies}
          onSuccess={(formValues) =>
            props.setFieldValue("costs[0]", formValues)
          }
        />
      ) : (
        <>
          <CostsTable
            currencies={props.currencies}
            helpText={localization.datasetForm.helptext.costs}
          />
          {props.showDivider && <FieldsetDivider />}
        </>
      ),
    hasDeleteButton: false,
    hideToggleButton: true,
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
        itemLabel={localization.datasetForm.fieldLabel.conformsTo}
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
  currencies,
  qualityDimensions,
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

  useLayoutEffect(() => {
    if (!focus) {
      return;
    }

    const input = inputRefs.current[focus];
    if (input) {
      input.focus();
      setFocus(null);
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRefs.current[focus]?.focus();
      setFocus(null);
    });

    return () => cancelAnimationFrame(frame);
  }, [focus]);

  const setInputRef = (
    fieldName: string,
    element: HTMLInputElement | HTMLTextAreaElement | null,
  ) => {
    inputRefs.current[fieldName] = element;
  };

  const datasetTypeSuggestionOptions = useMemo(
    () =>
      datasetTypes?.map((type) => ({
        value: type.uri,
        label: getTranslateText(type.label),
        description: `${localization.code}: ${type.code}`,
      })) ?? [],
    [datasetTypes],
  );

  const provenanceSuggestionOptions = useMemo(
    () =>
      provenanceStatements?.map((item) => ({
        value: item.uri,
        label: getTranslateText(item.label),
      })) ?? [],
    [provenanceStatements],
  );

  const frequencySuggestionOptions = useMemo(
    () =>
      frequencies?.map((item) => ({
        value: item.uri,
        label: capitalizeFirstLetter(getTranslateText(item.label)),
      })) ?? [],
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
          datasetTypeSuggestionOptions,
          provenanceSuggestionOptions,
          frequencySuggestionOptions,
          currencies,
          qualityDimensions,
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
          datasetTypeSuggestionOptions,
          provenanceSuggestionOptions,
          frequencySuggestionOptions,
          currencies,
          qualityDimensions,
        })}
      </ToggleFieldButton>
    );

  // remove frequency if mobility form
  const fieldsList = isMobility
    ? FIELD_CONFIG.filter((f) => f.name !== "frequency")
    : FIELD_CONFIG;

  // Split fields into expanded and minimized.
  // Legacy quality fields are never offered as add-buttons.
  const expandedFields = fieldsList.filter((f) => isExpanded(f));
  const minimizedFields = fieldsList.filter(
    (f) => !isExpanded(f) && !LEGACY_QUALITY_FIELD_NAMES.has(f.name),
  );

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
