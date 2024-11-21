import { Code, Concept, TreeNode } from '@catalog-frontend/types';
import { TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Combobox, HelpText, Paragraph } from '@digdir/designsystemet-react';
import { FastField, useFormikContext } from 'formik';
import styles from '../concept-form.module.scss';
import { ReactNode } from 'react';

type SubjectSectionProps = {
  codes: Code[] | undefined;
};
export const SubjectSection = ({ codes }: SubjectSectionProps) => {
  const { errors } = useFormikContext<Concept>();

  const getParentPath = (code: Code, path: string[] = []) => {
    if (code.parentID) {
      const parent = codes?.find((match) => match.id === code.parentID);
      if (parent) {
        path.push(parent.name.nb);
        getParentPath(parent, path);
      }
    }
    return path.reverse();
  };

  const SubjectCombobox = ({ label, value }: { label: ReactNode; value: string[] }) => (
    <Combobox
      multiple
      size='sm'
      value={[]}
      label={label}
    >
      <Combobox.Empty>Fant ingen treff</Combobox.Empty>
      {codes?.map((code, index, array) => {
        const parentPath = getParentPath(code);
        return (
          <Combobox.Option
            key={code.id}
            value={code.id}
            description={parentPath.length > 0 ? `Overordnet: ${getParentPath(code).join(' - ')}` : ''}
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
        <FastField
          as={SubjectCombobox}
          name='fagområde'
          label={
            <TitleWithTag
              title={
                <>
                  Fagområde
                  <HelpText
                    title='Fagområde'
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
          }
          error={errors?.fagområde}
        />
      </div>
    </div>
  );
};
