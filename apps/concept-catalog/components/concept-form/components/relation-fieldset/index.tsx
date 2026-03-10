"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useFormikContext } from "formik";
import {
  Combobox,
  Fieldset,
  Radio,
  Textfield,
  useRadioGroup,
} from "@digdir/designsystemet-react";
import {
  FieldsetDivider,
  FormikLanguageFieldset,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui-v2";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import {
  RelatedConcept,
  UnionRelation,
  RelationSubtypeEnum,
  RelationTypeEnum,
} from "@catalog-frontend/types";
import {
  useSearchConcepts as useSearchInternalConcepts,
  useDataNorgeSearchConcepts,
} from "../../../../hooks/search";
import styles from "./relation-fieldset.module.scss";

type RelatedConceptType = "internal" | "external" | "custom";

type Option = {
  label: string;
  description?: string;
  value: string;
};

const relatedConceptTypes: RelatedConceptType[] = [
  "internal",
  "external",
  "custom",
];
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
  conceptId: string;
};

const getRelatedConceptStateValue = (
  relatedConcept?: RelatedConcept,
): string[] => {
  if (relatedConcept?.id) {
    return [relatedConcept.id];
  } else if (relatedConcept?.href) {
    return [relatedConcept.href];
  }
  return [];
};

const getRelatedConceptTypeStateValue = (
  relatedConcept?: RelatedConcept,
): RelatedConceptType => {
  if (relatedConcept?.custom) {
    return "custom";
  } else if (relatedConcept?.id) {
    return "internal";
  } else if (relatedConcept?.href) {
    return "external";
  }
  return "internal";
};

export const RelationFieldset = ({
  catalogId,
  initialRelatedConcept,
  conceptId,
}: RelationFieldsetProps) => {
  const { errors, values, setFieldValue } = useFormikContext<UnionRelation>();
  const [relatedConcept, setRelatedConcept] = useState<string[]>(
    getRelatedConceptStateValue(initialRelatedConcept),
  );
  const [relatedConceptType, setRelatedConceptType] =
    useState<RelatedConceptType>(
      getRelatedConceptTypeStateValue(initialRelatedConcept),
    );
  const [search, setSearch] = useState("");
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

  const relationTypeOptions = relationTypes
    .map((item) => ({
      label: localization.conceptForm.fieldLabel.relationTypes[item],
      value: item,
    }))
    .filter((item) => {
      if (values.relasjon === RelationTypeEnum.ASSOSIATIV) {
        return item.value !== RelationTypeEnum.ASSOSIATIV;
      }
      return true;
    });

  const relationSubtypeOptions = relationSubtypes
    .filter((subtype) => {
      if (values.relasjon === RelationTypeEnum.PARTITIV) {
        return (
          subtype === RelationSubtypeEnum.ER_DEL_AV ||
          subtype === RelationSubtypeEnum.OMFATTER
        );
      } else if (values.relasjon === RelationTypeEnum.GENERISK) {
        return (
          subtype === RelationSubtypeEnum.OVERORDNET ||
          subtype === RelationSubtypeEnum.UNDERORDNET
        );
      }
      return false;
    })
    .map((item) => ({
      label: localization.conceptForm.fieldLabel.relationSubtypes[item],
      value: item,
    }));
  relationSubtypeOptions.unshift({
    label: localization.conceptForm.fieldLabel.relationSubtypes["none"],
    value: "",
  });

  let internalRelatedConceptOptions: Option[] = [];
  let externalRelatedConceptOptions: Option[] = [];
  if (relatedConceptType === "internal" && searchTriggered) {
    internalRelatedConceptOptions =
      internalConcepts?.hits
        .filter((rel) => rel.originaltBegrep !== conceptId)
        .map((concept) => ({
          label: getTranslateText(concept.anbefaltTerm?.navn),
          value: concept.originaltBegrep as string,
        })) ?? [];
  } else if (
    relatedConceptType === "internal" &&
    !searchTriggered &&
    initialRelatedConcept
  ) {
    internalRelatedConceptOptions = [
      {
        label: getTranslateText(initialRelatedConcept.title),
        value: initialRelatedConcept.id as string,
      },
    ];
  }

  if (relatedConceptType === "external" && searchTriggered) {
    externalRelatedConceptOptions =
      externalConcepts?.hits
        .filter((rel) => !rel.uri?.includes(conceptId))
        .map((concept) => ({
          label: getTranslateText(concept.title),
          description: getTranslateText(
            concept.organization?.prefLabel,
          ) as string,
          value: concept.uri as string,
        })) ?? [];
  } else if (
    relatedConceptType === "external" &&
    !searchTriggered &&
    initialRelatedConcept
  ) {
    externalRelatedConceptOptions = [
      {
        label: getTranslateText(initialRelatedConcept.title),
        value: initialRelatedConcept.href as string,
      },
    ];
  }

  const handleRelatedConceptTypeChange = (value) => {
    setFieldValue("internal", value === "internal");

    setRelatedConceptType(value as RelatedConceptType);
    setRelatedConcept([]);
  };

  const { getRadioProps: getRelatedConceptTypeRadioProps } = useRadioGroup({
    value: relatedConceptType,
    onChange: (nextValue) => handleRelatedConceptTypeChange(nextValue),
  });

  const handleRelationTypeChange = (value: string[]) => {
    setFieldValue("relasjon", value[0]);
    setFieldValue("relasjonsType", null);
  };

  const handleRelationSubtypeChange = (value: string[]) => {
    setFieldValue("relasjonsType", value[0]);
  };

  const handleSearchConceptChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRelatedConcept([]);
    setSearch(event.target.value);
    setSearchTriggered(true);
  };

  const handleRelatedConceptChange = (value: string[]) => {
    setFieldValue("relatertBegrep", value[0]);
    setRelatedConcept(value);
  };

  const handleCustomRelatedConceptChange = (e) => {
    setRelatedConcept([e.target.value]);
  };

  const internalRelatedConceptComboValue = () => {
    return internalRelatedConceptOptions.find(
      (option) => option.value === relatedConcept[0],
    )
      ? relatedConcept
      : [];
  };

  const externalRelatedConceptComboValue = () => {
    return externalRelatedConceptOptions.find(
      (option) => option.value === relatedConcept[0],
    )
      ? relatedConcept
      : [];
  };

  useEffect(() => {
    setFieldValue("relatertBegrep", relatedConcept[0]);
  }, [relatedConcept]);

  return (
    <div className={styles.root}>
      <div className={styles.flex}>
        <Fieldset data-size="sm">
          <Fieldset.Legend>
            <TitleWithHelpTextAndTag
              helpText={localization.conceptForm.helpText.relatedConcept}
              tagColor="warning"
              tagTitle={localization.tag.required}
            >
              {localization.conceptForm.fieldLabel.relatedConcept}
            </TitleWithHelpTextAndTag>
          </Fieldset.Legend>
          {relatedConceptTypes.map((type) => (
            <Radio
              key={type}
              {...getRelatedConceptTypeRadioProps(type)}
              label={
                localization.conceptForm.fieldLabel.relatedConceptTypes[type]
              }
            />
          ))}
          {relatedConceptType === "internal" && (
            <Combobox
              data-size="sm"
              portal={false}
              value={internalRelatedConceptComboValue()}
              label="Søk begrep"
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
          {relatedConceptType === "external" && (
            <Combobox
              data-size="sm"
              portal={false}
              value={externalRelatedConceptComboValue()}
              label="Søk begrep"
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
          {relatedConceptType === "custom" && (
            <Textfield
              aria-label={localization.conceptForm.fieldLabel.relatedConcept}
              value={relatedConcept[0] ?? ""}
              onChange={handleCustomRelatedConceptChange}
              error={errors.relatertBegrep}
            />
          )}
        </Fieldset>
      </div>
      <FieldsetDivider />

      <Combobox
        label={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.relation}
            tagColor="warning"
            tagTitle={localization.tag.required}
          >
            {localization.conceptForm.fieldLabel.relation}
          </TitleWithHelpTextAndTag>
        }
        data-size="sm"
        portal={false}
        error={errors?.relasjon}
        value={
          values.relasjon &&
          relationTypeOptions.find((type) => type.value === values.relasjon)
            ? [values.relasjon]
            : []
        }
        onValueChange={handleRelationTypeChange}
      >
        {relationTypeOptions.map((rel) => (
          <Combobox.Option key={rel.value} value={rel.value}>
            {rel.label}
          </Combobox.Option>
        ))}
      </Combobox>

      {(values.relasjon === RelationTypeEnum.GENERISK ||
        values.relasjon === RelationTypeEnum.PARTITIV) && (
        <>
          <div className={styles.flex}>
            <Combobox
              label={
                <TitleWithHelpTextAndTag
                  tagColor="warning"
                  tagTitle={localization.tag.required}
                  helpText={
                    localization.conceptForm.helpText.relationLevel[
                      values.relasjon
                    ]
                  }
                >
                  {localization.conceptForm.fieldLabel.relationLevel}
                </TitleWithHelpTextAndTag>
              }
              data-size="sm"
              portal={false}
              value={
                values.relasjonsType &&
                relationSubtypeOptions.find(
                  (type) => type.value === values.relasjonsType,
                )
                  ? [values.relasjonsType]
                  : [""]
              }
              error={errors?.relasjonsType}
              onValueChange={handleRelationSubtypeChange}
            >
              {relationSubtypeOptions.map((type) => (
                <Combobox.Option key={type.value} value={type.value}>
                  {type.label}
                </Combobox.Option>
              ))}
            </Combobox>
          </div>
          <FormikLanguageFieldset
            name="inndelingskriterium"
            legend={
              <TitleWithHelpTextAndTag
                helpText={
                  localization.conceptForm.helpText.devisionCriterion[
                    values.relasjon
                  ]
                }
                tagTitle={localization.tag.recommended}
                tagColor="info"
              >
                {localization.conceptForm.fieldLabel.divisionCriterion}
              </TitleWithHelpTextAndTag>
            }
          />
        </>
      )}
      {values.relasjon === RelationTypeEnum.ASSOSIATIV && (
        <FormikLanguageFieldset
          name="beskrivelse"
          legend={
            <TitleWithHelpTextAndTag
              helpText={localization.conceptForm.helpText.relationRole}
            >
              {localization.conceptForm.fieldLabel.relationRole}
            </TitleWithHelpTextAndTag>
          }
        />
      )}
    </div>
  );
};
