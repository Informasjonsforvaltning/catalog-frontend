import { useEffect, useState } from 'react';
import { FastField, FieldArray, useFormikContext } from 'formik';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Fieldset, Textfield, Button, Radio, Card, ValidationMessage } from '@digdir/designsystemet-react';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from './source-description-fieldset.module.scss';
import _ from 'lodash';

type SourceDescriptionFieldsetProps = {
  name: string;
};

const relationshipToSources = [
  {
    label: 'Egendefinert',
    value: 'egendefinert',
  },
  {
    label: 'Basert på kilde',
    value: 'basertPaaKilde',
  },
  {
    label: 'Sitat fra kilde',
    value: 'sitatFraKilde',
  },
];

export const SourceDescriptionFieldset = <T,>({ name }: SourceDescriptionFieldsetProps) => {
  const { errors, values, setFieldValue } = useFormikContext<T>();
  const [relationToSource, setRelationToSource] = useState<string>(
    values[name].forholdTilKilde ?? relationshipToSources[0].value,
  );

  useEffect(() => {
    setFieldValue(`${name}.forholdTilKilde`, relationToSource);
    if (relationToSource === 'egendefinert') {
      setFieldValue(`${name}.kilde`, []);
    }
  }, [relationToSource]);

  return (
    <Card className={styles.sourceDescription}>
      <Radio.Group
        data-size='sm'
        legend={
          <TitleWithHelpTextAndTag helpText={localization.conceptForm.helpText.relationToSource}>
            {localization.conceptForm.fieldLabel.relationToSource}
          </TitleWithHelpTextAndTag>
        }
        value={relationToSource}
        onChange={setRelationToSource}
        error={errors?.[name]?.forholdTilKilde}
      >
        {relationshipToSources.map((rel) => (
          <Radio
            key={rel.value}
            value={rel.value}
          >
            {rel.label}
          </Radio>
        ))}
      </Radio.Group>
      {relationToSource !== 'egendefinert' && (
        <Fieldset data-size='sm'>
          <Fieldset.Legend>
            <TitleWithHelpTextAndTag
              helpText={localization.conceptForm.helpText.sources}
              tagColor='second'
              tagTitle={localization.tag.required}
            >
              {localization.conceptForm.fieldLabel.sources}
            </TitleWithHelpTextAndTag>
          </Fieldset.Legend>
          <FieldArray
            name={`${name}.kilde`}
            render={(arrayHelpers) => (
              <>
                <table className={styles.sourceTable}>
                  <tbody>
                  {values[name]?.kilde?.map((_, index) => (
                    <tr key={index}>
                      <td>
                        <FastField
                          as={Textfield}
                          data-size='sm'
                          name={`${name}.kilde.${index}.tekst`}
                          aria-label={''}
                          placeholder='Kildebeskrivelse'
                          error={errors?.[name]?.kilde?.[index]?.tekst}
                        />
                      </td>
                      <td>
                        <FastField
                          as={Textfield}
                          data-size='sm'
                          name={`${name}.kilde.${index}.uri`}
                          aria-label={''}
                          placeholder='https://kilde.no'
                          error={errors?.[name]?.kilde?.[index]?.uri}
                        />
                      </td>
                      <td>
                        <Button
                          variant='tertiary'
                          data-size='sm'
                          color='danger'
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <TrashIcon
                            title={localization.button.delete}
                            fontSize='1.5rem'
                          />
                          {localization.button.delete}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>

                <div className={styles.languageButtons}>
                  <Button
                    variant='tertiary'
                    color='first'
                    data-size='sm'
                    type='button'
                    onClick={() => {
                      arrayHelpers.push({ text: '', uri: '' });
                    }}
                  >
                    <PlusCircleIcon fontSize='1rem' />
                    Legg til kilde
                  </Button>
                </div>
              </>
            )}
          />
          {typeof _.get(errors, `${name}.kilde`) === 'string' && (
            <ValidationMessage data-size='sm'>
              {`${_.get(errors, `${name}.kilde`)}`}
            </ValidationMessage>
          )}
        </Fieldset>
      )}
    </Card>
  );
};
