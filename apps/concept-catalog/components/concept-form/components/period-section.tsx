import { Fieldset, Textfield } from '@digdir/designsystemet-react';
import { MinusIcon } from '@navikt/aksel-icons';
import { FastField, useFormikContext } from 'formik';
import styles from '../concept-form.module.scss';
import { Concept } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { get, isEqual } from 'lodash';

type PeriodSectionProps = {
  markDirty?: boolean;
  readOnly?: boolean;
};

export const PeriodSection = ({ markDirty, readOnly }: PeriodSectionProps) => {
  const { initialValues, values, errors } = useFormikContext<Concept>();

  const fieldIsChanged = (name: string) => {
    const dirty = !isEqual(get(initialValues, name), get(values, name));
    return markDirty && dirty;
  };

  return (
    <Fieldset
      size='sm'
      legend={
        <TitleWithHelpTextAndTag
          helpText={localization.conceptForm.helpText.period}
          changed={['gyldigFom', 'gyldigTom'].some((field) => fieldIsChanged(field))}
        >
          {localization.conceptForm.fieldLabel.period}
        </TitleWithHelpTextAndTag>
      }
    >
      <div className={styles.periodSection}>
        <FastField
          as={Textfield}
          type='date'
          name='gyldigFom'
          size='sm'
          label='Gyldig fra og med'
          error={errors.gyldigFom}
          readOnly={readOnly}
        />
        <MinusIcon
          title='a11y-title'
          fontSize='1rem'
        />
        <FastField
          as={Textfield}
          type='date'
          name='gyldigTom'
          size='sm'
          label='Gyldig til og med'
          error={errors.gyldigTom}
          min={values.gyldigFom}
          readOnly={readOnly}
        />
      </div>
    </Fieldset>
  );
};
