'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { FastField, useFormikContext } from 'formik';
import { Box, Combobox, Fieldset, HelpText, Paragraph, Radio, Textfield } from '@digdir/designsystemet-react';
import { FieldsetDivider, FormikLanguageFieldset, HelpMarkdown, TitleWithTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Option, UnionRelation, UnionRelationSubtypeEnum, UnionRelationTypeEnum } from '@catalog-frontend/types';
import { useSearchConcepts as useSearchInternalConcepts, useDataNorgeSearchConcepts } from '../../../../hooks/search';
import styles from './relation-fieldset.module.scss';

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
  const [search, setSearch] = useState('');
  const [relatedConcept, setRelatedConcept] = useState<string[]>([]);
  const [relatedConceptType, setRelatedConceptType] = useState<string>('internal');
  const [initialFetched, setInitialFetched] = useState(false);
  const [internalEnabled, setInternalEnabled] = useState(true);
  const [externalEnabled, setExternalEnabled] = useState(true);

  const { data: internalConcepts, status: internalStatus } = useSearchInternalConcepts({
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
    filters:
      search.trim().length === 0 && values.relatertBegrep?.length
        ? {
            originalId: {
              value: [values.relatertBegrep as string],
            },
          }
        : undefined,
    enabled: internalEnabled,
  });

  const { data: externalConcepts, status: externalStatus } = useDataNorgeSearchConcepts({
    searchOperation: {
      query: search,
      filters:
        relatedConceptType !== 'custom' && search.trim().length === 0 && values.relatertBegrep?.length
          ? {
              uri: {
                value: [values.relatertBegrep as string],
              },
            }
          : undefined,
    },
    enabled: externalEnabled,
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
    setInternalEnabled(true);
    setExternalEnabled(true);
    setSearch(event.target.value);
  };

  const handleRelatedConceptChange = (value: string[]) => {
    setFieldValue('relatertBegrep', value[0]);
  };

  const handleCustomRelatedConceptChange = (e) => {
    setInternalEnabled(false);
    setExternalEnabled(false);
    setRelatedConcept([e.target.value]);
  }
  
  useEffect(() => {
    setFieldValue('internal', relatedConceptType === 'internal');
    if(relatedConcept.length > 0) {
      setRelatedConcept(() => []);
    }
    
  }, [relatedConceptType]);

  useEffect(() => {
    setFieldValue('relatertBegrep', relatedConcept);
  }, [relatedConcept]);

  useEffect(() => {
    if (internalStatus === 'success' && externalStatus === 'success' && !initialFetched) {
      setInitialFetched(() => true);
      setInternalEnabled(() => false);
      setExternalEnabled(() => false);

      const selectedRelatedConceptType = internalConcepts?.hits.find((hit) => hit.id === values.relatertBegrep)
        ? 'internal'
        : externalConcepts?.hits.find((hit) => hit.uri === values.relatertBegrep)
          ? 'external'
          : 'custom';

      console.log(
        'initialFetched triggered',
        internalConcepts,
        externalConcepts,
        selectedRelatedConceptType,
        values.relatertBegrep,
      );

      setRelatedConceptType(selectedRelatedConceptType);
      setRelatedConcept(
        values.relatertBegrep &&
          (selectedRelatedConceptType === 'internal' || selectedRelatedConceptType === 'external')
          ? [values.relatertBegrep]
          : [],
      );
    }
  }, [internalStatus, externalStatus, initialFetched]);

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
          <FormikLanguageFieldset
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
        <FormikLanguageFieldset
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
          onChange={setRelatedConceptType}
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
              internalConcepts?.hits.map((concept) => (
                <Combobox.Option
                  key={concept.originaltBegrep as string}
                  value={concept.originaltBegrep as string}
                >
                  {getTranslateText(concept.anbefaltTerm?.navn) as string}
                </Combobox.Option>
              ))}
            {relatedConceptType === 'external' &&
              externalConcepts?.hits.map((concept) => (
                <Combobox.Option
                  key={concept.id as string}
                  value={concept.uri as string}
                  description={getTranslateText(concept.organization?.prefLabel) as string}
                >
                  {getTranslateText(concept.title) as string}
                </Combobox.Option>
              ))}
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
  );
};
