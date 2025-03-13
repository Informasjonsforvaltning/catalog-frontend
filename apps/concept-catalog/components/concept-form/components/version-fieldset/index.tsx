import { FastField, useFormikContext } from 'formik';
import { ErrorMessage, Fieldset, Textfield } from '@digdir/designsystemet-react';
import styles from './version-fieldset.module.scss';
import { Concept } from '@catalog-frontend/types';
import _, { get, isEqual } from 'lodash';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

export type VersionFieldsetProps = {
  name: string;
  markDirty?: boolean;
  readOnly?: boolean;
};

export const VersionFieldset = ({ name, markDirty, readOnly }) => {
  const { errors, initialValues, values } = useFormikContext<Concept>();

  return (
    <>
      <Fieldset
        size='sm'
        legend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.versionNumber}
            changed={markDirty && !isEqual(get(initialValues, name), get(values, name))}
          >
            {localization.conceptForm.fieldLabel.versionNumber}
          </TitleWithHelpTextAndTag>
        }
      >
        <div className={styles.versionFieldset}>
          <FastField
            as={Textfield}
            type='number'
            label='Major'
            min='0'
            size='sm'
            name={`${name}.major`}
            error={typeof _.get(errors, name) === 'string'}
            readOnly={readOnly}
          />
          <FastField
            as={Textfield}
            type='number'
            label='Minor'
            min='0'
            size='sm'
            name={`${name}.minor`}
            error={typeof _.get(errors, name) === 'string'}
            readOnly={readOnly}
          />
          <FastField
            as={Textfield}
            type='number'
            label='Patch'
            min='0'
            size='sm'
            name={`${name}.patch`}
            error={typeof _.get(errors, name) === 'string'}
            readOnly={readOnly}
          />
        </div>
      </Fieldset>
      {typeof _.get(errors, name) === 'string' ? (
        <ErrorMessage size='sm'>{_.get(errors, name)}</ErrorMessage>
      ) : undefined}
    </>
  );
};
