import { useFormikContext } from 'formik';
import { PencilWritingIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Box, Button, Skeleton, Table } from '@digdir/designsystemet-react';
import { Concept, RelatedConcept, UnionRelation, RelationTypeEnum } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useSearchConcepts as useSearchInternalConcepts, useDataNorgeSearchConcepts } from '../../../hooks/search';
import { RelationModal } from './relation-modal';
import styles from '../concept-form.module.scss';

type UnionRelationWithIndex = {
  index: number;
} & UnionRelation;

export const RelationSection = ({ catalogId }) => {
  const { values, setFieldValue } = useFormikContext<Concept>();

  const relations: UnionRelationWithIndex[] = [
    ...(values['begrepsRelasjon']?.map((rel, index) => ({ ...rel, index })) ?? []),
    ...(values['seOgså']
      ? values['seOgså'].map((concept, index) => ({
          relasjon: RelationTypeEnum.SE_OGSÅ,
          relatertBegrep: concept,
          index
        }))
      : []),
    ...(values['erstattesAv']
      ? values['erstattesAv'].map((concept, index) => ({
          relasjon: RelationTypeEnum.ERSTATTES_AV,
          relatertBegrep: concept,
          index
        }))
      : []),
    ...(values['internBegrepsRelasjon'] ? values.internBegrepsRelasjon.map((rel,index) => ({ ...rel, internal: true, index })) : []),
    ...(values['internSeOgså']
      ? values['internSeOgså'].map((concept, index) => ({
          relasjon: RelationTypeEnum.SE_OGSÅ,
          relatertBegrep: concept,
          internal: true,
          index
        }))
      : []),
    ...(values['internErstattesAv']
      ? values['internErstattesAv'].map((concept, index) => ({
          relasjon: RelationTypeEnum.ERSTATTES_AV,
          relatertBegrep: concept,
          internal: true,
          index
        }))
      : []),
  ];

  const { data: internalConcepts, isLoading: isLoadingInternalConcepts } = useSearchInternalConcepts({
    catalogId,
    searchTerm: '',
    page: 0,
    fields: {
      anbefaltTerm: true,
      frarådetTerm: true,
      tillattTerm: true,
      definisjon: true,
      merknad: true,
    },
    filters: {
      originalId: {
        value: relations.filter((rel) => rel.internal).map((rel) => rel.relatertBegrep as string),
      },
    },
  });

  const { data: externalConcepts, isLoading: isLoadingExternalConcepts } = useDataNorgeSearchConcepts({
    searchOperation: {
      filters: {
        uri: { value: relations.filter((rel) => !rel.internal).map((rel) => rel.relatertBegrep as string) },
      },
      fields: {
        title: false,
        description: false,
        keyword: false,
      },
      pagination: {
        page: 0,
        size: 100,
      },
    },
  });

  const resolveRelatedConcept = (relation: UnionRelation): RelatedConcept | undefined => {
    if (relation.internal) {
      const match = internalConcepts?.hits.find((hit) => hit.originaltBegrep === relation.relatertBegrep);
      return match ? {
        id: relation.relatertBegrep,
        title: match.anbefaltTerm?.navn,         
      } as RelatedConcept : undefined;  
    } else {
      const match = externalConcepts?.hits.find((hit) => hit.uri === relation.relatertBegrep);
      return match ? {
        href: relation.relatertBegrep,
        title: match.title,
      } as RelatedConcept : {
        href: relation.relatertBegrep,
        custom: true,
        title: { nb: relation.relatertBegrep }
      } as RelatedConcept;  
    }
  };

  const getFieldname = (rel: UnionRelation) => {
    let name: string | undefined = undefined;
    if (rel.relasjon === RelationTypeEnum.SE_OGSÅ) {
      name = rel.internal ? 'internSeOgså' : 'seOgså';
    } else if (rel.relasjon === RelationTypeEnum.ERSTATTES_AV) {
      name = rel.internal ? 'internErstattesAv' : 'erstattesAv';
    } else {
      name = rel.internal ? 'internBegrepsRelasjon' : 'begrepsRelasjon';
    }

    return name;
  };

  const handleChangeRelation = (rel: UnionRelation, index?: number) => {
    if (rel.relatertBegrep) {
      const name: string | undefined = getFieldname(rel);
      let relationValue: any = {
        relasjon: rel.relasjon,
        relasjonsType: rel.relasjonsType,
        beskrivelse: rel.beskrivelse,
        inndelingskriterium: rel.inndelingskriterium,
        relatertBegrep: rel.relatertBegrep
      };
      if (rel.relasjon === RelationTypeEnum.SE_OGSÅ || rel.relasjon === RelationTypeEnum.ERSTATTES_AV) {
        relationValue = rel.relatertBegrep;
      }

      console.log("handleChangeRelation", relationValue, name, index);

      if (name) {
        if (index === undefined) {
          if (!values[name]) {
            setFieldValue(name, [relationValue]);
          } else {
            setFieldValue(name, [...values[name], relationValue]);
          }
        } else {
          const relations = [...values[name]];
          relations[index] = relationValue;
          setFieldValue(name, relations);
        }
      }
    }
  };

  const handleRemoveRelation = (rel: UnionRelation, index: number) => {
    if (index < 0) {
      return;
    }
    const name: string | undefined = getFieldname(rel);
    const relations = [...values[name]];
    relations.splice(index, 1);
    setFieldValue(name, relations);
  };

  if (isLoadingInternalConcepts || isLoadingExternalConcepts) {
    return (
      <Skeleton.Rectangle
        height='100px'
        width='100%'
      />
    );
  }

  return (
    <Box>
      <Box className={styles.fieldSet}>
        <Table size='sm' className={styles.table}>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Relasjon</Table.HeaderCell>
              <Table.HeaderCell>Relatert begrep</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {relations?.map((relation) => (
              <Table.Row key={relation.index}>
                <Table.Cell>
                  {localization.conceptForm.fieldLabel.relationTypes[relation.relasjon as string]}
                </Table.Cell>
                <Table.Cell>{getTranslateText(resolveRelatedConcept(relation)?.title)}</Table.Cell>
                <Table.Cell>
                  <div className={styles.tableRowActions}>
                    <RelationModal
                      header={'Rediger relasjon'}
                      catalogId={catalogId}
                      initialRelation={relation}
                      initialRelatedConcept={resolveRelatedConcept(relation)}
                      trigger={
                        <Button
                          variant='tertiary'
                          color='first'
                          size='sm'
                        >
                          <PencilWritingIcon
                            aria-hidden
                            fontSize='1rem'
                          />
                          Rediger
                        </Button>
                      }
                      onSucces={(values) => handleChangeRelation(values, relation.index)}
                    />
                    <Button
                      variant='tertiary'
                      color='danger'
                      size='sm'
                      onClick={() => handleRemoveRelation(relation, relation.index)}
                    >
                      <TrashIcon
                        aria-hidden
                        fontSize='1rem'
                      />
                      Slett
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Box>
      <Box className={styles.buttonRow}>
        <RelationModal
          header={'Ny relasjon'}
          catalogId={catalogId}
          trigger={
            <Button
              variant='tertiary'
              color='first'
              size='sm'
            >
              <PlusCircleIcon
                aria-hidden
                fontSize='1rem'
              />
              Legg til relasjon
            </Button>
          }
          onSucces={(values) => handleChangeRelation(values)}
        />
      </Box>
    </Box>
  );
};
