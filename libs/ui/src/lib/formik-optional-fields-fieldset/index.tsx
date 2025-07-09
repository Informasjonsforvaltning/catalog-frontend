'use client';

import { Fieldset, Box, Card, ErrorMessage } from '@digdir/designsystemet-react';
import { useFormikContext } from 'formik';

import styles from './formik-optional-fields-fieldset.module.scss';
import { LocalizedStrings } from '@catalog-frontend/types';
import { AddButton, DeleteButton } from '../button';
import { get } from 'lodash';
import React, { ReactNode, useEffect, useState } from 'react';
import { FastFieldWithRef } from '../formik-fast-field-with-ref';

type OptionalFieldsFieldsetProps = {
  legend?: ReactNode;
  availableFields: { valuePath: string; label: string; legend?: ReactNode }[];
  errorPath?: string;
};

export const FormikOptionalFieldsFieldset = ({ legend, availableFields, errorPath }: OptionalFieldsFieldsetProps) => {
  const { errors, getFieldMeta, setFieldValue } = useFormikContext<Record<string, LocalizedStrings>>();
  const [focus, setFocus] = useState<string | null>();
  const fieldRefs = availableFields.reduce(
    (map, field) => {
      map[field.valuePath] = React.createRef<HTMLInputElement | HTMLTextAreaElement>();
      return map;
    },
    {} as Record<string, React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>>,
  );

  const handleAddField = (fieldName: string) => {
    setFieldValue(fieldName, '');
    setFocus(fieldName);
  };

  const handleRemoveField = (fieldName: string) => {
    setFieldValue(fieldName, undefined);
  };

  const visibleFields = availableFields.filter((field) => {
    const metadata = getFieldMeta(field.valuePath);
    return metadata.value !== undefined;
  });

  const mainError = errorPath ? get(errors, errorPath) : undefined;

  const visibleFieldButtons = availableFields.filter((field) => !visibleFields.includes(field));

  useEffect(() => {
    if (focus) {
      fieldRefs[focus]?.current?.focus();
      setFocus(null);
    }
  }, [focus, fieldRefs]);

  return (
    <Fieldset
      className={styles.fieldset}
      legend={legend}
      size='sm'
    >
      <Card>
        <Card.Content>
          {visibleFields.map((field) => (
            <Fieldset
              key={field.valuePath}
              legend={field?.legend ?? field?.label}
            >
              <Box
                key={field.valuePath}
                className={styles.field}
              >
                <FastFieldWithRef
                  ref={fieldRefs[field.valuePath]}
                  name={field.valuePath}
                  aria-label={field.label}
                  error={get(errors, field.valuePath)}
                />
                <DeleteButton onClick={() => handleRemoveField(field.valuePath)} />
              </Box>
            </Fieldset>
          ))}
          <div className={styles.addButtons}>
            {visibleFieldButtons.map((field) => (
              <AddButton
                key={field.valuePath}
                onClick={() => handleAddField(field.valuePath)}
              >
                {field.label}
              </AddButton>
            ))}
          </div>
          {typeof mainError === 'string' && <ErrorMessage size={'sm'}>{mainError}</ErrorMessage>}
        </Card.Content>
      </Card>
    </Fieldset>
  );
};
