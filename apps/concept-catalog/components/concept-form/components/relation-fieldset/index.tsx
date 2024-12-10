'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { Box, Combobox, Fieldset, HelpText, Paragraph, Radio, Textfield } from '@digdir/designsystemet-react';
import { FieldsetDivider, FormikLanguageFieldset, HelpMarkdown, TitleWithTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Option, RelatedConcept, UnionRelation, RelationSubtypeEnum, RelationTypeEnum } from '@catalog-frontend/types';
import { useSearchConcepts as useSearchInternalConcepts, useDataNorgeSearchConcepts } from '../../../../hooks/search';
import styles from './relation-fieldset.module.scss';

type RelatedConceptType = 'internal' | 'external' | 'custom';

const relationTypes = Object.keys(RelationTypeEnum)
  .filter((item) => {
    return isNaN(Number(item));
  })
  .map((key) => RelationTypeEnum[key]);

const relationSubtypes = Object.keys(RelationSubtypeEnum)
  .filter((item) => {
    return isNaN(Number(item));
  })
  .map((key) => RelationSubtypeEnum[key]);

type RelationFieldsetProps = {
  catalogId: string;
  initialRelatedConcept?: RelatedConcept;
};

const getRelatedConceptStateValue = (relatedConcept?: RelatedConcept): string[] => {
  if (relatedConcept?.id) {
    return [relatedConcept.id];
  } else if (relatedConcept?.href) {
    return [relatedConcept.href];
  }
  return [];
};

const getRelatedConceptTypeStateValue = (relatedConcept?: RelatedConcept): RelatedConceptType => {
  if (relatedConcept?.custom) {
    return 'custom';
  } else if (relatedConcept?.id) {
    return 'internal';
  } else if (relatedConcept?.href) {
    return 'external';
  }
  return 'internal';
};

export const RelationFieldset = ({ catalogId, initialRelatedConcept }: RelationFieldsetProps) => {
  const { errors, values, setFieldValue } = useFormikContext<UnionRelation>();
  const [relatedConcept, setRelatedConcept] = useState<string[]>(getRelatedConceptStateValue(initialRelatedConcept));
  const [relatedConceptType, setRelatedConceptType] = useState<RelatedConceptType>(
    getRelatedConceptTypeStateValue(initialRelatedConcept),
  );
  const [search, setSearch] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: internalConcepts } = useSearchInternalConcepts({
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
  });

  const { data: externalConcepts } = useDataNorgeSearchConcepts({
    searchOperation: {
      query: search,
      fields: {
        title: true,
      },
    },
    enabled: Boolean(search),
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
    if (values.relasjon === RelationTypeEnum.GENERISK) {
      return option.value !== RelationSubtypeEnum.ER_DEL_AV && option.value !== RelationSubtypeEnum.OMFATTER;
    } else if (values.relasjon === RelationTypeEnum.PARTITIV) {
      return option.value !== RelationSubtypeEnum.OVERORDNET && option.value !== RelationSubtypeEnum.UNDERORDNET;
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
    setRelatedConcept([]);
    setSearch(event.target.value);
    setSearchTriggered(true);
  };

  const handleRelatedConceptChange = (value: string[]) => {
    setFieldValue('relatertBegrep', value[0]);
  };

  const handleCustomRelatedConceptChange = (e) => {
    setRelatedConcept([e.target.value]);
  };

  useEffect(() => {
    setFieldValue('internal', relatedConceptType === 'internal');
  }, [relatedConceptType]);

  useEffect(() => {
    setFieldValue('relatertBegrep', relatedConcept[0]);
  }, [relatedConcept]);

  return (
    <Box className={styles.root}>
      <Box className={styles.flex}>
        <Fieldset
          size='sm'
          legend={
            <TitleWithTag
              title={
                <>
                  {localization.conceptForm.fieldLabel.relatedConcept}
                  <HelpMarkdown
                    title={localization.conceptForm.fieldLabel.relatedConcept}
                    type='button'
                    size='sm'
                  >
                    {localization.conceptForm.helpText.relatedConcept}
                  </HelpMarkdown>
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
            value={relatedConceptType}
            onChange={(value) => setRelatedConceptType(value as RelatedConceptType)}
          >
            <Radio value='internal'>Søk i egen katalog</Radio>
            <Radio value='external'>Søk på data.norge.no</Radio>
            <Radio value='custom'>Egen definert</Radio>
          </Radio.Group>
          {(relatedConceptType === 'external' || relatedConceptType === 'internal') && (
            <Combobox
              size='sm'
              portal={false}
              value={relatedConcept}
              onChange={handleSearchConceptChange}
              onValueChange={handleRelatedConceptChange}
              error={errors.relatertBegrep}
            >
              <Combobox.Empty>Fant ingen treff</Combobox.Empty>
              {relatedConceptType === 'internal' &&
                searchTriggered &&
                internalConcepts?.hits.map((concept) => (
                  <Combobox.Option
                    key={concept.originaltBegrep as string}
                    value={concept.originaltBegrep as string}
                  >
                    {getTranslateText(concept.anbefaltTerm?.navn) as string}
                  </Combobox.Option>
                ))}
              {relatedConceptType === 'external' &&
                searchTriggered &&
                externalConcepts?.hits.map((concept) => (
                  <Combobox.Option
                    key={concept.id as string}
                    value={concept.uri as string}
                    description={getTranslateText(concept.organization?.prefLabel) as string}
                  >
                    {getTranslateText(concept.title) as string}
                  </Combobox.Option>
                ))}
              {relatedConceptType === 'internal' && !searchTriggered && initialRelatedConcept && (
                <Combobox.Option
                  key={initialRelatedConcept.id as string}
                  value={initialRelatedConcept.id as string}
                >
                  {getTranslateText(initialRelatedConcept.title)}
                </Combobox.Option>
              )}
              {relatedConceptType === 'external' && !searchTriggered && initialRelatedConcept && (
                <Combobox.Option
                  key={initialRelatedConcept.href as string}
                  value={initialRelatedConcept.href as string}
                >
                  {getTranslateText(initialRelatedConcept.title)}
                </Combobox.Option>
              )}
            </Combobox>
          )}
          {relatedConceptType === 'custom' && (
            <Textfield
              value={relatedConcept[0]}
              onChange={handleCustomRelatedConceptChange}
            />
          )}
        </Fieldset>
      </Box>
      <FieldsetDivider />
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
          value={
            values.relasjon && relationTypeOptions.find((type) => type.value === values.relasjon)
              ? [values.relasjon]
              : []
          }
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

      {(values.relasjon === RelationTypeEnum.GENERISK || values.relasjon === RelationTypeEnum.PARTITIV) && (
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
                value={
                  values.relasjonsType && relationSubtypeOptions.find((type) => type.value === values.relasjonsType)
                    ? [values.relasjonsType]
                    : []
                }
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
          <FormikLanguageFieldset
            name='inndelingskriterium'
            errorFieldLabel='Inndelingskriterium'
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
      {values.relasjon === RelationTypeEnum.ASSOSIATIV && (
        <FormikLanguageFieldset
          name='beskrivelse'
          errorFieldLabel='Beskrivelse'
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
    </Box>
  );
};
