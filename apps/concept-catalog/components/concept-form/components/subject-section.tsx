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

  const selected = values.fagområdeKoder?.filter(v => codes?.find(code => code.id === v));

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
          <Combobox
            multiple
            size='sm'
            value={selected ?? []}
            onValueChange={(value) => setFieldValue('fagområdeKoder', value)}
            error={errors.fagområdeKoder}
          >
            <Combobox.Empty>Fant ingen treff</Combobox.Empty>
            {codes?.map((code) => {
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
        </Fieldset>
      </div>
    </div>
  );
};
