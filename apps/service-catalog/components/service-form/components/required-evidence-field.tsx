import {
  LocalizedStrings,
  ReferenceDataCode,
  RequiredEvidence,
  Service,
} from "@catalog-frontend/types";
import {
  AddButton,
  DeleteButton,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui";
import cn from "classnames";
import {
  capitalizeFirstLetter,
  getTranslateText,
  localization,
  trimObjectWhitespace,
} from "@catalog-frontend/utils";
import {
  Button,
  Card,
  Checkbox,
  ErrorMessage,
  Heading,
  Modal,
  Paragraph,
  Radio,
  Textfield,
} from "@digdir/designsystemet-react";
import { FastField, FieldArray, Formik, useFormikContext } from "formik";
import styles from "../service-form.module.css";
import { useEffect, useRef, useState } from "react";
import { trim, isEmpty, pickBy, identity } from "lodash";
import {
  confirmedRequiredEvidenceSchema,
  draftRequiredEvidenceSchema,
} from "../validation-schema";

interface Props {
  errors?:
    | string
    | Array<{ title: LocalizedStrings; description: LocalizedStrings }>;
  evidenceTypes: ReferenceDataCode[];
  languages: ReferenceDataCode[];
  validationSchema:
    | typeof confirmedRequiredEvidenceSchema
    | typeof draftRequiredEvidenceSchema;
}

interface ModalProps {
  evidenceTypes: ReferenceDataCode[];
  languages: ReferenceDataCode[];
  onCancel: () => void;
  onChange: (values: RequiredEvidence) => void;
  onSuccess: (values: RequiredEvidence) => void;
  template: RequiredEvidence;
  type: "new" | "edit";
  validationSchema:
    | typeof confirmedRequiredEvidenceSchema
    | typeof draftRequiredEvidenceSchema;
}

const hasNoFieldValues = (values: RequiredEvidence) => {
  if (!values) return true;
  return (
    isEmpty(trim(values.identifier)) && isEmpty(pickBy(values.title, identity))
  );
};

export const RequiredEvidenceField = (props: Props) => {
  const { errors, evidenceTypes, languages, validationSchema } = props;
  const { values, setFieldValue } = useFormikContext<Service>();
  const [snapshot, setSnapshot] = useState<RequiredEvidence[]>(
    values.requiredEvidence ?? [],
  );

  return (
    <FieldArray
      name="requiredEvidence"
      render={(arrayHelpers) => (
        <div className={cn(styles.fieldSet, errors && styles.errorBorder)}>
          {values.requiredEvidence?.map((item, index) => (
            <Card key={`${index}-${item.identifier}`}>
              <div className={styles.heading}>
                <div className={styles.field}>
                  {!isEmpty(item?.title) && (
                    <>
                      <Heading size="2xs" spacing level={3}>
                        {localization.serviceForm.fieldLabel.title}
                      </Heading>
                      <Paragraph size="sm">
                        {getTranslateText(item.title)}
                      </Paragraph>
                      {Array.isArray(errors) && errors?.[index]?.title && (
                        <ErrorMessage size="sm">
                          {getTranslateText(errors[index].title)}
                        </ErrorMessage>
                      )}
                    </>
                  )}
                </div>

                <div className={styles.buttons}>
                  <FieldModal
                    evidenceTypes={evidenceTypes}
                    languages={languages}
                    validationSchema={validationSchema}
                    template={item}
                    type="edit"
                    onSuccess={(updatedItem: RequiredEvidence) => {
                      arrayHelpers.replace(index, updatedItem);
                      setSnapshot([...(values.requiredEvidence ?? [])]);
                    }}
                    onCancel={() => setFieldValue("requiredEvidence", snapshot)}
                    onChange={(updatedItem: RequiredEvidence) =>
                      arrayHelpers.replace(index, updatedItem)
                    }
                  />
                  <DeleteButton
                    onClick={() => {
                      const newArray = [...(values.requiredEvidence ?? [])];
                      newArray.splice(index, 1);
                      setFieldValue("requiredEvidence", newArray);
                      setSnapshot([...newArray]);
                    }}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <Heading size="2xs" spacing level={3}>
                  {localization.serviceForm.fieldLabel.description}
                </Heading>
                <Paragraph size="sm">
                  {getTranslateText(item.description)}
                </Paragraph>
                {Array.isArray(errors) && errors?.[index]?.description && (
                  <ErrorMessage size="sm">
                    {getTranslateText(errors[index].description)}
                  </ErrorMessage>
                )}
              </div>
            </Card>
          ))}

          <div>
            <FieldModal
              evidenceTypes={evidenceTypes}
              validationSchema={validationSchema}
              languages={languages}
              template={{ title: {}, description: {}, identifier: "" }}
              type="new"
              onSuccess={() =>
                setSnapshot([...(values.requiredEvidence ?? [])])
              }
              onCancel={() => setFieldValue("requiredEvidence", snapshot)}
              onChange={(updatedItem: RequiredEvidence) => {
                if (
                  snapshot.length === (values.requiredEvidence?.length ?? 0)
                ) {
                  arrayHelpers.push(updatedItem);
                } else {
                  arrayHelpers.replace(snapshot.length, updatedItem);
                }
              }}
            />
          </div>

          {typeof errors === "string" && (
            <ErrorMessage className={styles.errorMessage} size="sm">
              {errors}
            </ErrorMessage>
          )}
        </div>
      )}
    />
  );
};

const FieldModal = (props: ModalProps) => {
  const {
    evidenceTypes,
    languages,
    onCancel,
    onChange,
    onSuccess,
    template,
    type,
    validationSchema,
  } = props;
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Modal.Root>
        <Modal.Trigger asChild>
          {type === "edit" ? (
            <EditButton />
          ) : (
            <AddButton>
              {localization.add}{" "}
              {localization.serviceForm.fieldLabel.requiredEvidence.toLowerCase()}
            </AddButton>
          )}
        </Modal.Trigger>
        <Modal.Dialog ref={modalRef}>
          <Formik
            initialValues={template}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={validationSchema}
            onSubmit={(formValues, { setSubmitting }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              onSuccess(trimmedValues);
              setSubmitting(false);
              setSubmitted(true);
              modalRef.current?.close();
            }}
          >
            {({ isSubmitting, setFieldValue, submitForm, values, dirty }) => {
              useEffect(() => {
                if (dirty) {
                  onChange({ ...values });
                }
              }, [values, dirty]);

              return (
                <>
                  <Modal.Header closeButton={false}>
                    {type === "edit" ? localization.edit : localization.add}{" "}
                    {localization.serviceForm.fieldLabel.requiredEvidence.toLowerCase()}
                  </Modal.Header>

                  <Modal.Content className={styles.modalContent}>
                    <FormikLanguageFieldset
                      as={Textfield}
                      name="title"
                      legend={
                        <TitleWithHelpTextAndTag
                          tagTitle={localization.tag.required}
                        >
                          {localization.serviceForm.fieldLabel.title}
                        </TitleWithHelpTextAndTag>
                      }
                    />

                    <FieldsetDivider />
                    <FormikLanguageFieldset
                      as={Textfield}
                      name="description"
                      legend={
                        <TitleWithHelpTextAndTag
                          tagTitle={localization.tag.required}
                        >
                          {localization.serviceForm.fieldLabel.description}
                        </TitleWithHelpTextAndTag>
                      }
                    />
                    <FieldsetDivider />
                    <FastField
                      as={Textfield}
                      name="validityDuration"
                      label={
                        <TitleWithHelpTextAndTag
                          tagColor="info"
                          tagTitle={localization.tag.recommended}
                          helpText={
                            localization.serviceForm.helptext.validityDuration
                          }
                        >
                          {localization.serviceForm.fieldLabel.validityDuration}
                        </TitleWithHelpTextAndTag>
                      }
                      size="sm"
                    />
                    <FieldsetDivider />
                    <Checkbox.Group
                      onChange={(values) => setFieldValue("language", values)}
                      value={values.language ?? []}
                      legend={
                        <TitleWithHelpTextAndTag
                          tagColor="info"
                          tagTitle={localization.tag.recommended}
                          helpText={localization.serviceForm.helptext.language}
                        >
                          {localization.serviceForm.fieldLabel.language}
                        </TitleWithHelpTextAndTag>
                      }
                      size="sm"
                    >
                      {languages.map((lang) => (
                        <Checkbox key={lang.uri} value={lang.uri}>
                          {getTranslateText(lang.label)}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                    <FieldsetDivider />
                    <FastField
                      as={Textfield}
                      name="page"
                      label={
                        <TitleWithHelpTextAndTag
                          tagColor="info"
                          tagTitle={localization.tag.recommended}
                          helpText={localization.serviceForm.helptext.page}
                        >
                          {localization.serviceForm.fieldLabel.page}
                        </TitleWithHelpTextAndTag>
                      }
                      size="sm"
                    />
                    <FieldsetDivider />
                    <Radio.Group
                      size="sm"
                      legend={
                        <TitleWithHelpTextAndTag
                          tagColor="info"
                          tagTitle={localization.tag.recommended}
                          helpText={localization.serviceForm.helptext.type}
                        >
                          {localization.serviceForm.fieldLabel.type}
                        </TitleWithHelpTextAndTag>
                      }
                      value={values.type ?? "none"}
                      // onChange={(values) => setFieldValue("type", values.toString())}
                    >
                      <Radio value="none">{localization.none}</Radio>
                      {evidenceTypes.map((option) => (
                        <Radio key={option.uri} value={option.uri}>
                          {capitalizeFirstLetter(
                            getTranslateText(option.label),
                          )}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Modal.Content>

                  <Modal.Footer>
                    <Button
                      type="button"
                      disabled={
                        isSubmitting || !dirty || hasNoFieldValues(values)
                      }
                      onClick={() => submitForm()}
                      size="sm"
                    >
                      {type === "new" ? localization.add : localization.update}
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => {
                        onCancel();
                        modalRef.current?.close();
                      }}
                      disabled={isSubmitting}
                      size="sm"
                    >
                      {localization.button.cancel}
                    </Button>
                  </Modal.Footer>
                </>
              );
            }}
          </Formik>
        </Modal.Dialog>
      </Modal.Root>
    </>
  );
};
