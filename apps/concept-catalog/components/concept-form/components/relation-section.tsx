import { useFormikContext } from 'formik';
import { PencilWritingIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Skeleton, Table } from '@digdir/designsystemet-react';
import { Concept, UnionRelation, UnionRelationTypeEnum } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useSearchConcepts as useSearchInternalConcepts, useDataNorgeSearchConcepts } from '../../../hooks/search';
import { RelationModal } from './relation-modal';
import styles from '../concept-form.module.scss';

export const RelationSection = ({ catalogId }) => {
  const { values, setFieldValue } = useFormikContext<Concept>();

  const relations: UnionRelation[] = [
    ...(values['begrepsRelasjon']?.map((rel) => ({ ...rel })) ?? []),
    ...(values['seOgså']
      ? values['seOgså'].map((concept) => ({
          relasjon: UnionRelationTypeEnum.SE_OGSÅ,
          relatertBegrep: concept,
        }))
      : []),
    ...(values['erstattesAv']
      ? values['erstattesAv'].map((concept) => ({
          relasjon: UnionRelationTypeEnum.ERSTATTES_AV,
          relatertBegrep: concept,
        }))
      : []),
    ...(values['internBegrepsRelasjon'] ? values.internBegrepsRelasjon.map((rel) => ({ ...rel, internal: true })) : []),
    ...(values['internSeOgså']
      ? values['internSeOgså'].map((concept) => ({
          relasjon: UnionRelationTypeEnum.SE_OGSÅ,
          relatertBegrep: concept,
          internal: true,
        }))
      : []),
    ...(values['internErstattesAv']
      ? values['internErstattesAv'].map((concept) => ({
          relasjon: UnionRelationTypeEnum.ERSTATTES_AV,
          relatertBegrep: concept,
          internal: true,
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

  const resolveRelatedConceptTitle = (relation: UnionRelation) => {
    if (relation.internal) {
      const match = internalConcepts?.hits.find((hit) => hit.originaltBegrep === relation.relatertBegrep);
      return match ? getTranslateText(match.anbefaltTerm?.navn) : relation.relatertBegrep;
    } else {
      const match = externalConcepts?.hits.find((hit) => hit.uri === relation.relatertBegrep);
      return match ? getTranslateText(match.title) : relation.relatertBegrep;
    }
  };

  const getFieldname = (rel: UnionRelation) => {
    let name: string | undefined = undefined;
    if (rel.relasjon === UnionRelationTypeEnum.SE_OGSÅ) {
      name = rel.internal ? 'internSeOgså' : 'seOgså';
    } else if (rel.relasjon === UnionRelationTypeEnum.ERSTATTES_AV) {
      name = rel.internal ? 'internErstattesAv' : 'erstattesAv';
    } else {
      name = rel.internal ? 'internBegrepsRelasjon' : 'begrepsRelasjon';
    }

    return name;
  };

  const handleChangeRelation = (rel: UnionRelation, index?: number) => {
    if (rel.relatertBegrep) {
      const name: string | undefined = getFieldname(rel);
      let relationValue: any = rel;
      if (rel.relasjon === UnionRelationTypeEnum.SE_OGSÅ || rel.relasjon === UnionRelationTypeEnum.ERSTATTES_AV) {
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
    <div>
      <div className={styles.fieldSet}>
        <Table size='sm'>
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>Relasjon</Table.HeaderCell>
              <Table.HeaderCell>Relatert begrep</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {relations?.map((relation, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  {localization.conceptForm.fieldLabel.relationTypes[relation.relasjon as string]}
                </Table.Cell>
                <Table.Cell>{resolveRelatedConceptTitle(relation)}</Table.Cell>
                <Table.Cell>
                  <div className={styles.tableRowActions}>
                    <RelationModal
                      header={'Rediger relasjon'}
                      catalogId={catalogId}
                      initialRelation={relation}
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
                      onSucces={(values) => handleChangeRelation(values, index)}
                    />
                    <Button
                      variant='tertiary'
                      color='danger'
                      size='sm'
                      onClick={() => handleRemoveRelation(relation, index)}
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
      </div>
      <div>
        <RelationModal
          header={'Ny relasjon'}
          catalogId={catalogId}
          trigger={
            <Button
              variant='tertiary'
              color='first'
              size='sm'
            >
              <PlusIcon
                aria-hidden
                fontSize='1.5rem'
              />
              Legg til relasjon
            </Button>
          }
          onSucces={(values) => handleChangeRelation(values)}
        />
      </div>
    </div>
  );
};
