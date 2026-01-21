"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Formik, Form, FormikProps } from "formik";
import { useSearchParams } from "next/navigation";
import { Checkbox, Paragraph, Spinner } from "@digdir/designsystemet-react";
import {
  DataStorage,
  formatISO,
  getTranslateText,
  localization,
  safeValues,
  deepMergeWithUndefinedHandling,
  trimObjectWhitespace,
} from "@catalog-frontend/utils";
import type {
  CodeListsResult,
  Concept,
  Definisjon,
  FieldsResult,
  ReferenceDataCode,
  StorageData,
  UnionRelation,
  UsersResult,
} from "@catalog-frontend/types";
import {
  Button,
  ConfirmModal,
  FormLayout,
  FormikAutoSaver,
  getFormNotifications,
  HelpMarkdown,
  NotificationCarousel,
  Snackbar,
  SnackbarSeverity,
} from "@catalog-frontend/ui";
import { conceptSchema } from "./validation-schema";
import { TermSection } from "./components/term-section";
import { DefinitionSection } from "./components/definition-section";
import { RemarkSection } from "./components/remark-section";
import { SubjectSection } from "./components/subject-section";
import { ExampleSection } from "./components/example-section";
import { RelationSection } from "./components/relation-section";
import { ValueRangeSection } from "./components/value-range-section";
import { StatusSection } from "./components/status-section";
import { VersionSection } from "./components/version-section";
import { PeriodSection } from "./components/period-section";
import { InternalSection } from "./components/internal-section";
import { ContactSection } from "./components/contact-section";
import styles from "./concept-form.module.scss";
import { get, isEmpty, isEqual } from "lodash";
import {
  UnionRelationWithIndex,
  updateUnionRelation,
} from "@concept-catalog/utils/relation-utils";

type Props = {
  afterSubmit?: () => void;
  autoSave?: boolean;
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
  catalogId: string;
  concept?: Concept;
  conceptStatuses: ReferenceDataCode[];
  codeListsResult: CodeListsResult;
  customFooterBar?: ReactNode;
  fieldsResult: FieldsResult;
  initialConcept: Concept;
  markDirty?: boolean;
  onCancel?: () => void;
  onSubmit?: (values: Concept) => Promise<Concept | undefined>;
  onRestore?: (data: StorageData) => boolean;
  readOnly?: boolean;
  showSnackbarSuccessOnInit?: boolean;
  usersResult: UsersResult;
};

const ConceptForm = ({
  afterSubmit,
  autoSave = true,
  autoSaveId,
  autoSaveStorage,
  catalogId,
  concept,
  conceptStatuses,
  codeListsResult,
  customFooterBar,
  fieldsResult,
  initialConcept,
  markDirty,
  onCancel,
  onSubmit,
  onRestore,
  readOnly,
  showSnackbarSuccessOnInit,
  usersResult,
}: Props) => {
  const searchParams = useSearchParams();
  const formikRef = useRef<FormikProps<Concept>>(null);

  const restoreOnRender = Boolean(searchParams.get("restore"));
  const validateOnRender = Boolean(searchParams.get("validate"));
  const [validateOnChange, setValidateOnChange] = useState(validateOnRender);
  const [isCanceled, setIsCanceled] = useState(false);
  const [ignoreRequired, setIgnoreRequired] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");
  const [snackbarFadeIn, setSnackbarFadeIn] = useState(true);

  const showSnackbarMessage = ({
    message,
    severity,
    fadeIn = true,
  }: {
    message: string;
    severity: SnackbarSeverity;
    fadeIn?: boolean;
  }) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarFadeIn(fadeIn);
    if (fadeIn) {
      setShowSnackbar(false);
      setTimeout(() => setShowSnackbar(true), 10);
    } else {
      setShowSnackbar(true);
    }
  };

  const mapPropsToValues = ({
    id,
    anbefaltTerm = { navn: {} },
    definisjon = undefined,
    definisjonForAllmennheten = undefined,
    definisjonForSpesialister = undefined,
    merknad = {},
    merkelapp = [],
    tillattTerm = {},
    frarådetTerm = {},
    eksempel = {},
    fagområde = {},
    fagområdeKoder = [],
    statusURI = "http://publications.europa.eu/resource/authority/concept-status/DRAFT",
    omfang = undefined,
    kontaktpunkt = undefined,
    gyldigFom = undefined,
    gyldigTom = undefined,
    seOgså = [],
    internSeOgså = [],
    erstattesAv = [],
    internErstattesAv = [],
    assignedUser = "",
    abbreviatedLabel = undefined,
    begrepsRelasjon = [],
    internBegrepsRelasjon = [],
    versjonsnr = { major: 0, minor: 1, patch: 0 },
    interneFelt = {},
    ...rest
  }: Concept) => {
    const values = {
      id,
      anbefaltTerm,
      definisjon,
      definisjonForAllmennheten,
      definisjonForSpesialister,
      merknad,
      merkelapp,
      tillattTerm,
      frarådetTerm,
      eksempel,
      fagområde,
      fagområdeKoder,
      statusURI,
      omfang,
      kontaktpunkt,
      gyldigFom,
      gyldigTom,
      seOgså,
      internSeOgså,
      erstattesAv,
      internErstattesAv,
      assignedUser,
      abbreviatedLabel,
      begrepsRelasjon,
      internBegrepsRelasjon,
      versjonsnr,
      interneFelt,
      ...rest,
    };

    return safeValues(values);
  };

  const subjectCodeList = codeListsResult?.codeLists?.find(
    (codeList) => codeList.id === fieldsResult?.editable?.domainCodeListId,
  );

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);

    autoSaveStorage?.delete();
    setIsCanceled(true);

    if (onCancel) {
      try {
        onCancel();
      } catch {
        // Nothing...
      }
    }
  };

  const handleCloseConfirmCancel = () => {
    setShowCancelConfirm(false);
  };

  const restoreConfirmMessage = ({ values, lastChanged }: StorageData) => {
    const name =
      getTranslateText(values?.anbefaltTerm?.navn) ||
      localization.conceptForm.alert.termNotDefined;
    const lastChangedFormatted = formatISO(lastChanged, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <>
        <Paragraph size="sm">
          {localization.alert.youHaveUnsavedChanges}
        </Paragraph>
        <Paragraph size="sm">
          <span className={styles.bold}>{name}</span> ({lastChangedFormatted})
        </Paragraph>
        <Paragraph size="sm" className={styles.topMargin2}>
          {localization.alert.wantToRestoreChanges}
        </Paragraph>
      </>
    );
  };

  useEffect(() => {
    if (validateOnRender) {
      formikRef.current?.validateForm();
    }
  }, [validateOnRender]);

  useEffect(() => {
    if (showSnackbarSuccessOnInit) {
      showSnackbarMessage({
        message: localization.snackbar.saveSuccessful,
        severity: "success",
        fadeIn: false,
      });
    }
  }, [showSnackbarSuccessOnInit]);

  return (
    <>
      {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.exitForm.title}
          content={localization.confirm.exitForm.message}
          onSuccess={handleConfirmCancel}
          onCancel={handleCloseConfirmCancel}
        />
      )}
      <Formik
        innerRef={formikRef}
        initialValues={mapPropsToValues(initialConcept)}
        validationSchema={conceptSchema({
          required: !ignoreRequired,
          baseUri: "",
        })}
        validateOnChange={validateOnChange}
        validateOnBlur={validateOnChange}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          if (readOnly) {
            return;
          }

          const trimmedValues = trimObjectWhitespace(values);

          if (isEqual(trimmedValues, mapPropsToValues(initialConcept))) {
            resetForm();
            return;
          }

          if (onSubmit) {
            try {
              const newValues = await onSubmit(trimmedValues);

              showSnackbarMessage({
                message: localization.snackbar.saveSuccessful,
                severity: "success",
              });
              if (newValues) {
                resetForm({ values: newValues });
              } else {
                resetForm();
              }

              // Discard stored data
              autoSaveStorage?.delete();

              if (afterSubmit) {
                afterSubmit();
              }
            } catch {
              showSnackbarMessage({
                message: localization.snackbar.saveFailed,
                severity: "danger",
              });
            } finally {
              setSubmitting(false);
            }
          }
        }}
      >
        {({
          errors,
          dirty,
          initialValues,
          isValid,
          isSubmitting,
          isValidating,
          values,
          submitForm,
          setValues,
          setFieldValue,
        }) => {
          const notifications = getFormNotifications({
            isValid,
            hasUnsavedChanges: false,
          });
          const hasError = (fields: (keyof Concept)[]) =>
            fields.some((field) => Object.keys(errors).includes(field));

          const dirtyFields = ((): string[] => {
            const dirtyFields: string[] = [];

            const isDirty = (name) => {
              const a = get(initialValues, name);
              const b = get(values, name);

              if (isEmpty(a) && isEmpty(b)) {
                return false;
              }

              return !isEqual(a, b);
            };

            [
              ...Object.keys({ ...initialValues, ...values }),
              "interneFelt.assignedUser",
              "interneFelt.abbreviatedLabel",
              "interneFelt.merkelapp",
              ...fieldsResult.internal.map(
                ({ id }) => `interneFelt[${id}].value`,
              ),
              "kontaktpunkt.harEpost",
              "kontaktpunkt.harTelefon",
              "kontaktpunkt.harSkjema",
              "omfang.tekst",
              "omfang.uri",
            ].forEach((name) => {
              if (isDirty(name)) {
                dirtyFields.push(name);
              }
            });

            return dirtyFields;
          })();

          const handleRestoreConcept = (data: StorageData) => {
            if (onRestore && !onRestore(data)) {
              return false;
            }

            const restoreValues: Concept = deepMergeWithUndefinedHandling(
              { ...initialValues },
              data.values,
            );
            setValues(restoreValues);

            // Handle relation data from secondary storage
            const restoreRelationData =
              autoSaveStorage?.getSecondary("relation");
            if (restoreRelationData && restoreRelationData?.id === autoSaveId) {
              const relationValues: {
                rel: UnionRelation;
                prev: UnionRelationWithIndex;
              } = restoreRelationData.values;
              updateUnionRelation(
                relationValues.rel,
                relationValues.prev,
                restoreValues,
                setFieldValue,
              );
              // Delete relation data from secondary storage since it is merged with the main data
              autoSaveStorage?.deleteSecondary("relation");
            }

            // Handle definition data from secondary storage
            const restoreDefinitionData =
              autoSaveStorage?.getSecondary("definition");
            if (
              restoreDefinitionData &&
              restoreDefinitionData?.id === autoSaveId
            ) {
              const definitionValues: {
                definition: Definisjon;
                fieldName: string;
              } = restoreDefinitionData.values;
              setFieldValue(
                definitionValues.fieldName,
                definitionValues.definition,
              );
              // Delete definition data from secondary storage since it is merged with the main data
              autoSaveStorage?.deleteSecondary("definition");
            }

            showSnackbarMessage({
              message: localization.snackbar.restoreSuccessful,
              severity: "success",
            });
            return true;
          };

          if (concept && !isEqual(initialConcept, concept) && !dirty) {
            setValues(concept);
          }

          return (
            <>
              <div className="container">
                <Form>
                  {autoSave && autoSaveStorage && (
                    <FormikAutoSaver
                      id={autoSaveId}
                      storage={autoSaveStorage}
                      restoreOnRender={restoreOnRender}
                      onRestore={handleRestoreConcept}
                      confirmMessage={restoreConfirmMessage}
                    />
                  )}

                  <FormLayout>
                    <FormLayout.Section
                      id="term"
                      title={localization.conceptForm.section.termTitle}
                      subtitle={localization.conceptForm.section.termSubtitle}
                      required
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          [
                            "anbefaltTerm",
                            "tillattTerm",
                            "frarådetTerm",
                          ].includes(field),
                        )
                      }
                      error={hasError([
                        "anbefaltTerm",
                        "tillattTerm",
                        "frarådetTerm",
                      ])}
                    >
                      <TermSection
                        changed={
                          markDirty
                            ? dirtyFields.filter((field) =>
                                [
                                  "anbefaltTerm",
                                  "tillattTerm",
                                  "frarådetTerm",
                                ].includes(field),
                              )
                            : []
                        }
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="definition"
                      title={localization.conceptForm.section.definitionTitle}
                      subtitle={
                        localization.conceptForm.section.definitionSubtitle
                      }
                      required
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          [
                            "definisjon",
                            "definisjonForAllmennheten",
                            "definisjonForSpesialister",
                          ].includes(field),
                        )
                      }
                      error={hasError([
                        "definisjon",
                        "definisjonForAllmennheten",
                        "definisjonForSpesialister",
                      ])}
                    >
                      <DefinitionSection
                        autoSaveId={autoSaveId}
                        autoSaveStorage={autoSaveStorage}
                        changed={
                          markDirty
                            ? dirtyFields.filter((field) =>
                                [
                                  "definisjon",
                                  "definisjonForAllmennheten",
                                  "definisjonForSpesialister",
                                ].includes(field),
                              )
                            : []
                        }
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="remark"
                      title={localization.conceptForm.section.remarkTitle}
                      subtitle={localization.conceptForm.section.remarkSubtitle}
                      changed={
                        markDirty &&
                        dirtyFields.some((field) => ["merknad"].includes(field))
                      }
                      error={hasError(["merknad"])}
                    >
                      <RemarkSection
                        changed={markDirty ? dirtyFields : []}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="subject"
                      title={localization.conceptForm.section.subjectTitle}
                      subtitle={
                        localization.conceptForm.section.subjectSubtitle
                      }
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          ["fagområdeKoder"].includes(field),
                        )
                      }
                      error={hasError(["fagområdeKoder"])}
                    >
                      <SubjectSection
                        codes={subjectCodeList?.codes}
                        changed={markDirty ? dirtyFields : []}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="example"
                      title={localization.conceptForm.section.exampleTitle}
                      subtitle={
                        localization.conceptForm.section.exampleSubtitle
                      }
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          ["eksempel"].includes(field),
                        )
                      }
                      error={hasError(["eksempel"])}
                    >
                      <ExampleSection
                        changed={markDirty ? dirtyFields : []}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="valueRange"
                      title={localization.conceptForm.section.valueRangeTitle}
                      subtitle={
                        localization.conceptForm.section.valueRangeSubtitle
                      }
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          ["omfang.tekst", "omfang.uri"].includes(field),
                        )
                      }
                      error={hasError(["omfang"])}
                    >
                      <ValueRangeSection
                        changed={markDirty ? dirtyFields : []}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="relation"
                      title={localization.conceptForm.section.relationTitle}
                      subtitle={
                        localization.conceptForm.section.relationSubtitle
                      }
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          [
                            "begrepsRelasjon",
                            "erstattesAv",
                            "seOgså",
                            "internBegrepsRelasjon",
                            "internErstattesAv",
                            "internSeOgså",
                          ].includes(field),
                        )
                      }
                      error={hasError([
                        "begrepsRelasjon",
                        "erstattesAv",
                        "seOgså",
                        "internBegrepsRelasjon",
                        "internErstattesAv",
                        "internSeOgså",
                      ])}
                    >
                      <RelationSection
                        autoSaveId={autoSaveId}
                        autoSaveStorage={autoSaveStorage}
                        catalogId={catalogId}
                        changed={markDirty ? dirtyFields : []}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="internal"
                      title={localization.conceptForm.section.internalTitle}
                      subtitle={
                        localization.conceptForm.section.internalSubtitle
                      }
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          [
                            "interneFelt.assignedUser",
                            "interneFelt.abbreviatedLabel",
                            "interneFelt.merkelapp",
                            ...fieldsResult.internal.map(
                              ({ id }) => `interneFelt[${id}].value`,
                            ),
                          ].includes(field),
                        )
                      }
                      error={hasError(["interneFelt"])}
                    >
                      <InternalSection
                        codeLists={codeListsResult.codeLists}
                        internalFields={fieldsResult.internal}
                        userList={usersResult.users}
                        changed={markDirty ? dirtyFields : []}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="status"
                      title={
                        localization.conceptForm.section.conceptStatusTitle
                      }
                      subtitle={
                        localization.conceptForm.section.conceptStatusSubtitle
                      }
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          ["statusURI"].includes(field),
                        )
                      }
                      error={hasError(["statusURI"])}
                    >
                      <StatusSection
                        conceptStatuses={conceptStatuses}
                        changed={markDirty ? dirtyFields : []}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="version"
                      title={localization.conceptForm.section.versionTitle}
                      subtitle={
                        localization.conceptForm.section.versionSubtitle
                      }
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          ["versjonsnr"].includes(field),
                        )
                      }
                      error={hasError(["versjonsnr"])}
                    >
                      <VersionSection
                        changed={markDirty ? dirtyFields : []}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="period"
                      title={localization.conceptForm.section.periodTitle}
                      subtitle={localization.conceptForm.section.periodSubtitle}
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          ["gyldigFom", "gyldigTom"].includes(field),
                        )
                      }
                      error={hasError(["gyldigFom", "gyldigTom"])}
                    >
                      <PeriodSection
                        changed={markDirty ? dirtyFields : []}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                    <FormLayout.Section
                      id="contact"
                      title={localization.conceptForm.section.contactTitle}
                      subtitle={
                        localization.conceptForm.section.contactSubtitle
                      }
                      required
                      changed={
                        markDirty &&
                        dirtyFields.some((field) =>
                          [
                            "kontaktpunkt.harEpost",
                            "kontaktpunkt.harTelefon",
                            "kontaktpunkt.harSkjema",
                          ].includes(field),
                        )
                      }
                      error={hasError(["kontaktpunkt"])}
                    >
                      <ContactSection
                        changed={markDirty ? dirtyFields : []}
                        readOnly={readOnly}
                      />
                    </FormLayout.Section>
                  </FormLayout>
                </Form>
              </div>

              {showSnackbar && (
                <Snackbar fadeIn={snackbarFadeIn}>
                  <Snackbar.Item
                    severity={snackbarSeverity}
                    onClose={() => {
                      setShowSnackbar(false);
                    }}
                  >
                    {snackbarMessage}
                  </Snackbar.Item>
                </Snackbar>
              )}
              <div className={styles.stickyFooterBar}>
                <div
                  className={classNames(
                    "container",
                    styles.stickyFooterContent,
                  )}
                >
                  {customFooterBar ? (
                    <>{customFooterBar}</>
                  ) : (
                    <>
                      <div>
                        <div className={classNames(styles.flex, styles.gap4)}>
                          <Button
                            size="sm"
                            type="button"
                            disabled={
                              readOnly ||
                              isSubmitting ||
                              isValidating ||
                              isCanceled ||
                              !dirty
                            }
                            onClick={() => {
                              setValidateOnChange(true);
                              submitForm();
                            }}
                          >
                            {isSubmitting ? (
                              <Spinner title="Lagrer" size="sm" />
                            ) : (
                              "Lagre"
                            )}
                          </Button>
                          <Button
                            size="sm"
                            disabled={
                              readOnly ||
                              isSubmitting ||
                              isValidating ||
                              isCanceled
                            }
                            onClick={handleCancel}
                            variant="secondary"
                          >
                            Avbryt
                          </Button>
                          <div
                            className={classNames(
                              styles.flex,
                              styles.gap2,
                              styles.noWrap,
                            )}
                          >
                            <Checkbox
                              size="sm"
                              value="ignoreRequired"
                              checked={ignoreRequired}
                              onChange={(e) =>
                                setIgnoreRequired(e.target.checked)
                              }
                            >
                              {
                                localization.conceptForm.fieldLabel
                                  .ignoreRequired
                              }
                            </Checkbox>
                            <HelpMarkdown
                              aria-label={`Help ${localization.conceptForm.fieldLabel.ignoreRequired}`}
                            >
                              {localization.conceptForm.alert.ignoreRequired}
                            </HelpMarkdown>
                          </div>
                        </div>
                      </div>
                      {notifications.length > 0 && (
                        <NotificationCarousel notifications={notifications} />
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default ConceptForm;
