"use client";
import { useEffect, useRef, useState } from "react";
import {
  localization,
  trimObjectWhitespace,
  deepMergeWithUndefinedHandling,
  formatISO,
  getTranslateText,
} from "@catalog-frontend/utils";
import {
  InformationModel,
  InformationModelToBeCreated,
  StorageData,
} from "@catalog-frontend/types";
import {
  ConfirmModal,
  FormLayout,
  FormikAutoSaver,
  getFormNotifications,
  HelpMarkdown,
  Snackbar,
  NotificationCarousel,
  SnackbarSeverity,
  StickyFooterBar,
} from "@catalog-frontend/ui";
import { Formik, Form, FormikProps } from "formik";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Spinner,
  Paragraph,
  Checkbox,
} from "@digdir/designsystemet-react";
import styles from "./information-model-form.module.css";
import { AboutSection } from "./components/about-section";
import {
  informationModelValidationSchema,
  draftInformationModelValidationSchema,
} from "./utils/validation-schema";
import { informationModelTemplate } from "./utils/information-model-initial-values";
import { DataStorage } from "@catalog-frontend/utils";
import { get, isEmpty, isEqual } from "lodash";
import classNames from "classnames";

const getErrorDigest = (error: unknown): string | undefined =>
  typeof error === "object" &&
  error !== null &&
  "digest" in error &&
  typeof error.digest === "string"
    ? error.digest
    : undefined;

type Props = {
  initialValues: InformationModel | InformationModelToBeCreated;
  autoSaveStorage?: DataStorage<StorageData>;
  autoSave?: boolean;
  autoSaveId?: string;
  onCancel?: () => void;
  afterSubmit?: () => void;
  onSubmit?: (
    values: InformationModel,
  ) => Promise<InformationModel | undefined>;
  readOnly?: boolean;
  showSnackbarSuccessOnInit?: boolean;
  markDirty?: boolean;
};

const InformationModelForm = ({
  initialValues,
  autoSaveStorage,
  autoSave = true,
  autoSaveId,
  onCancel,
  afterSubmit,
  onSubmit,
  readOnly = false,
  showSnackbarSuccessOnInit = false,
  markDirty = false,
}: Props) => {
  const searchParams = useSearchParams();
  const restoreOnRender = Boolean(searchParams.get("restore"));
  const { catalogId, informationModelId } = useParams();
  const [validateOnChange, setValidateOnChange] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [ignoreRequired, setIgnoreRequired] = useState(false);
  const ignoreRequiredNewKey = "informationModelForm.ignoreRequired.new";
  const ignoreRequiredKey = autoSaveId
    ? `informationModelForm.ignoreRequired.${autoSaveId}`
    : ignoreRequiredNewKey;
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>("success");
  const [snackbarFadeIn, setSnackbarFadeIn] = useState(true);
  const router = useRouter();
  const formikRef = useRef<FormikProps<InformationModel>>(null);

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

  const handleCancel = (dirty: boolean) => () => {
    if (dirty) {
      setShowCancelConfirm(true);
    } else {
      handleConfirmCancel();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    autoSaveStorage?.delete();
    setIsCanceled(true);

    if (onCancel) {
      onCancel();
    } else {
      router.push(
        informationModelId
          ? `/catalogs/${catalogId}/information-models/${informationModelId}`
          : `/catalogs/${catalogId}/information-models`,
      );
    }
  };

  const handleCloseConfirmCancel = () => {
    setShowCancelConfirm(false);
  };

  const restoreConfirmMessage = ({ values, lastChanged }: StorageData) => {
    const name =
      getTranslateText(values?.title) ||
      localization.informationModelForm.alert.titleNotDefined;
    const lastChangedFormatted = formatISO(lastChanged, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <>
        <Paragraph>{localization.alert.youHaveUnsavedChanges}</Paragraph>
        <Paragraph>
          <span className={styles.bold}>{name}</span> ({lastChangedFormatted})
        </Paragraph>
        <Paragraph className={styles.topMargin2}>
          {localization.alert.wantToRestoreChanges}
        </Paragraph>
      </>
    );
  };

  useEffect(() => {
    if (typeof sessionStorage === "undefined") {
      return;
    }
    const stored = sessionStorage.getItem(ignoreRequiredKey);
    if (stored !== null) {
      setIgnoreRequired(stored === "true");
      return;
    }
    const carriedOver = sessionStorage.getItem(ignoreRequiredNewKey);
    if (autoSaveId && carriedOver !== null) {
      sessionStorage.setItem(ignoreRequiredKey, carriedOver);
      sessionStorage.removeItem(ignoreRequiredNewKey);
      setIgnoreRequired(carriedOver === "true");
    }
  }, [ignoreRequiredKey, ignoreRequiredNewKey, autoSaveId]);

  const handleIgnoreRequiredChange = (checked: boolean) => {
    setIgnoreRequired(checked);
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(ignoreRequiredKey, String(checked));
    }
  };

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
      <Formik
        innerRef={formikRef}
        initialValues={informationModelTemplate(
          initialValues as InformationModel,
        )}
        validationSchema={
          ignoreRequired
            ? draftInformationModelValidationSchema
            : informationModelValidationSchema
        }
        validateOnChange={validateOnChange}
        validateOnBlur={validateOnChange}
        onSubmit={async (
          values: InformationModel,
          { setSubmitting, resetForm },
        ) => {
          if (readOnly) {
            return;
          }

          const trimmedValues = trimObjectWhitespace(values);

          if (
            isEqual(
              informationModelTemplate(trimmedValues),
              informationModelTemplate(initialValues as InformationModel),
            )
          ) {
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
              resetForm({
                values: informationModelTemplate(newValues ?? trimmedValues),
              });

              autoSaveStorage?.delete();

              if (afterSubmit) {
                afterSubmit();
              }
            } catch (error) {
              console.error("Failed to save information model:", error);
              const digest = getErrorDigest(error);
              showSnackbarMessage({
                message: digest
                  ? `${localization.snackbar.saveFailed} (${digest})`
                  : localization.snackbar.saveFailed,
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
          isValid,
          isSubmitting,
          isValidating,
          submitForm,
          setValues,
          values,
          initialValues: formInitialValues,
        }) => {
          const notifications = getFormNotifications({
            isValid,
            hasUnsavedChanges: false,
          });
          const hasError = (fields: (keyof InformationModel)[]) =>
            fields.some((field) => Object.keys(errors).includes(field));

          const handleRestoreInformationModel = (data: StorageData) => {
            if (data?.id !== autoSaveId) {
              if (!data?.id) {
                window.location.replace(
                  `/catalogs/${catalogId}/information-models/new?restore=1`,
                );
                return false;
              }
              window.location.replace(
                `/catalogs/${catalogId}/information-models/${data.id}/edit?restore=1`,
              );
              return false;
            }

            const restoreValues: InformationModel = informationModelTemplate(
              deepMergeWithUndefinedHandling({ ...initialValues }, data.values),
            );
            setValues(restoreValues);

            showSnackbarMessage({
              message: localization.snackbar.restoreSuccessful,
              severity: "success",
            });
            return true;
          };

          const dirtyFields = ((): string[] => {
            const dirtyFields: string[] = [];

            const isDirty = (name: string) => {
              const a = get(formInitialValues, name);
              const b = get(values, name);

              if (isEmpty(a) && isEmpty(b)) {
                return false;
              }

              return !isEqual(a, b);
            };

            [
              ...Object.keys({ ...formInitialValues, ...values }),
              "title",
            ].forEach((name) => {
              if (isDirty(name)) {
                dirtyFields.push(name);
              }
            });

            return dirtyFields;
          })();

          return (
            <>
              {autoSave && autoSaveStorage && (
                <FormikAutoSaver
                  id={autoSaveId}
                  storage={autoSaveStorage}
                  restoreOnRender={restoreOnRender}
                  onRestore={handleRestoreInformationModel}
                  confirmMessage={restoreConfirmMessage}
                />
              )}
              <div className="container">
                <Form>
                  <FormLayout>
                    <FormLayout.Section
                      id="about-section"
                      title={localization.informationModelForm.heading.about}
                      subtitle={
                        localization.informationModelForm.subtitle.about
                      }
                      required
                      changed={
                        markDirty &&
                        dirtyFields.some((field) => ["title"].includes(field))
                      }
                      error={hasError(["title"])}
                    >
                      <AboutSection />
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

              <StickyFooterBar>
                <div className={styles.footerContent}>
                  <Button
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
                    data-testid="save-information-model-button"
                  >
                    {isSubmitting ? (
                      <Spinner aria-label={localization.saving} />
                    ) : (
                      localization.save
                    )}
                  </Button>
                  <Button
                    disabled={
                      readOnly || isSubmitting || isValidating || isCanceled
                    }
                    onClick={handleCancel(dirty)}
                    variant="secondary"
                    data-testid="cancel-information-model-button"
                  >
                    {localization.button.cancel}
                  </Button>
                  <div className={styles.verticalLine} />
                  <div
                    className={classNames(
                      styles.flex,
                      styles.gap2,
                      styles.noWrap,
                    )}
                  >
                    <Checkbox
                      label={
                        localization.informationModelForm.fieldLabel
                          .ignoreRequired
                      }
                      value="ignoreRequired"
                      checked={ignoreRequired}
                      onChange={(e) =>
                        handleIgnoreRequiredChange(e.target.checked)
                      }
                    />
                    <HelpMarkdown
                      aria-label={`Help ${localization.informationModelForm.fieldLabel.ignoreRequired}`}
                    >
                      {localization.informationModelForm.alert.ignoreRequired}
                    </HelpMarkdown>
                  </div>
                </div>
                {notifications.length > 0 && (
                  <NotificationCarousel notifications={notifications} />
                )}
              </StickyFooterBar>
            </>
          );
        }}
      </Formik>
      {showCancelConfirm && (
        <ConfirmModal
          title={localization.confirm.exitForm.title}
          content={localization.confirm.exitForm.message}
          onSuccess={handleConfirmCancel}
          onCancel={handleCloseConfirmCancel}
        />
      )}
    </>
  );
};

export default InformationModelForm;
