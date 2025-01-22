import { DateRange } from '@catalog-frontend/types';
import { AddButton, DeleteButton, EditButton } from '@catalog-frontend/ui';
import { localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Heading, Modal, Table, Textfield } from '@digdir/designsystemet-react';
import { FastField, Formik, useFormikContext } from 'formik';
import styles from '../../dataset-form.module.css';
import { ReactNode, useRef, useState } from 'react';
import _ from 'lodash';

interface Props {
  values: DateRange[] | undefined;
  label?: string | ReactNode;
}

interface ModalProps {
  type: 'new' | 'edit';
  onSuccess: (values: DateRange) => void;
  template: DateRange;
}

const hasNoFieldValues = (values: DateRange) => {
  if (!values) return true;
  return _.isEmpty(values.startDate) && _.isEmpty(values.endDate);
};

export const TemporalModal = ({ values, label }: Props) => {
  const { setFieldValue } = useFormikContext();

  return (
    <div className={styles.fieldContainer}>
      {typeof label === 'string' ? <Heading size='2xs'>{label}</Heading> : label}
      {values && values?.length > 0 && !hasNoFieldValues(values[0]) && (
        <Table
          size='sm'
          className={styles.fullWidth}
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
                <Table.Cell>{item?.startDate}</Table.Cell>
                <Table.Cell>{item?.endDate}</Table.Cell>
                <Table.Cell>
                  <span className={styles.set}>
                    <FieldModal
                      template={item}
                      type={'edit'}
                      onSuccess={(updatedItem: DateRange) => setFieldValue(`temporal[${index}]`, updatedItem)}
                    />
                    <DeleteButton onClick={() => setFieldValue(`temporal[${index}]`, undefined)} />
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
          onSuccess={(formValues) =>
            setFieldValue(
              values && values?.length > 0 && !hasNoFieldValues(values[0])
                ? `temporal[${values?.length}]`
                : `temporal[0]`,
              formValues,
            )
          }
        />
      </div>
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
            //validationSchema={uriWithLabelSchema}
            onSubmit={(formValues, { setSubmitting }) => {
              const trimmedValues = trimObjectWhitespace(formValues);
              onSuccess(trimmedValues);
              setSubmitting(false);
              setSubmitted(true);
              modalRef.current?.close();
            }}
          >
            {({ isSubmitting, submitForm, values, dirty }) => (
              <>
                <Modal.Header closeButton={false}>
                  {type === 'edit' ? `${localization.edit} ` : `${localization.add} `}
                </Modal.Header>

                <Modal.Content>
                  <FastField
                    as={Textfield}
                    size='sm'
                    label={localization.from}
                    type='date'
                    name={`startDate`}
                  />

                  <FastField
                    as={Textfield}
                    size='sm'
                    label={localization.to}
                    type='date'
                    name={`endDate`}
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
