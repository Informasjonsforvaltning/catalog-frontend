import { Output, Service } from '@catalog-frontend/types';
import {
  AddButton,
  DeleteButton,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
} from '@catalog-frontend/ui';
import cn from 'classnames';
import { getTranslateText, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Card, ErrorMessage, Heading, Modal, Paragraph, Textfield } from '@digdir/designsystemet-react';
import { FieldArray, Formik, useFormikContext } from 'formik';
import styles from '../service-form.module.css';
import { useEffect, useRef, useState } from 'react';
import { trim, isEmpty, pickBy, identity } from 'lodash';
import { confirmedProducesSchema, draftProducesSchema } from '../validation-schema';

interface Props {
  error: string | undefined;
  ignoreRequired: boolean;
}

interface ModalProps {
  ignoreRequired: boolean;
  onCancel: () => void;
  onChange: (values: Output) => void;
  onSuccess: (values: Output) => void;
  template: Output;
  type: 'new' | 'edit';
}

const hasNoFieldValues = (values: Output) => {
  if (!values) return true;
  return isEmpty(trim(values.identifier)) && isEmpty(pickBy(values.title, identity));
};

export const ProducesField = (props: Props) => {
  const { error, ignoreRequired } = props;
  const { values, setFieldValue } = useFormikContext<Service>();
  const [snapshot, setSnapshot] = useState<Output[]>(values.produces ?? []);

  return (
    <div className={styles.fieldSet}>
      <TitleWithHelpTextAndTag
        helpText={localization.serviceForm.helptext.produces}
        tagTitle={localization.tag.required}
      >
        {localization.serviceForm.fieldLabel.produces}
      </TitleWithHelpTextAndTag>
      <FieldArray
        name='produces'
        render={(arrayHelpers) => (
          <div className={cn(styles.fieldSet, error && styles.errorBorder)}>
            {values.produces?.map((item, index) => (
              <Card key={`${index}-${item.identifier}`}>
                <div className={styles.heading}>
                  <div className={styles.field}>
                    {!isEmpty(item?.title) && (
                      <>
                        <Heading
                          size='2xs'
                          spacing
                          level={3}
                        >
                          {localization.serviceForm.fieldLabel.title}
                        </Heading>
                        <Paragraph size='sm'>{getTranslateText(item.title)}</Paragraph>
                      </>
                    )}
                  </div>

                  <div className={styles.buttons}>
                    <FieldModal
                      ignoreRequired={ignoreRequired}
                      template={item}
                      type='edit'
                      onSuccess={(updatedItem: Output) => {
                        arrayHelpers.replace(index, updatedItem);
                        setSnapshot([...(values.produces ?? [])]);
                      }}
                      onCancel={() => setFieldValue('produces', snapshot)}
                      onChange={(updatedItem: Output) => arrayHelpers.replace(index, updatedItem)}
                    />
                    <DeleteButton
                      onClick={() => {
                        const newArray = [...(values.produces ?? [])];
                        newArray.splice(index, 1);
                        setFieldValue('produces', newArray);
                        setSnapshot([...newArray]);
                      }}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  {!isEmpty(item?.description) && (
                    <>
                      <Heading
                        size='2xs'
                        spacing
                        level={3}
                      >
                        {localization.serviceForm.fieldLabel.description}
                      </Heading>
                      <Paragraph size='sm'>{getTranslateText(item.description)}</Paragraph>
                    </>
                  )}
                </div>
              </Card>
            ))}

            <div>
              <FieldModal
                ignoreRequired={ignoreRequired}
                template={{ title: {}, description: {}, identifier: '' }}
                type='new'
                onSuccess={() => setSnapshot([...(values.produces ?? [])])}
                onCancel={() => setFieldValue('produces', snapshot)}
                onChange={(updatedItem: Output) => {
                  if (snapshot.length === (values.produces?.length ?? 0)) {
                    arrayHelpers.push(updatedItem);
                  } else {
                    arrayHelpers.replace(snapshot.length, updatedItem);
                  }
                }}
              />
            </div>

            {error && (
              <ErrorMessage
                className={styles.errorMessage}
                size='sm'
              >
                {error}
              </ErrorMessage>
            )}
          </div>
        )}
      />
    </div>
  );
};

const FieldModal = (props: ModalProps) => {
  const { template, type, onSuccess, onCancel, onChange, ignoreRequired } = props;
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Modal.Root>
        <Modal.Trigger asChild>
          {type === 'edit' ? (
            <EditButton />
          ) : (
            <AddButton>{`${localization.add} ${localization.serviceForm.fieldLabel.produces.toLowerCase()}`}</AddButton>
          )}
        </Modal.Trigger>
        <Modal.Dialog ref={modalRef}>
          <Formik
            initialValues={template}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={ignoreRequired ? draftProducesSchema : confirmedProducesSchema}
            onSubmit={(formValues, { setSubmitting }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              onSuccess(trimmedValues);
              setSubmitting(false);
              setSubmitted(true);
              modalRef.current?.close();
            }}
          >
            {({ isSubmitting, submitForm, values, dirty }) => {
              useEffect(() => {
                if (dirty) {
                  onChange({ ...values });
                }
              }, [values, dirty]);

              return (
                <>
                  <Modal.Header closeButton={false}>
                    {type === 'edit' ? localization.edit : localization.add}{' '}
                    {localization.serviceForm.fieldLabel.produces.toLowerCase()}
                  </Modal.Header>

                  <Modal.Content className={styles.modalContent}>
                    <FormikLanguageFieldset
                      as={Textfield}
                      name='title'
                      legend={localization.serviceForm.fieldLabel.title}
                    />

                    <FieldsetDivider />
                    <FormikLanguageFieldset
                      as={Textfield}
                      name='description'
                      legend={localization.serviceForm.fieldLabel.description}
                    />
                  </Modal.Content>

                  <Modal.Footer>
                    <Button
                      type='button'
                      disabled={isSubmitting || !dirty || hasNoFieldValues(values)}
                      onClick={() => submitForm()}
                      size='sm'
                    >
                      {type === 'new' ? localization.add : localization.update}
                    </Button>
                    <Button
                      variant='secondary'
                      type='button'
                      onClick={() => {
                        onCancel();
                        modalRef.current?.close();
                      }}
                      disabled={isSubmitting}
                      size='sm'
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
