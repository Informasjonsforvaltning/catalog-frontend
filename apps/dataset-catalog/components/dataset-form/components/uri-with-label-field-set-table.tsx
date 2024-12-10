import { UriWithLabel } from '@catalog-frontend/types';
import { AddButton, DeleteButton, EditButton, FormikLanguageFieldset } from '@catalog-frontend/ui';
import { getTranslateText, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Divider, Label, Modal, Table, Textfield } from '@digdir/designsystemet-react';
import { Field, Formik, useFormikContext } from 'formik';
import styles from '../dataset-form.module.css';
import { useRef, useState } from 'react';
import _ from 'lodash';
import { uriWithLabelSchema } from '../utils/validation-schema';

interface Props {
  values: UriWithLabel[] | undefined;
  fieldName: string;
}

interface ModalProps {
  fieldName: string;
  type: 'new' | 'edit';
  onSuccess: (values: UriWithLabel) => void;
  template: UriWithLabel;
}

const hasNoFieldValues = (values: UriWithLabel) => {
  if (!values) return true;
  return _.isEmpty(_.trim(values.uri)) && _.isEmpty(_.pickBy(values.prefLabel, _.identity));
};

export const UriWithLabelFieldsetTable = ({ fieldName, values }: Props) => {
  const { setFieldValue } = useFormikContext();

  return (
    <>
      <Label>{localization.datasetForm.fieldLabel[fieldName]}</Label>
      {values && values?.length > 0 && !hasNoFieldValues(values[0]) && (
        <Table size='sm'>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>{localization.title}</Table.HeaderCell>
              <Table.HeaderCell>{localization.link}</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {values?.map((item, index) => (
              <Table.Row key={`${fieldName}-tableRow-${index}`}>
                <Table.Cell>{getTranslateText(item?.prefLabel)}</Table.Cell>
                <Table.Cell>{item?.uri}</Table.Cell>
                <Table.Cell>
                  <span className={styles.buttonSet}>
                    <FieldModal
                      fieldName={fieldName}
                      template={values[index]}
                      type={'edit'}
                      onSuccess={(updatedItem: UriWithLabel) => setFieldValue(`${fieldName}[${index}]`, updatedItem)}
                    />
                    <DeleteButton onClick={() => setFieldValue(`${fieldName}[${index}]`, undefined)} />
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      <div>
        <FieldModal
          fieldName={fieldName}
          template={{ prefLabel: { nb: '' }, uri: '' }}
          type={'new'}
          onSuccess={(formValues) =>
            setFieldValue(
              values && values?.length > 0 && !hasNoFieldValues(values[0])
                ? `${fieldName}[${values?.length}]`
                : `${fieldName}[0]`,
              formValues,
            )
          }
        />
      </div>
    </>
  );
};

const FieldModal = ({ fieldName, template, type, onSuccess }: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Modal.Root>
        <Modal.Trigger asChild>{type === 'edit' ? <EditButton /> : <AddButton />}</Modal.Trigger>
        <Modal.Dialog
          ref={modalRef}
          className={styles.dialog}
        >
          <Formik
            initialValues={template}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={uriWithLabelSchema}
            onSubmit={(formValues, { setSubmitting }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              onSuccess(trimmedValues);
              setSubmitting(false);
              setSubmitted(true);
              modalRef.current?.close();
            }}
          >
            {({ errors, isSubmitting, submitForm, values, dirty }) => (
              <>
                <Modal.Header closeButton={false}>
                  {type === 'edit'
                    ? `${localization.edit} ${getTranslateText(localization.datasetForm.fieldLabel[fieldName])?.toString().toLowerCase()}`
                    : `${localization.add} ${getTranslateText(localization.datasetForm.fieldLabel[fieldName])?.toString().toLowerCase()}`}
                </Modal.Header>

                <Modal.Content>
                  <FormikLanguageFieldset
                    as={Textfield}
                    name='prefLabel'
                    legend={localization.title}
                  />
                  <div>
                    <Divider color='subtle' />
                  </div>

                  <Field
                    name='uri'
                    as={Textfield}
                    label={localization.link}
                    error={errors?.uri}
                  />
                </Modal.Content>

                <Modal.Footer>
                  <Button
                    type='button'
                    disabled={isSubmitting || !dirty || hasNoFieldValues(values)}
                    onClick={() => submitForm()}
                  >
                    {type === 'new' ? localization.add : localization.datasetForm.button.update}
                  </Button>
                  <Button
                    variant='secondary'
                    type='button'
                    onClick={() => modalRef.current?.close()}
                    disabled={isSubmitting}
                  >
                    {localization.button.cancel}
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Formik>
        </Modal.Dialog>
      </Modal.Root>
    </>
  );
};
