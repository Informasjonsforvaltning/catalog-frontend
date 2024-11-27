import { useEffect, useState } from 'react';
import { FastField, FieldArray, useFormikContext } from 'formik';
import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Fieldset, Textfield, Button, HelpText, Radio, Box, Paragraph } from '@digdir/designsystemet-react';
import { TitleWithTag } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import styles from './source-description-fieldset.module.scss';

type SourceDescriptionFieldsetProps = {
  name: string;
};

const relationshipToSources = [
  {
    label: 'Egen definert',
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
    <Box className={styles.sourceDescription}>
      <Radio.Group
        size='sm'
        legend={
          <TitleWithTag
            title={
              <>
                {localization.conceptForm.fieldLabel.relationToSource}
                <HelpText
                  title={localization.conceptForm.fieldLabel.relationToSource}
                  type='button'
                  size='sm'
                >
                  <Paragraph size='sm'>
                    Egen definert: Innholdet er egenutviklet og basert på egne analyser eller vurderinger, uten direkte
                    referanse til eksterne kilder.
                  </Paragraph>
                  <br />
                  <Paragraph size='sm'>
                    Basert på kilde: Innholdet er inspirert av eller bygger på en spesifikk kilde, men inneholder
                    omformulerte eller videreutviklede ideer.
                  </Paragraph>
                  <br />
                  <Paragraph size='sm'>
                    Sitat fra kilde: Innholdet er et direkte sitat eller nøyaktig gjengivelse fra en kilde, og må derfor
                    oppgis med nøyaktig kildehenvisning.
                  </Paragraph>
                </HelpText>
              </>
            }
          />
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
        <Fieldset
          size='sm'
          legend={<TitleWithTag title={localization.conceptForm.fieldLabel.sources} />}
        >
          <FieldArray
            name={`${name}.kilde`}
            render={(arrayHelpers) => (
              <>
                <table className={styles.sourceTable}>
                  {values[name]?.kilde?.map((_, index) => (
                    <tr key={index}>
                      <td>
                        <FastField
                          as={Textfield}
                          size='sm'
                          name={`${name}.kilde.${index}.tekst`}
                          aria-label={''}
                          placeholder='Navn til lenke'
                          error={errors?.[name]?.kilde[index]?.tekst}
                        />
                      </td>
                      <td>
                        <FastField
                          as={Textfield}
                          size='sm'
                          name={`${name}.kilde.${index}.uri`}
                          aria-label={''}
                          placeholder='https://kilde.no'
                          error={errors?.[name]?.kilde[index]?.uri}
                        />
                      </td>
                      <td>
                        <Button
                          variant='tertiary'
                          size='sm'
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
                </table>

                <div className={styles.languageButtons}>
                  <Button
                    variant='tertiary'
                    color='first'
                    size='sm'
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
        </Fieldset>
      )}
    </Box>
  );
};
