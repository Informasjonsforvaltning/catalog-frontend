'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { Box, Combobox, Fieldset, Radio, Textfield } from '@digdir/designsystemet-react';
import { FieldsetDivider, FormikLanguageFieldset, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { RelatedConcept, UnionRelation, RelationSubtypeEnum, RelationTypeEnum } from '@catalog-frontend/types';
import { useSearchConcepts as useSearchInternalConcepts, useDataNorgeSearchConcepts } from '../../../../hooks/search';
import styles from './relation-fieldset.module.scss';

type RelatedConceptType = 'internal' | 'external' | 'custom';
type Option = {
  label: string;
  description?: string;
  value: string;
};

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
  const [relatedConceptInputValue, setRelatedConceptInputValue] = useState('');
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

  let internalRelatedConceptOptions: Option[] = [];
  let externalRelatedConceptOptions: Option[] = [];
  if (relatedConceptType === 'internal' && searchTriggered) {
    internalRelatedConceptOptions =
      internalConcepts?.hits.map((concept) => ({
        label: getTranslateText(concept.anbefaltTerm?.navn) as string,
        value: concept.originaltBegrep as string,
      })) ?? [];
  } else if (relatedConceptType === 'internal' && !searchTriggered && initialRelatedConcept) {
    internalRelatedConceptOptions = [
      {
        label: getTranslateText(initialRelatedConcept.title) as string,
        value: initialRelatedConcept.id as string,
      },
    ];
  } 
  
  if (relatedConceptType === 'external' && searchTriggered) {
    externalRelatedConceptOptions =
      externalConcepts?.hits.map((concept) => ({
        label: getTranslateText(concept.title) as string,
        description: getTranslateText(concept.organization?.prefLabel) as string,
        value: concept.uri as string,
      })) ?? [];
  } 
  else if (relatedConceptType === 'external' && !searchTriggered && initialRelatedConcept) {
    externalRelatedConceptOptions = [
      {
        label: getTranslateText(initialRelatedConcept.title) as string,
        value: initialRelatedConcept.href as string,
      },
    ];
  }

  const filterRelationSubtype = (inputValue: string, option: Option) => {
    if (values.relasjon === RelationTypeEnum.GENERISK) {
      return option.value !== RelationSubtypeEnum.ER_DEL_AV && option.value !== RelationSubtypeEnum.OMFATTER;
    } else if (values.relasjon === RelationTypeEnum.PARTITIV) {
      return option.value !== RelationSubtypeEnum.OVERORDNET && option.value !== RelationSubtypeEnum.UNDERORDNET;
    }
    return true;
  };

  const handleRelatedConceptTypeChange = (value) => {
    setFieldValue('internal', value === 'internal');

    setRelatedConceptType(value as RelatedConceptType);
    setRelatedConcept([]);
    setRelatedConceptInputValue('');
  };

  const handleRelationTypeChange = (value: string[]) => {
    setFieldValue('relasjon', value[0]);
    setFieldValue('relasjonsType', null);
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
    setRelatedConcept(value);
  };

  const handleCustomRelatedConceptChange = (e) => {
    setRelatedConcept([e.target.value]);
  };

  const internalRelatedConceptComboValue = () => {
    return internalRelatedConceptOptions.find((option) => option.value === relatedConcept[0]) ? relatedConcept : []
   };

  const externalRelatedConceptComboValue = () => {
    return externalRelatedConceptOptions.find((option) => option.value === relatedConcept[0]) ? relatedConcept : []
  };

  useEffect(() => {
    setFieldValue('relatertBegrep', relatedConcept[0]);
  }, [relatedConcept]);

  return (
    <Box className={styles.root}>
      <Box className={styles.flex}>
        <Fieldset
          size='sm'
          legend={
            <TitleWithHelpTextAndTag
              helpText={localization.conceptForm.helpText.relatedConcept}
              tagColor='second'
              tagTitle={localization.tag.required}
            >
              {localization.conceptForm.fieldLabel.relatedConcept}
            </TitleWithHelpTextAndTag>
          }
        >
          <Radio.Group
            legend=''
            size='sm'
            value={relatedConceptType}
            onChange={handleRelatedConceptTypeChange}
          >
            <Radio value='internal'>Søk i egen katalog</Radio>
            <Radio value='external'>Søk på data.norge.no</Radio>
            <Radio value='custom'>Egen definert</Radio>
          </Radio.Group>
          {(relatedConceptType === 'internal') && (
            <Combobox
              size='sm'
              portal={false}
              value={internalRelatedConceptComboValue()}
              label='Søk begrep'
              hideLabel
              onChange={handleSearchConceptChange}
              onValueChange={handleRelatedConceptChange}
              error={errors.relatertBegrep}
            >
              <Combobox.Empty>Fant ingen treff</Combobox.Empty>
              {internalRelatedConceptOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  value={option.value}
                  description={option.description}
                >
                  {option.label}
                </Combobox.Option>
              ))}
            </Combobox>
          )}
          {(relatedConceptType === 'external') && (
            <Combobox
              size='sm'
              portal={false}
              value={externalRelatedConceptComboValue()}
              label='Søk begrep'
              hideLabel
              onChange={handleSearchConceptChange}
              onValueChange={handleRelatedConceptChange}
              error={errors.relatertBegrep}
            >
              <Combobox.Empty>Fant ingen treff</Combobox.Empty>
              {externalRelatedConceptOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  value={option.value}
                  description={option.description}
                >
                  {option.label}
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
      <FieldsetDivider />

      <Combobox
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.relation}
            tagColor='second'
            tagTitle={localization.tag.required}
          >
            {localization.conceptForm.fieldLabel.relation}
          </TitleWithHelpTextAndTag>
        }
        size='sm'
        portal={false}
        error={errors?.relasjon}
        value={
          values.relasjon && relationTypeOptions.find((type) => type.value === values.relasjon) ? [values.relasjon] : []
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

      {(values.relasjon === RelationTypeEnum.GENERISK || values.relasjon === RelationTypeEnum.PARTITIV) && (
        <>
          <Box className={styles.flex}>
            <Combobox
              label={
                <TitleWithHelpTextAndTag
                  tagColor='second'
                  tagTitle={localization.tag.required}
                >
                  {localization.conceptForm.fieldLabel.relationLevel}
                </TitleWithHelpTextAndTag>
              }
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
          </Box>
          <FormikLanguageFieldset
            name='inndelingskriterium'
            errorMessage={localization.conceptForm.validation.languageRequired}
            errorArgs={{ label: 'Inndelingskriterium' }}
            legend={
              <TitleWithHelpTextAndTag
                helpText={localization.conceptForm.helpText.devisionCriterion}
                tagColor='second'
                tagTitle={localization.tag.required}
              >
                {localization.conceptForm.fieldLabel.divisionCriterion}
              </TitleWithHelpTextAndTag>
            }
          />
        </>
      )}
      {values.relasjon === RelationTypeEnum.ASSOSIATIV && (
        <FormikLanguageFieldset
          name='beskrivelse'
          errorMessage={localization.conceptForm.validation.languageRequired}
          errorArgs={{ label: 'Beskrivelse' }}
          legend={
            <TitleWithHelpTextAndTag helpText={localization.conceptForm.helpText.relationLevel}>
              {localization.conceptForm.fieldLabel.relationRole}
            </TitleWithHelpTextAndTag>
          }
        />
      )}
    </Box>
  );
};
