import { FastField, useFormikContext } from 'formik';
import { Textfield } from '@digdir/designsystemet-react';
import { Concept } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from '../concept-form.module.scss';

export const ValueRangeSection = () => {
  const { errors } = useFormikContext<Concept>();

  return (
    <div>
      <div className={styles.fieldSet}>
        <FastField
          as={Textfield}
          size='sm'
          name='omfang.tekst'
          label={
            <TitleWithHelpTextAndTag helpText={localization.conceptForm.helpText.valueRange}>
              {localization.conceptForm.fieldLabel.valueRangeDescription}
            </TitleWithHelpTextAndTag>
          }
          error={errors?.omfang?.['tekst']}
        />
        <FastField
          as={Textfield}
          size='sm'
          name='omfang.uri'
          label={localization.conceptForm.fieldLabel.valueRangeLink}
          error={errors?.omfang?.['uri']}
        />
      </div>
    </div>
  );
};
