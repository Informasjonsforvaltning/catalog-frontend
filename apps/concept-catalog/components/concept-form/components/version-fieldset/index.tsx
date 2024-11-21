import { Textfield } from '@digdir/designsystemet-react';
import styles from './version-fieldset.module.scss';
import { FastField } from 'formik';

export type VersionFieldsetProps = {
    name: string;
};

export const VersionFieldset = ({ name }) => {
  return (
    <fieldset className={styles.versionFieldset}>
      <FastField  as={Textfield} type='number' label='Major' size='sm' name={`${name}.major`} />      
      <FastField  as={Textfield}  type='number' label='Minor' size='sm' name={`${name}.minor`} />
      <FastField  as={Textfield}  type='number' label='Patch' size='sm' name={`${name}.patch`} />
    </fieldset>
  );
};
