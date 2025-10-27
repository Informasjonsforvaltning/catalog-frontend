import { FastField, useFormikContext } from 'formik';
import { Textfield } from '@digdir/designsystemet-react';
import { Concept } from '@catalog-frontend/types';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from '../concept-form.module.scss';

type ValueRangeSectionProps = {
  changed?: string[];
  readOnly?: boolean;
};

export const ValueRangeSection = ({ changed, readOnly = false }: ValueRangeSectionProps) => {
  const { errors } = useFormikContext<Concept>();

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
              changed={changed?.includes('omfang.tekst')}
            >
              {localization.conceptForm.fieldLabel.valueRangeDescription}
            </TitleWithHelpTextAndTag>
          }
          error={(errors?.omfang as any)?.['tekst']}
          readOnly={readOnly}
        />
        <FastField
          as={Textfield}
          size='sm'
          name='omfang.uri'
          label={
            <TitleWithHelpTextAndTag changed={changed?.includes('omfang.uri')}>
              {localization.conceptForm.fieldLabel.valueRangeLink}
            </TitleWithHelpTextAndTag>
          }
          error={(errors?.omfang as any)?.['uri']}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};
