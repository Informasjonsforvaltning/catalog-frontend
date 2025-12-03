'use client';

import { Chip, ValidationMessage, Label, Textfield, TextfieldProps } from '@digdir/designsystemet-react';
import { AddButton, DeleteButton } from '../button';
import { forwardRef, ReactNode, useState, ChangeEvent, KeyboardEvent } from 'react';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './formik-multivalue-textfield.module.scss';

type FormikMultivalueTextfieldProps = {
  name: string;
  showDeleteButton?: boolean;
  readOnly?: boolean;
  error?: ReactNode;
  onDeleteButtonClicked?: () => void;
} & TextfieldProps;

const FormikMultivalueTextfield = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormikMultivalueTextfieldProps>(
  (
    {
      className,
      name,
      showDeleteButton,
      readOnly,
      error,
      onDeleteButtonClicked,
      ...props
    },
    ref,
  ) => {
    const { values, setFieldValue } = useFormikContext<Record<string, string[]>>();
    const [inputValue, setInputValue] = useState<string>('');

    const handleOnChangeInputValue = (value: string) => {
      setInputValue(value);
    };

    const handleAddTextValue = () => {
      if (readOnly) {
        return;
      }

      if (Boolean(inputValue) === true) {
        setFieldValue(name, [...(_.get(values, name) ?? []), inputValue]);
        setInputValue('');
      }
    };

    const handleRemoveTextValue = (index: number) => {
      if (readOnly) {
        return;
      }
      const newValues = [..._.get(values, name)];
      newValues.splice(index, 1);
      setFieldValue(name, newValues);
    };

    const ChipComponent = readOnly ? Chip.Checkbox : Chip.Removable;

    return (
      <>
        <div className={classNames(styles.fieldBox, className)}>
          {!readOnly && (
            <>
              <Textfield
                ref={ref}
                data-size='sm'
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleOnChangeInputValue(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  if (e.code === 'Enter') {
                    e.preventDefault();
                    handleAddTextValue();
                  }
                }}
                onBlur={() => handleAddTextValue()}
                readOnly={readOnly}
                error={Boolean(error)}
                {...props}
              />
              <AddButton
                className={styles.buttons}
                variant='secondary'
                disabled={readOnly || Boolean(inputValue) === false}
                onClick={() => handleAddTextValue()}
              />
            </>
          )}
          {!readOnly && showDeleteButton && onDeleteButtonClicked && (
            <DeleteButton
              className={styles.buttons}
              variant='tertiary'
              onClick={() => onDeleteButtonClicked()}
            />
          )}
        </div>
        {readOnly && props.label && (
          <Label
            asChild
            data-size='sm'
          >
            <div>{props.label}</div>
          </Label>
        )}
        <div className={styles.chipGroup}>
          {_.get(values, name)?.map((v, i) => (
            <ChipComponent
              key={`chip-${i}`}
              onClick={readOnly ? undefined : () => handleRemoveTextValue(i)}
            >
              {v}
            </ChipComponent>
          ))}
        </div>
        {error && <ValidationMessage>{error}</ValidationMessage>}
      </>
    );
  },
);

FormikMultivalueTextfield.displayName = 'FormikMultivalueTextfield';
export { FormikMultivalueTextfield };
