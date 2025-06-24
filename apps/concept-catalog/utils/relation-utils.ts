import { Concept, UnionRelation, RelationTypeEnum } from '@catalog-frontend/types';

export type UnionRelationWithIndex = {
  index: number;
} & UnionRelation;

export const getFieldname = (rel: UnionRelation): string | undefined => {
  if (rel.relasjon === RelationTypeEnum.SE_OGSÅ) {
    return rel.internal ? 'internSeOgså' : 'seOgså';
  } else if (rel.relasjon === RelationTypeEnum.ERSTATTES_AV) {
    return rel.internal ? 'internErstattesAv' : 'erstattesAv';
  } else {
    return rel.internal ? 'internBegrepsRelasjon' : 'begrepsRelasjon';
  }
};

export const updateUnionRelation = (
  rel: UnionRelation, 
  prev: UnionRelationWithIndex | undefined, 
  values: Concept, 
  setFieldValue: (field: string, value: any) => void
): void => {
  const name: string | undefined = getFieldname(rel);
  const prevName: string | undefined = prev ? getFieldname(prev) : undefined;

  let relationValue: any = {
    relasjon: rel.relasjon,
    relasjonsType: rel.relasjonsType,
    beskrivelse: rel.beskrivelse,
    inndelingskriterium: rel.inndelingskriterium,
    relatertBegrep: rel.relatertBegrep,
  };
  if (rel.relasjon === RelationTypeEnum.SE_OGSÅ || rel.relasjon === RelationTypeEnum.ERSTATTES_AV) {
    relationValue = rel.relatertBegrep;
  }

  if (name) {
    if (prev?.index === undefined || name !== prevName) {
      if (!values[name]) {
        setFieldValue(name, [relationValue]);
      } else {
        setFieldValue(name, [...values[name], relationValue]);
      }

      if (prev && name !== prevName) {
        removeUnionRelation(prev, values, setFieldValue);
      }
    } else {
      const relations = [...values[name]];
      relations[prev.index] = relationValue;
      setFieldValue(name, relations);
    }
  }
};

export const removeUnionRelation = (
  rel: UnionRelationWithIndex, 
  values: Concept, 
  setFieldValue: (field: string, value: any) => void
): void => {
  if (rel.index < 0) {
    return;
  }
  const name: string | undefined = getFieldname(rel);
  if (name) {
    const relations = [...values[name]];
    relations.splice(rel.index, 1);
    setFieldValue(name, relations);
  }
}; 