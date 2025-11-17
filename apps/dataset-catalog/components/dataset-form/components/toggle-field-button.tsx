import { Dataset } from '@catalog-frontend/types';
import { AddButton, FieldsetDivider } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { useFormikContext } from 'formik';
import { PropsWithChildren } from 'react';
import FieldsetWithDelete from '../../fieldset-with-delete';
import styles from '../dataset-form.module.css';
import { Card } from '@digdir/designsystemet-react';

type Props = {
  fieldName: string;
  hasDeleteButton?: boolean;
  onDeleteValue?: any;
  addValue?: any;
  setFocus?: (fieldName: string) => void;
  expanded?: boolean;
  showDivider?: boolean;
} & PropsWithChildren;

export const ToggleFieldButton = ({
  children,
  fieldName,
  hasDeleteButton,
  onDeleteValue = undefined,
  addValue = '',
  setFocus,
  expanded,
  showDivider,
}: Props) => {
  const { setFieldValue } = useFormikContext<Dataset>();

  const handleDelete = () => {
    setFieldValue(fieldName, onDeleteValue);
  };

  return (
    <Card>
      {expanded ? (
        <>
          {hasDeleteButton ? (
            <div className={styles.hiddenField}>
              <FieldsetWithDelete
                onDelete={() => {
                  handleDelete();
                }}
              >
                {children}
              </FieldsetWithDelete>
            </div>
          ) : (
            <div className={styles.hiddenField}>{children}</div>
          )}
          {showDivider && <FieldsetDivider />}
        </>
      ) : (
        <AddButton
          onClick={() => {
            setFieldValue(fieldName, addValue);
            setFocus && setFocus(fieldName);
          }}
        >{`${localization.add} ${localization.datasetForm.fieldLabel[fieldName.split('.')[0]]?.toLowerCase()}`}</AddButton>
      )}
    </Card>
  );
};
