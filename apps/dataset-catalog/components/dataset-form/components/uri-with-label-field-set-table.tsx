import { UriWithLabel } from '@catalog-frontend/types';
import {
  AddButton,
  DeleteButton,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  FormHeading,
} from '@catalog-frontend/ui';
import { getTranslateText, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Modal, Table, Textfield } from '@digdir/designsystemet-react';
import { FastField, FieldArray, Formik } from 'formik';
import styles from '../dataset-form.module.css';
import { ReactNode, useRef, useState } from 'react';
import { trim, isEmpty, pickBy, identity } from 'lodash';
import { uriWithLabelSchema } from '../utils/validation-schema';

interface Props {
  values: UriWithLabel[] | undefined;
  fieldName: string;
  label?: string | ReactNode;
}

interface ModalProps {
  fieldName: string;
  type: 'new' | 'edit';
  onSuccess: (values: UriWithLabel) => void;
  template: UriWithLabel;
}

const hasNoFieldValues = (values: UriWithLabel) => {
  if (!values) return true;
  return isEmpty(trim(values.uri)) && isEmpty(pickBy(values.prefLabel, identity));
};

export const UriWithLabelFieldsetTable = ({ fieldName, values, label }: Props) => {
  return (
    <div className={styles.fieldContainer}>
      {typeof label === 'string' ? <FormHeading>{label}</FormHeading> : label}
      <FieldArray
        name={fieldName}
        render={(arrayHelpers) => (
          <>
            <Table
              size='sm'
              className={styles.table}
            >
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>{localization.title}</Table.HeaderCell>
                  <Table.HeaderCell>{localization.link}</Table.HeaderCell>
                  <Table.HeaderCell aria-label='Actions' />
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {values?.map((item, index) => (
                  <Table.Row key={`${fieldName}-tableRow-${index}`}>
                    <Table.Cell>{getTranslateText(item?.prefLabel)}</Table.Cell>
                    <Table.Cell>{item?.uri}</Table.Cell>
                    <Table.Cell>
                      <span className={styles.set}>
                        <FieldModal
                          fieldName={fieldName}
                          template={item}
                          type={'edit'}
                          onSuccess={(updatedItem: UriWithLabel) => arrayHelpers.replace(index, updatedItem)}
                        />
                        <DeleteButton onClick={() => arrayHelpers.remove(index)} />
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div>
              <FieldModal
                fieldName={fieldName}
                template={{ prefLabel: { nb: '' }, uri: '' }}
                type={'new'}
                onSuccess={(formValues) => arrayHelpers.push(formValues)}
              />
            </div>
          </>
        )}
      />
    </div>
  );
};

const FieldModal = ({ fieldName, template, type, onSuccess }: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Modal.Root>
        <Modal.Trigger asChild>
          {type === 'edit' ? (
            <EditButton />
          ) : (
            <AddButton>{`${localization.add} ${localization.datasetForm.fieldLabel?.[fieldName]?.toLowerCase()}`}</AddButton>
          )}
        </Modal.Trigger>
        <Modal.Dialog ref={modalRef}>
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

                <Modal.Content className={styles.modalContent}>
                  <FormikLanguageFieldset
                    as={Textfield}
                    name='prefLabel'
                    legend={localization.title}
                  />
                  <FieldsetDivider />
                  <FastField
                    name='uri'
                    as={Textfield}
                    label={localization.link}
                    error={errors?.uri}
                    size='sm'
                  />
                </Modal.Content>

                <Modal.Footer>
                  <Button
                    type='button'
                    disabled={isSubmitting || !dirty || hasNoFieldValues(values)}
                    onClick={() => submitForm()}
                    size='sm'
                  >
                    {type === 'new' ? localization.add : localization.datasetForm.button.update}
                  </Button>
                  <Button
                    variant='secondary'
                    type='button'
                    onClick={() => modalRef.current?.close()}
                    disabled={isSubmitting}
                    size='sm'
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
