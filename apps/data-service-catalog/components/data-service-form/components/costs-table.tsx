import { DataService, DataServiceCost, ISOLanguage, ReferenceDataCode } from '@catalog-frontend/types';
import { capitalizeFirstLetter, getTranslateText, localization, trimObjectWhitespace } from '@catalog-frontend/utils';
import {
  Box,
  Button,
  Card,
  Combobox,
  Fieldset,
  Link,
  List,
  Modal,
  Paragraph,
  Tag,
  Textfield,
} from '@digdir/designsystemet-react';
import { FastField, FieldArray, Formik, useFormikContext } from 'formik';
import {
  AddButton,
  EditButton,
  FieldsetDivider,
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
  TextareaWithPrefix,
  DeleteButton,
} from '@catalog-frontend/ui';
import React, { useState, useRef } from 'react';
import { isEmpty, isNumber } from 'lodash';
import styles from '../data-service-form.module.css';
import FieldsetWithDelete from '../../fieldset-with-delete';
import { TrashIcon } from '@navikt/aksel-icons';
import { costValidationSchema } from '../utils/validation-schema';

const DEFAULT_CURRENCY = 'http://publications.europa.eu/resource/authority/currency/NOK';

type Props = {
  currencies?: ReferenceDataCode[];
};

type ModalProps = {
  type: 'new' | 'edit';
  onSuccess: (values: DataServiceCost) => void;
  template: DataServiceCost;
  currencies?: ReferenceDataCode[];
};

const hasNoValueOrDocs = (values: DataServiceCost) => {
  if (!values) return true;
  return !isNumber(values.value) && isEmpty(values.documentation);
};

const sortCurrencies = (currencies?: ReferenceDataCode[]) => {
  const priority = ['JPY', 'ISK', 'SEK', 'DKK', 'GBP', 'USD', 'EUR', 'NOK'];
  return currencies?.sort((a, b) => {
    if (!a.code) return 1;
    if (!b.code) return -1;

    const indexA = priority.indexOf(a.code);
    const indexB = priority.indexOf(b.code);

    if (indexA !== -1 || indexB !== -1) {
      return indexB - indexA;
    }

    return a.code.localeCompare(b.code);
  });
};

export const CostsTable = ({ currencies }: Props) => {
  const { values, setFieldValue } = useFormikContext<DataService>();
  const sortedCurrencies = sortCurrencies(currencies);
  const allowedLanguages = Object.freeze<ISOLanguage[]>(['nb', 'nn', 'en']);

  return (
    <div className={styles.fieldContainer}>
      <TitleWithHelpTextAndTag helpText={localization.dataServiceForm.helptext.costs}>
        {localization.dataServiceForm.fieldLabel.costs}
      </TitleWithHelpTextAndTag>
      {values?.costs?.map((item, i) => (
        <Card
          key={`costs-card-${i}`}
          color='neutral'
        >
          <Card.Content className={styles.costContent}>
            <List.Root>
              <List.Unordered
                style={{
                  listStyle: 'none',
                  paddingLeft: 0,
                }}
              >
                {item.value && (
                  <List.Item>
                    {item.value} {item.currency?.split('/')?.reverse()[0] ?? ''}
                  </List.Item>
                )}

                {item.documentation?.map((doc, docIndex) => (
                  <List.Item key={`costs-${i}-doc-${docIndex}`}>
                    <Link
                      href={doc}
                      target='_blank'
                    >
                      {doc}
                    </Link>
                  </List.Item>
                ))}
              </List.Unordered>
            </List.Root>
            <div>
              <FieldModal
                template={item}
                type={'edit'}
                currencies={sortedCurrencies}
                onSuccess={(updatedItem: DataServiceCost) => setFieldValue(`costs[${i}]`, updatedItem)}
              />

              <Button
                variant='tertiary'
                size='sm'
                color='danger'
                onClick={() => setFieldValue(`costs[${i}]`, undefined)}
              >
                <TrashIcon
                  title='Slett'
                  fontSize='1.5rem'
                />
                {localization.button.delete}
              </Button>
            </div>
          </Card.Content>
          <Card.Footer className={styles.costFooter}>
            <Paragraph>{getTranslateText(item.description)}</Paragraph>
            <Box>
              {allowedLanguages
                .filter((lang) => Object.prototype.hasOwnProperty.call(item.description, lang))
                .map((lang) => (
                  <Tag
                    key={lang}
                    size='sm'
                    color='third'
                  >
                    {localization.language[lang]}
                  </Tag>
                ))}
            </Box>
          </Card.Footer>
        </Card>
      ))}

      <div>
        <FieldModal
          template={{ description: {} }}
          type={'new'}
          currencies={sortedCurrencies}
          onSuccess={(formValues) =>
            setFieldValue(
              values.costs && values?.costs.length > 0 && !hasNoValueOrDocs(values?.costs?.[0])
                ? `costs[${values?.costs?.length}]`
                : `costs[0]`,
              formValues,
            )
          }
        />
      </div>
    </div>
  );
};

const FieldModal = ({ template, type, onSuccess, currencies }: ModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  let showValueField = isNumber(template.value);

  const rmCurrencyIfNoValue = (formValues: DataServiceCost) => {
    if (isNumber(formValues.value)) {
      return formValues;
    }

    return {
      currency: undefined,
      value: undefined,
      documentation: formValues.documentation,
      description: formValues.description,
    };
  };

  return (
    <>
      <Modal.Root>
        <Modal.Trigger asChild>
          {type === 'new' ? (
            <AddButton>{`${localization.add} ${localization.dataServiceForm.fieldLabel.costs.toLowerCase()}`}</AddButton>
          ) : (
            <EditButton />
          )}
        </Modal.Trigger>
        <Modal.Dialog ref={modalRef}>
          <Formik
            initialValues={template}
            validateOnChange={submitted}
            validateOnBlur={submitted}
            validationSchema={costValidationSchema}
            onSubmit={(formValues: DataServiceCost, { setSubmitting }) => {
              const trimmedValues = trimObjectWhitespace(rmCurrencyIfNoValue(formValues));
              onSuccess(trimmedValues);
              setSubmitting(false);
              setSubmitted(true);
              modalRef.current?.close();
            }}
          >
            {({ errors, isSubmitting, submitForm, values, dirty, setFieldValue }) => (
              <>
                <Modal.Header closeButton={false}>
                  {type === 'edit'
                    ? `${localization.edit} ${localization.dataServiceForm.fieldLabel.costs.toLowerCase()}`
                    : `${localization.add} ${localization.dataServiceForm.fieldLabel.costs.toLowerCase()}`}
                </Modal.Header>

                <Modal.Content className={styles.modalContent}>
                  <Fieldset
                    legend={
                      <TitleWithHelpTextAndTag
                        tagTitle={localization.tag.recommended}
                        helpText={localization.dataServiceForm.helptext.costValue}
                      >
                        {localization.dataServiceForm.fieldLabel.costValue}
                      </TitleWithHelpTextAndTag>
                    }
                  >
                    {showValueField ? (
                      <div className={styles.valueCurrencyFieldset}>
                        <FastField
                          name='value'
                          as={Textfield}
                          size='sm'
                          type={'number'}
                          error={errors?.value}
                        />
                        <Combobox
                          value={[values?.currency ?? DEFAULT_CURRENCY]}
                          portal={false}
                          onValueChange={(selectedValues) => setFieldValue('currency', selectedValues.toString())}
                          size='sm'
                          disabled={!isNumber(values.value)}
                        >
                          {currencies &&
                            currencies.map((currencyRef, i) => (
                              <Combobox.Option
                                key={`currency-${currencyRef.uri}-${i}`}
                                value={currencyRef.uri}
                              >
                                {currencyRef.code} (
                                {capitalizeFirstLetter(getTranslateText(currencyRef.label)?.toString())})
                              </Combobox.Option>
                            ))}
                        </Combobox>
                        <DeleteButton
                          className={styles.deleteButton}
                          onClick={() => {
                            setFieldValue('value', undefined);
                            setFieldValue('currency', undefined);
                            showValueField = false;
                          }}
                        />
                      </div>
                    ) : (
                      <AddButton
                        onClick={() => {
                          setFieldValue('value', 0);
                          setFieldValue('currency', DEFAULT_CURRENCY);
                          showValueField = true;
                        }}
                      >
                        {`${localization.dataServiceForm.fieldLabel.costValue}`}
                      </AddButton>
                    )}
                  </Fieldset>

                  <FieldsetDivider />

                  <Fieldset
                    size='sm'
                    legend={
                      <TitleWithHelpTextAndTag
                        tagTitle={localization.tag.recommended}
                        helpText={localization.dataServiceForm.helptext.costDocumentation}
                      >
                        {localization.dataServiceForm.fieldLabel.costDocumentation}
                      </TitleWithHelpTextAndTag>
                    }
                  >
                    <FieldArray name='documentation'>
                      {(arrayHelpers) => (
                        <>
                          {arrayHelpers.form.values.documentation &&
                            arrayHelpers.form.values.documentation.map((_, index: number) => (
                              <div
                                key={`documentation-${index}`}
                                className={styles.padding}
                              >
                                <FieldsetWithDelete onDelete={() => arrayHelpers.remove(index)}>
                                  <FastField
                                    name={`documentation[${index}]`}
                                    as={Textfield}
                                    size='sm'
                                    error={errors?.documentation?.[index]}
                                  />
                                </FieldsetWithDelete>
                              </div>
                            ))}

                          <AddButton onClick={() => arrayHelpers.push('')}>
                            {`${localization.dataServiceForm.fieldLabel.costDocumentation}`}
                          </AddButton>
                        </>
                      )}
                    </FieldArray>
                  </Fieldset>

                  <FieldsetDivider />

                  <FormikLanguageFieldset
                    name={'description'}
                    as={TextareaWithPrefix}
                    legend={
                      <TitleWithHelpTextAndTag
                        tagTitle={localization.tag.recommended}
                        helpText={localization.dataServiceForm.helptext.costDescription}
                      >
                        {localization.dataServiceForm.fieldLabel.description}
                      </TitleWithHelpTextAndTag>
                    }
                  />
                </Modal.Content>

                <Modal.Footer>
                  <Button
                    type='button'
                    disabled={isSubmitting || !dirty || hasNoValueOrDocs(values)}
                    onClick={() => submitForm()}
                    size='sm'
                  >
                    {type === 'new' ? localization.add : localization.dataServiceForm.button.update}
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
