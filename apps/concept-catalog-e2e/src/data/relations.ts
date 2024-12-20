import { RelationSubtypeEnum, RelationTypeEnum, UnionRelation } from "@catalog-frontend/types";

type TestRelation = UnionRelation & {
    search: string;
    select: string;
    name: string;
};

export const RELATION_1: TestRelation = {
    search: 'boli',
    select: 'boligKomisk presis bille iks',
    name: 'bolig',
    relasjon: RelationTypeEnum.ASSOSIATIV,
    beskrivelse: {
        nb: 'Rolle 1 nb',
        nn: 'Rolle 1 nn',
        en: 'Rolle 1 en',
    }
};

export const RELATION_2: TestRelation = {
    search: 'boli',
    select: 'boligKomisk presis bille iks',
    name: 'bolig',
    relasjon: RelationTypeEnum.GENERISK,
    relasjonsType: RelationSubtypeEnum.OVERORDNET,
    inndelingskriterium: {
        nb: 'Inndelingskriterium 2 nb',
        nn: 'Inndelingskriterium 2 nn',
        en: 'Inndelingskriterium 2 en',
    }
};

export const RELATION_3: TestRelation = {
    search: 'boli',
    select: 'boligKomisk presis bille iks',
    name: 'bolig',
    relasjon: RelationTypeEnum.PARTITIV,
    relasjonsType: RelationSubtypeEnum.OMFATTER,
    inndelingskriterium: {
        nb: 'Inndelingskriterium 3 nb',
        nn: 'Inndelingskriterium 3 nn',
        en: 'Inndelingskriterium 3 en',
    }
};

export const RELATION_4: TestRelation = {
    search: 'boli',
    select: 'boligKomisk presis bille iks',
    name: 'bolig',
    relasjon: RelationTypeEnum.SE_OGSÅ,
};

export const RELATION_5: TestRelation = {
    search: 'boli',
    select: 'boligKomisk presis bille iks',
    name: 'bolig',
    relasjon: RelationTypeEnum.ERSTATTES_AV,
};

export const ALL_RELATIONS = [RELATION_1, RELATION_2, RELATION_3, RELATION_4, RELATION_5];