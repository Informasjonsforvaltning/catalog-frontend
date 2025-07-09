import { DateRange } from '@catalog-frontend/types';
import { AddButton, DeleteButton, EditButton, FormHeading } from '@catalog-frontend/ui';
import { formatDateToDDMMYYYY, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Modal, Table, Textfield } from '@digdir/designsystemet-react';
import { FastField, FieldArray, Formik } from 'formik';
import styles from '../../dataset-form.module.css';
import { ReactNode, useRef, useState } from 'react';
import { get, isEmpty } from 'lodash';
import { dateSchema } from '../../utils/validation-schema';
import cn from 'classnames';
import { MinusIcon } from '@navikt/aksel-icons';

interface Props {
  values: DateRange[] | undefined;
  label?: string | ReactNode;
  errors?: any;
}

interface ModalProps {
  type: 'new' | 'edit';
  onSuccess: (values: DateRange) => void;
  template: DateRange;
}

const hasNoFieldValues = (values: DateRange) => {
  if (!values) return true;
  return isEmpty(values.startDate) && isEmpty(values.endDate);
};

export const TemporalModal = ({ values, label, errors }: Props) => {
  return (
    <div className={styles.fieldContainer}>
      {typeof label === 'string' ? <FormHeading>{label}</FormHeading> : label}
      <FieldArray
        name={'temporal'}
        render={(arrayHelpers) => (
          <div className={get(errors, `temporal`) ? styles.errorBorder : undefined}>
            {values && values?.length > 0 && (
              <Table
                size='sm'
                className={styles.table}
              >
                <Table.Head>
                  <Table.Row>
                    <Table.HeaderCell>{localization.from}</Table.HeaderCell>
                    <Table.HeaderCell>{localization.to}</Table.HeaderCell>
                    <Table.HeaderCell aria-label='Actions' />
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {values?.map((item, index) => (
                    <Table.Row key={`temporal-tableRow-${index}`}>
                      <Table.Cell>{item?.startDate ? formatDateToDDMMYYYY(item.startDate) : '-'}</Table.Cell>
                      <Table.Cell>{item?.endDate ? formatDateToDDMMYYYY(item.endDate) : '-'}</Table.Cell>
                      <Table.Cell>
                        <span className={styles.set}>
                          <FieldModal
                            template={item}
                            type={'edit'}
                            onSuccess={(updatedItem: DateRange) => arrayHelpers.replace(index, updatedItem)}
                          />
                          <DeleteButton onClick={() => arrayHelpers.remove(index)} />
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
            <div>
              <FieldModal
                template={{ startDate: '', endDate: '' }}
                type={'new'}
                onSuccess={(formValues) => arrayHelpers.push(formValues)}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

const FieldModal = ({ template, type, onSuccess }: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Modal.Root>
        <Modal.Trigger asChild>
          {type === 'edit' ? <EditButton /> : <AddButton>{localization.datasetForm.button.addDate}</AddButton>}
        </Modal.Trigger>
        <Modal.Dialog ref={modalRef}>
          <Formik
            initialValues={template}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={dateSchema}
            onSubmit={(formValues, { setSubmitting }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              onSuccess(trimmedValues);
              setSubmitting(false);
              setSubmitted(true);
              modalRef.current?.close();
            }}
          >
            {({ isSubmitting, submitForm, values, dirty, errors }) => {
              return (
                <>
                  <Modal.Header closeButton={false}>
                    {type === 'edit' ? `${localization.edit} ` : `${localization.add} `}
                  </Modal.Header>

                  <Modal.Content className={cn(styles.modalContent, styles.calendar)}>
                    <FastField
                      as={Textfield}
                      size='sm'
                      label={localization.from}
                      type='date'
                      name={`startDate`}
                      error={errors.startDate}
                    />

                    <MinusIcon
                      title='minus-icon'
                      fontSize='1rem'
                    />

                    <FastField
                      as={Textfield}
                      size='sm'
                      label={localization.to}
                      type='date'
                      name={`endDate`}
                      error={errors.endDate}
                      min={values.startDate}
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
              );
            }}
          </Formik>
        </Modal.Dialog>
      </Modal.Root>
    </>
  );
};
