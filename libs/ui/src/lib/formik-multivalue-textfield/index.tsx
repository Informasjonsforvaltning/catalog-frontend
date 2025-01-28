"use client";

import { Box, Chip, ErrorMessage, Textfield, TextfieldProps } from '@digdir/designsystemet-react';
import { AddButton, DeleteButton } from '../button';
import { forwardRef, RefAttributes, useState } from 'react';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import classNames from 'classnames';
import styles from './formik-multivalue-textfield.module.scss';

type FormikMultivalueTextfieldProps = {
  name: string;
  showError?: boolean;
  showDeleteButton?: boolean;
  onDeleteButtonClicked?: () => void;
} & TextfieldProps;

export const FormikMultivalueTextfield = forwardRef<HTMLInputElement, FormikMultivalueTextfieldProps>(
  ({ className, name, showError, showDeleteButton, onDeleteButtonClicked, ...props }, ref) => {
    const { errors, values, setFieldValue } = useFormikContext<Record<string, string[]>>();
    const [inputValue, setInputValue] = useState<string>('');

    const handleOnChangeInputValue = (value: string) => {
      setInputValue(value);
    };

    const handleAddTextValue = () => {
      if (Boolean(inputValue) === true) {
        setFieldValue(name, [...(_.get(values, name) ?? []), inputValue]);
        setInputValue('');
      }
    };

    const handleRemoveTextValue = (index: number) => {
      const newValues = [..._.get(values, name)];
      newValues.splice(index, 1);
      setFieldValue(name, newValues);
    };

    return (
      <>
        <Box className={classNames(styles.fieldBox, className)}>
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
            {...props}
          />
         
            <AddButton
            className={styles.buttons}
              variant='secondary'
              disabled={Boolean(inputValue) === false}
              onClick={() => handleAddTextValue()}
            />
            {showDeleteButton && onDeleteButtonClicked && (
              <DeleteButton
              className={styles.buttons}
                variant='tertiary'
                onClick={() => onDeleteButtonClicked()}
              />
            )}
        </Box>
        <Chip.Group size='sm'>
          {_.get(values, name)?.map((v, i) => (
            <Chip.Removable
              key={`chip-${i}`}
              onClick={() => handleRemoveTextValue(i)}
            >
              {v}
            </Chip.Removable>
          ))}
        </Chip.Group>
        {showError && _.get(errors, name) && <ErrorMessage>{_.get(errors, name)}</ErrorMessage>}
      </>
    );
  },
);
