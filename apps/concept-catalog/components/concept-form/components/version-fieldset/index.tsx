import { FastField, useFormikContext } from 'formik';
import { ErrorMessage, Fieldset, Textfield } from '@digdir/designsystemet-react';
import styles from './version-fieldset.module.scss';
import { Concept } from '@catalog-frontend/types';
import _ from 'lodash';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';

export type VersionFieldsetProps = {
  name: string;
};

export const VersionFieldset = ({ name }) => {
  const { errors } = useFormikContext<Concept>();

  return (
    <>
      <Fieldset
        legend={
          <TitleWithHelpTextAndTag helpText={localization.conceptForm.helpText.versionNumber}>
            {localization.conceptForm.fieldLabel.versionNumber}
          </TitleWithHelpTextAndTag>
        }
      >
        <div className={styles.versionFieldset}>
          <FastField
            as={Textfield}
            type='number'
            label='Major'
            size='sm'
            name={`${name}.major`}
            error={typeof _.get(errors, name) === 'string'}
          />
          <FastField
            as={Textfield}
            type='number'
            label='Minor'
            size='sm'
            name={`${name}.minor`}
            error={typeof _.get(errors, name) === 'string'}
          />
          <FastField
            as={Textfield}
            type='number'
            label='Patch'
            size='sm'
            name={`${name}.patch`}
            error={typeof _.get(errors, name) === 'string'}
          />
        </div>
      </Fieldset>
      {typeof _.get(errors, name) === 'string' ? (
        <ErrorMessage size='sm'>{_.get(errors, name)}</ErrorMessage>
      ) : undefined}
    </>
  );
};
