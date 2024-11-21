import { Box, Textfield } from '@digdir/designsystemet-react';
import styles from './version-fieldset.module.scss';
import { useFormikContext } from 'formik';

export type VersionFieldsetProps = {
    name: string;
};

export const VersionFieldset = <T,>({ name }) => {
  const { errors, values, setFieldValue } = useFormikContext<T>();

  return (
    <fieldset className={styles.versionFieldset}>
      <Textfield label='Major' size='sm' value={values[`${name}.major`]} />
      <Textfield label='Minor' size='sm' value={values[`${name}.minor`]} />
      <Textfield label='Patch' size='sm' value={values[`${name}.patch`]} />
    </fieldset>
  );
};
