'use client';

import { Box, Chip, ErrorMessage, Label, Textfield, TextfieldProps } from '@digdir/designsystemet-react';
import { AddButton, DeleteButton } from '../button';
import { forwardRef, ReactNode, useState } from 'react';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './formik-multivalue-textfield.module.scss';

type FormikMultivalueTextfieldProps = {
  name: string;
  showDeleteButton?: boolean;
  readOnly?: boolean;
  allowDeleteWhenReadOnly?: boolean;
  error?: ReactNode;
  onDeleteButtonClicked?: () => void;  
} & TextfieldProps;

const FormikMultivalueTextfield = forwardRef<HTMLInputElement, FormikMultivalueTextfieldProps>(
  ({ allowDeleteWhenReadOnly, className, name, showDeleteButton, readOnly, label, error, onDeleteButtonClicked, ...props }, ref) => {
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

    const ChipComponent = readOnly ? Chip.Toggle : Chip.Removable;

    return (
      <>
        <Box className={classNames(styles.fieldBox, className)}>
          {!readOnly && (
            <>
              <Textfield
                ref={ref}
                size='sm'
                value={inputValue}
                onChange={(e) => handleOnChangeInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.code === 'Enter') {
                    handleAddTextValue();
                  }
                }}
                onBlur={() => handleAddTextValue()}
                readOnly={readOnly}
                label={label}
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
              disabled={!allowDeleteWhenReadOnly}
            />
          )}
        </Box>
        {readOnly && label && (
          <Label asChild>
            <div>{label}</div>
          </Label>
        )}
        <Chip.Group
          size='sm'
          className={styles.chipGroup}
        >
          {_.get(values, name)?.map((v, i) => (
            <ChipComponent
              key={`chip-${i}`}            
              onClick={readOnly ? undefined : () => handleRemoveTextValue(i)}              
            >
              {v}
            </ChipComponent>
          ))}
        </Chip.Group>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </>
    );
  },
);

FormikMultivalueTextfield.displayName = 'FormikMultivalueTextfield';
export { FormikMultivalueTextfield };
