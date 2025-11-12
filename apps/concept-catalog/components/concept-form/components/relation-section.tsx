'use client';

import { useFormikContext } from 'formik';
import { PencilWritingIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Box, Button, Fieldset, Skeleton, Table } from '@digdir/designsystemet-react';
import { Concept, RelatedConcept, UnionRelation, RelationTypeEnum, StorageData } from '@catalog-frontend/types';
import { DataStorage, getTranslateText, localization } from '@catalog-frontend/utils';
import { useSearchConcepts as useSearchInternalConcepts, useDataNorgeSearchConcepts } from '../../../hooks/search';
import { RelationModal } from './relation-modal';
import styles from '../concept-form.module.scss';
import { TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { updateUnionRelation, removeUnionRelation, UnionRelationWithIndex } from '../../../utils/relation-utils';


type RelationSection = {
  catalogId: string;
  changed?: string[];
  readOnly?: boolean;
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
};

export const RelationSection = ({ catalogId, changed, readOnly, autoSaveId, autoSaveStorage }: RelationSection) => {
  const { values, setFieldValue } = useFormikContext<Concept>();
  const isDirty = [
    'begrepsRelasjon',
    'seOgså',
    'erstattesAv',
    'internBegrepsRelasjon',
    'internSeOgså',
    'internErstattesAv',
  ].some((rel) => changed?.includes(rel));

  const relations: UnionRelationWithIndex[] = [
    ...(values['begrepsRelasjon']?.map((rel, index) => ({ ...rel, index })) ?? []),
    ...(values['seOgså']
      ? values['seOgså'].map((concept, index) => ({
        relasjon: RelationTypeEnum.SE_OGSÅ,
        relatertBegrep: concept,
        index,
      }))
      : []),
    ...(values['erstattesAv']
      ? values['erstattesAv'].map((concept, index) => ({
        relasjon: RelationTypeEnum.ERSTATTES_AV,
        relatertBegrep: concept,
        index,
      }))
      : []),
    ...(values['internBegrepsRelasjon']
      ? values.internBegrepsRelasjon.map((rel, index) => ({ ...rel, internal: true, index }))
      : []),
    ...(values['internSeOgså']
      ? values['internSeOgså'].map((concept, index) => ({
        relasjon: RelationTypeEnum.SE_OGSÅ,
        relatertBegrep: concept,
        internal: true,
        index,
      }))
      : []),
    ...(values['internErstattesAv']
      ? values['internErstattesAv'].map((concept, index) => ({
        relasjon: RelationTypeEnum.ERSTATTES_AV,
        relatertBegrep: concept,
        internal: true,
        index,
      }))
      : []),
  ];

  const { data: internalConcepts, isLoading: isLoadingInternalConcepts } = useSearchInternalConcepts({
    catalogId,
    searchTerm: '',
    page: 0,
    size: 100,
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
      return match
        ? ({
          id: relation.relatertBegrep,
          title: match.anbefaltTerm?.navn,
        } as RelatedConcept)
        : undefined;
    } else {
      const match = externalConcepts?.hits.find((hit) => hit.uri === relation.relatertBegrep);
      return match
        ? ({
          href: relation.relatertBegrep,
          title: match.title,
        } as RelatedConcept)
        : ({
          href: relation.relatertBegrep,
          custom: true,
          title: { nb: relation.relatertBegrep },
        } as RelatedConcept);
    }
  };

  const handleChangeRelationInModal = (rel: UnionRelation, prev?: UnionRelationWithIndex) => {
    autoSaveStorage?.setSecondary('relation', {
      id: autoSaveId,
      values: {
        rel,
        prev
      },
      lastChanged: new Date().toISOString(),
    });
  };

  const handleCloseRelationModal = () => {
    autoSaveStorage?.deleteSecondary('relation');
  };

  const handleUpdateRelation = (rel: UnionRelation, prev?: UnionRelationWithIndex) => {
    updateUnionRelation(rel, prev, values, setFieldValue);
    autoSaveStorage?.deleteSecondary('relation');
  };

  const handleRemoveRelation = (rel: UnionRelationWithIndex) => {
    removeUnionRelation(rel, values, setFieldValue);
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
        <Fieldset
          legend={<TitleWithHelpTextAndTag changed={isDirty}>Tabell over relasjoner</TitleWithHelpTextAndTag>}
          readOnly={readOnly}
          data-size='sm'
        >
          <Table
            data-size='sm'
            className={styles.table}
          >
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>Relasjon</Table.HeaderCell>
                <Table.HeaderCell>Relatert begrep</Table.HeaderCell>
                <Table.HeaderCell>
                  <span className='hide-text'>Akjsoner</span>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {relations?.map((relation, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    {localization.conceptForm.fieldLabel.relationTypes[relation.relasjon as string]}
                  </Table.Cell>
                  <Table.Cell>{getTranslateText(resolveRelatedConcept(relation)?.title)}</Table.Cell>
                  <Table.Cell>
                    <div className={styles.tableRowActions}>
                      <RelationModal
                        header={'Rediger relasjon'}
                        catalogId={catalogId}
                        conceptId={values.originaltBegrep || ''}
                        initialRelation={relation}
                        initialRelatedConcept={resolveRelatedConcept(relation)}
                        trigger={
                          <Button
                            variant='tertiary'
                            color='first'
                            data-size='sm'
                            disabled={readOnly}
                          >
                            <PencilWritingIcon
                              aria-hidden
                              fontSize='1rem'
                            />
                            Rediger
                          </Button>
                        }
                        onSuccess={(values) => handleUpdateRelation(values, relation)}
                        onChange={(values) => handleChangeRelationInModal(values, relation)}
                        onClose={() => handleCloseRelationModal()}
                      />
                      <Button
                        variant='tertiary'
                        color='danger'
                        data-size='sm'
                        disabled={readOnly}
                        onClick={() => handleRemoveRelation(relation)}
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
        </Fieldset>
      </Box>
      {!readOnly && (
        <Box className={styles.buttonRow}>
          <RelationModal
            header={'Ny relasjon'}
            catalogId={catalogId}
            conceptId={values.originaltBegrep || ''}
            trigger={
              <Button
                variant='tertiary'
                color='first'
                data-size='sm'
              >
                <PlusCircleIcon
                  aria-hidden
                  fontSize='1rem'
                />
                Legg til relasjon
              </Button>
            }
            onSuccess={(values) => handleUpdateRelation(values)}
            onChange={(values) => handleChangeRelationInModal(values)}
            onClose={() => handleCloseRelationModal()}
          />
        </Box>
      )}
    </Box>
  );
};
