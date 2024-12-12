import { Dataset, UriWithLabel } from '@catalog-frontend/types';
import { AddButton, DeleteButton, EditButton, FormikLanguageFieldset } from '@catalog-frontend/ui';
import { getTranslateText, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import { Button, Divider, Label, Modal, Radio, Table, Textfield } from '@digdir/designsystemet-react';
import { FastField, Formik, useFormikContext } from 'formik';
import styles from '../../dataset-form.module.css';
import { useRef, useState } from 'react';
import _ from 'lodash';
import { uriWithLabelSchema } from '../../utils/validation-schema';

const hasNoFieldValues = (values: UriWithLabel) => {
  if (!values) return true;
  return _.isEmpty(_.trim(values.uri)) && _.isEmpty(_.pickBy(values.prefLabel, _.identity));
};

const accessRightTypes = ['legalBasisForRestriction', 'legalBasisForProcessing', 'legalBasisForAccess'];

export const AccessRightsUriTable = () => {
  const { setFieldValue, values } = useFormikContext<Dataset>();

  const allLegalBases = [
    ...(values.legalBasisForRestriction ?? []).map((item, index) => ({
      uriWithLabel: item,
      type: 'legalBasisForRestriction',
      index: index,
    })),
    ...(values.legalBasisForProcessing ?? []).map((item, index) => ({
      uriWithLabel: item,
      type: 'legalBasisForProcessing',
      index: index,
    })),
    ...(values.legalBasisForAccess ?? []).map((item, index) => ({
      uriWithLabel: item,
      type: 'legalBasisForAccess',
      index: index,
    })),
  ];

  const getFieldName = (formValues: LegalBasis): string => {
    const fieldMap: Record<string, UriWithLabel[]> = {
      legalBasisForRestriction: values.legalBasisForRestriction ?? [],
      legalBasisForProcessing: values.legalBasisForProcessing ?? [],
      legalBasisForAccess: values.legalBasisForAccess ?? [],
    };

    const fieldArray = fieldMap[formValues.type];
    if (!fieldArray) {
      throw new Error(`Invalid type: ${formValues.type}`);
    }

    return fieldArray.length > 0 && !hasNoFieldValues(fieldArray[0])
      ? `${formValues.type}[${fieldArray.length}]`
      : `${formValues.type}[0]`;
  };

  return (
    <div>
      <Label>{localization.datasetForm.fieldLabel.legalBasis}</Label>

      {allLegalBases && allLegalBases?.length > 0 && !hasNoFieldValues(allLegalBases[0].uriWithLabel) && (
        <Table size='sm'>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>{localization.title}</Table.HeaderCell>
              <Table.HeaderCell>{localization.link}</Table.HeaderCell>
              <Table.HeaderCell>{localization.type}</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {allLegalBases.map(
              (item, i) =>
                item?.uriWithLabel && (
                  <Table.Row key={`${item.type}-tableRow-${i}`}>
                    <Table.Cell>{getTranslateText(item?.uriWithLabel.prefLabel)}</Table.Cell>
                    <Table.Cell>{item?.uriWithLabel.uri}</Table.Cell>
                    <Table.Cell>{localization.datasetForm.fieldLabel[item?.type]}</Table.Cell>
                    <Table.Cell>
                      <span className={styles.buttonSet}>
                        <FieldModal
                          template={item.uriWithLabel}
                          formType='edit'
                          onSuccess={(updatedItem: LegalBasis) =>
                            setFieldValue(`${updatedItem.type}[${item.index}]`, updatedItem.uriWithLabel)
                          }
                          initialType={item.type}
                        />
                        <DeleteButton onClick={() => setFieldValue(`${item.type}[${item.index}]`, undefined)} />
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ),
            )}
          </Table.Body>
        </Table>
      )}
      <div>
        <FieldModal
          template={{ prefLabel: { nb: '' }, uri: '' }}
          formType='new'
          onSuccess={(formValues: LegalBasis) => setFieldValue(getFieldName(formValues), formValues.uriWithLabel)}
        />
      </div>
    </div>
  );
};

type LegalBasis = {
  type: string;
  uriWithLabel: UriWithLabel;
};

interface ModalProps {
  formType: 'new' | 'edit';
  onSuccess: (values: LegalBasis) => void;
  template: UriWithLabel;
  initialType?: string;
}

const FieldModal = ({ template, formType, onSuccess, initialType = 'legalBasisForRestriction' }: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const [legalBasis, setLegalBasis] = useState<string>(initialType);

  return (
    <>
      <Modal.Root>
        <Modal.Trigger asChild>{formType === 'edit' ? <EditButton /> : <AddButton />}</Modal.Trigger>
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
              onSuccess({ type: legalBasis, uriWithLabel: trimmedValues });
              setSubmitting(false);
              setSubmitted(true);
              modalRef.current?.close();
            }}
          >
            {({ errors, isSubmitting, submitForm, values, dirty }) => (
              <>
                <Modal.Header closeButton={false}>
                  {formType === 'edit'
                    ? `${localization.edit} ${localization.datasetForm.fieldLabel.legalBasis.toLowerCase()}`
                    : `${localization.add} ${localization.datasetForm.fieldLabel.legalBasis.toLowerCase()}`}
                </Modal.Header>

                <Modal.Content>
                  <Radio.Group
                    size='sm'
                    legend={localization.type}
                    onChange={(val) => {
                      const newType = val.toString();
                      setLegalBasis(newType);
                    }}
                    defaultValue={legalBasis}
                  >
                    {accessRightTypes.map((type) => (
                      <Radio
                        key={type}
                        value={type}
                      >
                        {localization.datasetForm.fieldLabel[type]}
                      </Radio>
                    ))}
                  </Radio.Group>

                  <FormikLanguageFieldset
                    as={Textfield}
                    name='prefLabel'
                    legend={localization.title}
                  />
                  <div>
                    <Divider color='subtle' />
                  </div>

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
                    disabled={(isSubmitting || !dirty || hasNoFieldValues(values)) && legalBasis === initialType}
                    onClick={() => submitForm()}
                    size='sm'
                  >
                    {formType === 'new' ? localization.add : localization.datasetForm.button.update}
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
