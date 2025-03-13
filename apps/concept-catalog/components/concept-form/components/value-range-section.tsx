import { FastField, useFormikContext } from 'formik';
import { Textfield } from '@digdir/designsystemet-react';
import { Concept } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from '../concept-form.module.scss';
import { get, isEqual } from 'lodash';

type ValueRangeSectionProps = {
  markDirty?: boolean;
  readOnly?: boolean;
};

export const ValueRangeSection = ({ markDirty = false, readOnly = false }: ValueRangeSectionProps) => {
  const { initialValues, values, errors } = useFormikContext<Concept>();

  return (
    <div>
      <div className={styles.fieldSet}>
        <FastField
          as={Textfield}
          size='sm'
          name='omfang.tekst'
          label={
            <TitleWithHelpTextAndTag
              helpText={localization.conceptForm.helpText.valueRange}
              changed={markDirty && !isEqual(get(initialValues, 'omfang.tekst'), get(values, 'omfang.tekst'))}
            >
              {localization.conceptForm.fieldLabel.valueRangeDescription}
            </TitleWithHelpTextAndTag>
          }
          error={errors?.omfang?.['tekst']}
          readOnly={readOnly}
        />
        <FastField
          as={Textfield}
          size='sm'
          name='omfang.uri'
          label={
            <TitleWithHelpTextAndTag
              changed={markDirty && !isEqual(get(initialValues, 'omfang.uri'), get(values, 'omfang.uri'))}
            >
              {localization.conceptForm.fieldLabel.valueRangeLink}
            </TitleWithHelpTextAndTag>
          }
          error={errors?.omfang?.['uri']}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};
