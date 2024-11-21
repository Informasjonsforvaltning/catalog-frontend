import { ChangeEvent, useEffect, useState } from 'react';
import { Option, UnionRelation, UnionRelationSubtypeEnum, UnionRelationTypeEnum } from '@catalog-frontend/types';
import { useFormikContext } from 'formik';
import {
  Box,
  Combobox,
  Fieldset,
  HelpText,
  Paragraph,
  Radio,
} from '@digdir/designsystemet-react';
import styles from './relation-fieldset.module.scss';
import { TitleWithTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useSearchConcepts } from '../../../../hooks/search';
import { FieldsetDivider } from '../fieldset-divider';
import { LanguageFieldset } from '../language-fieldset';
import { HelpMarkdown } from '../help-markdown';

const relationTypes = Object.keys(UnionRelationTypeEnum)
  .filter((item) => {
    return isNaN(Number(item));
  })
  .map((key) => UnionRelationTypeEnum[key]);

const relationSubtypes = Object.keys(UnionRelationSubtypeEnum)
  .filter((item) => {
    return isNaN(Number(item));
  })
  .map((key) => UnionRelationSubtypeEnum[key]);

export const RelationFieldset = ({ catalogId }) => {
  const { errors, values, setFieldValue } = useFormikContext<UnionRelation>();
  const [searchTarget, setSearchTarget] = useState(values.internal ? 'internal' : 'external');
  const [search, setSearch] = useState('');

  const {
    status,
    data: internalConcepts,
    refetch,
  } = useSearchConcepts({
    catalogId,
    searchTerm: search,
    page: 0,
    fields: {
      anbefaltTerm: true,
      frarådetTerm: false,
      tillattTerm: false,
      definisjon: false,
      merknad: false,
    },
    enabled: searchTarget === 'internal',
  });

  const relationTypeOptions = relationTypes.map((item) => ({
    label: localization.conceptForm.fieldLabel.relationTypes[item],
    value: item,
  }));

  const relationSubtypeOptions = relationSubtypes.map((item) => ({
    label: localization.conceptForm.fieldLabel.relationSubtypes[item],
    value: item,
  }));

  const filterRelationSubtype = (inputValue: string, option: Option) => {
    if (values.relasjon === UnionRelationTypeEnum.GENERISK) {
      return option.value !== UnionRelationSubtypeEnum.ER_DEL_AV && option.value !== UnionRelationSubtypeEnum.OMFATTER;
    } else if (values.relasjon === UnionRelationTypeEnum.PARTITIV) {
      return (
        option.value !== UnionRelationSubtypeEnum.OVERORDNET && option.value !== UnionRelationSubtypeEnum.UNDERORDNET
      );
    }
    return true;
  };

  const handleRelationTypeChange = (value: string[]) => {
    setFieldValue('relasjon', value[0]);
    setFieldValue('relasjonsType', undefined);
  };

  const handleRelationSubtypeChange = (value: string[]) => {
    setFieldValue('relasjonsType', value[0]);
  };

  const handleSearchConceptChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleRelatedConceptChange = (value: string[]) => {
    setFieldValue('relatertBegrep', value[0]);
  };

  useEffect(() => {
    setFieldValue('internal', searchTarget === 'internal');
  }, [searchTarget]);

  return (
    <Box className={styles.root}>
      <Box className={styles.flex}>
        <Fieldset
          size='sm'
          legend={
            <TitleWithTag
              title={
                <>
                  {localization.conceptForm.fieldLabel.relation}
                  <HelpMarkdown
                    title={localization.conceptForm.fieldLabel.relation}
                    type='button'
                    size='sm'
                    placement='right-end'
                  >
                    {localization.conceptForm.helpText.relation}
                  </HelpMarkdown>
                </>
              }
              tagColor='second'
              tagTitle={localization.tag.required}
            />
          }
        >
          <Combobox
            size='sm'
            portal={false}
            error={errors?.relasjon}
            value={values.relasjon ? [values.relasjon] : []}
            onValueChange={handleRelationTypeChange}
          >
            {relationTypeOptions.map((rel) => (
              <Combobox.Option
                key={rel.value}
                value={rel.value}
              >
                {rel.label}
              </Combobox.Option>
            ))}
          </Combobox>
        </Fieldset>
      </Box>
      {(values.relasjon === UnionRelationTypeEnum.GENERISK || values.relasjon === UnionRelationTypeEnum.PARTITIV) && (
        <>
          <Box className={styles.flex}>
            <Fieldset
              size='sm'
              legend={
                <TitleWithTag
                  title={
                    <>
                      {localization.conceptForm.fieldLabel.relationLevel}
                      <HelpText
                        title={localization.conceptForm.fieldLabel.relationLevel}
                        type='button'
                        size='sm'
                      >
                        <Paragraph size='sm'>Relasjonsnivå...</Paragraph>
                      </HelpText>
                    </>
                  }
                  tagColor='second'
                  tagTitle={localization.tag.required}
                />
              }
            >
              <Combobox
                size='sm'
                portal={false}
                value={values.relasjonsType ? [values.relasjonsType] : []}
                filter={filterRelationSubtype}
                error={errors?.relasjonsType}
                onValueChange={handleRelationSubtypeChange}
              >
                {relationSubtypeOptions.map((type) => (
                  <Combobox.Option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </Combobox.Option>
                ))}
              </Combobox>
            </Fieldset>
          </Box>
          <LanguageFieldset
            name='inndelingskriterium'
            legend={
              <TitleWithTag
                title={
                  <>
                    {localization.conceptForm.fieldLabel.divisionCriterion}
                    <HelpText
                      title={localization.conceptForm.fieldLabel.divisionCriterion}
                      type='button'
                      size='sm'
                    >
                      <Paragraph size='sm'>
                        Inndelingskriterium er en type kjennetegn brukt til å inndele et overbegrep i underbegreper.
                      </Paragraph>
                      <br />
                      <Paragraph size='sm'>
                        Eksempel: ‘tilkopling til datamaskin’ blir brukt som inndelingskriterium for å dele det
                        generiske begrepet ‘datamus’ i spesifikke begreper som ‘kablet mus’ og ‘trådløs mus’.
                      </Paragraph>
                    </HelpText>
                  </>
                }
              />
            }
          />
        </>
      )}
      {values.relasjon === UnionRelationTypeEnum.ASSOSIATIV && (
        <LanguageFieldset
          name='beskrivelse'
          legend={
            <TitleWithTag
              title={
                <>
                  Relasjonsrolle
                  <HelpMarkdown
                    title={localization.conceptForm.fieldLabel.relationLevel}
                    type='button'
                    size='sm'
                  >
                    {localization.conceptForm.helpText.relationLevel}
                  </HelpMarkdown>
                </>
              }
            />
          }
        />
      )}
      <FieldsetDivider />
      <Fieldset
        size='sm'
        legend={
          <TitleWithTag
            title={
              <>
                {localization.conceptForm.fieldLabel.relatedConcept}
                <HelpText
                  title={localization.conceptForm.fieldLabel.relatedConcept}
                  type='button'
                  size='sm'
                >
                  <Paragraph size='sm'>
                    Begynn å skrive i søkefeltet, og du vil få opp en liste med forslag basert på ditt søk. Klikk på
                    ønsket begrep for å knytte det til det nåværende begrepet.
                  </Paragraph>
                </HelpText>
              </>
            }
            tagColor='second'
            tagTitle={localization.tag.required}
          />
        }
      >
        <Radio.Group
          legend=''
          size='sm'
          value={searchTarget}
          onChange={setSearchTarget}
        >
          <Radio value='external'>Søk på data.norge.no</Radio>
          <Radio value='internal'>Søk i egen katalog</Radio>
        </Radio.Group>
        <Combobox
          size='sm'
          portal={false}
          onChange={handleSearchConceptChange}
          onValueChange={handleRelatedConceptChange}
          error={errors.relatertBegrep}
        >
          <Combobox.Empty>Fant ingen treff</Combobox.Empty>
          {values.internal &&
            internalConcepts?.hits.map((concept) => (
              <Combobox.Option
                key={concept.originaltBegrep as string}
                value={concept.originaltBegrep as string}
              >
                {getTranslateText(concept.anbefaltTerm?.navn) as string}
              </Combobox.Option>
            ))}
        </Combobox>
      </Fieldset>
    </Box>
  );
};
