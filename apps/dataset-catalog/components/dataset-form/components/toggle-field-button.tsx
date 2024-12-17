import { Dataset } from '@catalog-frontend/types';
import { AddButton } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { useFormikContext } from 'formik';
import { PropsWithChildren, useMemo, useState } from 'react';
import FieldsetWithDelete from '../../fieldset-with-delete';
import _ from 'lodash';

type Props = {
  fieldName: string;
  fieldValues: any;
  hasDeleteButton?: boolean;
  onDeleteValue?: any;
  addValue?: any;
} & PropsWithChildren;

export const ToggleFieldButton = ({
  children,
  fieldName,
  hasDeleteButton,
  onDeleteValue = undefined,
  addValue = '',
  fieldValues,
}: Props) => {
  const { setFieldValue } = useFormikContext<Dataset>();

  const shouldShowField = useMemo(() => {
    if (fieldName === 'qualifiedAttributions' && _.isArray(fieldValues) && fieldValues.length === 0) {
      return true;
    }

    if (_.isArray(fieldValues)) return fieldValues.length > 0;
    if (_.isObject(fieldValues)) return !_.isEmpty(fieldValues);
    return !_.isNil(fieldValues);
  }, [fieldValues, fieldName]);

  const handleDelete = () => {
    setFieldValue(fieldName, onDeleteValue);
  };

  return (
    <div>
      {shouldShowField ? (
        hasDeleteButton ? (
          <FieldsetWithDelete
            onDelete={() => {
              handleDelete();
            }}
          >
            {children}
          </FieldsetWithDelete>
        ) : (
          children
        )
      ) : (
        <AddButton
          onClick={() => {
            setFieldValue(fieldName, addValue);
          }}
        >{`${localization.add} ${fieldName}`}</AddButton>
      )}
    </div>
  );
};
