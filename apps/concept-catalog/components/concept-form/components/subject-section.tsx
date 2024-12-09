import { ReactNode } from 'react';
import { FastField, useFormikContext } from 'formik';
import { Combobox, Fieldset, HelpText, Paragraph } from '@digdir/designsystemet-react';
import { Code, Concept } from '@catalog-frontend/types';
import { TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from '../concept-form.module.scss';
import { getParentPath } from '../../../utils/codeList';


type SubjectSectionProps = {
  codes: Code[] | undefined;
};
export const SubjectSection = ({ codes }: SubjectSectionProps) => {
  const { errors, values, setFieldValue } = useFormikContext<Concept>();

  

  const SubjectCombobox = ({ value }: { label: ReactNode; value: string[] }) => (
    <Combobox
      multiple
      size='sm'
      value={values.fagområdeKoder}
      onValueChange={(value) => setFieldValue('fagområdeKoder', value)}
    >
      <Combobox.Empty>Fant ingen treff</Combobox.Empty>
      {codes?.map((code, index, array) => {
        const parentPath = getParentPath(code, codes);
        return (
          <Combobox.Option
            key={code.id}
            value={code.id}
            description={parentPath.length > 0 ? `Overordnet: ${parentPath.join(' - ')}` : ''}
          >
            {code.name.nb}
          </Combobox.Option>
        );
      })}
    </Combobox>
  );

  return (
    <div>
      <div className={styles.fieldSet}>
        <Fieldset legend={
            <TitleWithTag
              title={
                <>
                  {localization.conceptForm.fieldLabel.subjectLabel}
                  <HelpText
                    title={localization.conceptForm.fieldLabel.subjectLabel}
                    size='sm'
                    type='button'
                  >
                    <Paragraph size='sm'>
                      Fagområde (spesialkunnskapsfelt) kan representere en akademisk disiplin, et bruksområde, et
                      produkt, en tjenestekjede eller lignende.
                    </Paragraph>
                  </HelpText>
                </>
              }
              tagTitle={localization.tag.recommended}
              tagColor='info'
            />
          }>
        <FastField
          as={SubjectCombobox}
          name='fagområde'
          error={errors?.fagområde}
        />
        </Fieldset>
      </div>
    </div>
  );
};
