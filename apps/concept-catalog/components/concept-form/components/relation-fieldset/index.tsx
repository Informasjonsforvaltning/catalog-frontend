"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useFormikContext } from "formik";
import {
  Fieldset,
  Radio,
  Textfield,
  useRadioGroup,
} from "@digdir/designsystemet-react";
import {
  FieldsetDivider,
  FormikLanguageFieldset,
  SearchSuggestionSelect,
  SingleSuggestionSelect,
  TitleWithHelpTextAndTag,
  useSuggestionMounted,
} from "@catalog-frontend/ui";
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

const getInitialSelectedRelatedConceptOption = (
  relatedConcept?: RelatedConcept,
): Option | null => {
  if (!relatedConcept) {
    return null;
  }

  if (relatedConcept.id) {
    return {
      label: getTranslateText(relatedConcept.title),
      value: relatedConcept.id,
    };
  }

  if (relatedConcept.href) {
    return {
      label: getTranslateText(relatedConcept.title),
      value: relatedConcept.href,
    };
  }

  return null;
};

const withSelectedOption = (options: Option[], selected: Option | null) => {
  if (!selected || options.some((option) => option.value === selected.value)) {
    return options;
  }

  return [selected, ...options];
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
  const isMounted = useSuggestionMounted();
  const [relatedConcept, setRelatedConcept] = useState<string[]>(
    getRelatedConceptStateValue(initialRelatedConcept),
  );
  const [relatedConceptType, setRelatedConceptType] =
    useState<RelatedConceptType>(
      getRelatedConceptTypeStateValue(initialRelatedConcept),
    );
  const [search, setSearch] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [selectedRelatedConceptOption, setSelectedRelatedConceptOption] =
    useState<Option | null>(
      getInitialSelectedRelatedConceptOption(initialRelatedConcept),
    );
  const skipSearchClearRef = useRef(false);

  const { data: internalConcepts, isFetching: isFetchingInternal } =
    useSearchInternalConcepts({
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

  const { data: externalConcepts, isFetching: isFetchingExternal } =
    useDataNorgeSearchConcepts({
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

  const relationSubtypeOptions = useMemo(() => {
    const options = relationSubtypes
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

    return options;
  }, [values.relasjon]);

  const internalRelatedConceptOptions = useMemo(() => {
    let options: Option[] = [];

    if (relatedConceptType === "internal" && searchTriggered) {
      options =
        internalConcepts?.hits
          .filter((rel) => !conceptId || rel.originaltBegrep !== conceptId)
          .map((concept) => ({
            label: getTranslateText(concept.anbefaltTerm?.navn),
            value: concept.originaltBegrep as string,
          })) ?? [];
    } else if (
      relatedConceptType === "internal" &&
      !searchTriggered &&
      initialRelatedConcept
    ) {
      options = [
        {
          label: getTranslateText(initialRelatedConcept.title),
          value: initialRelatedConcept.id as string,
        },
      ];
    }

    if (relatedConceptType === "internal") {
      options = withSelectedOption(options, selectedRelatedConceptOption);
    }

    return options;
  }, [
    conceptId,
    initialRelatedConcept,
    internalConcepts?.hits,
    relatedConceptType,
    searchTriggered,
    selectedRelatedConceptOption,
  ]);

  const externalRelatedConceptOptions = useMemo(() => {
    let options: Option[] = [];

    if (relatedConceptType === "external" && searchTriggered) {
      const mapped =
        externalConcepts?.hits
          .filter((rel) => !conceptId || !rel.uri?.includes(conceptId))
          .filter((concept) => Boolean(concept.uri))
          .map(
            (concept) =>
              [
                concept.uri,
                {
                  label: getTranslateText(concept.title),
                  description: getTranslateText(
                    concept.organization?.prefLabel,
                  ) as string,
                  value: concept.uri as string,
                },
              ] as const,
          ) ?? [];

      options = [...new Map(mapped).values()];
    } else if (
      relatedConceptType === "external" &&
      !searchTriggered &&
      initialRelatedConcept
    ) {
      options = [
        {
          label: getTranslateText(initialRelatedConcept.title),
          value: initialRelatedConcept.href as string,
        },
      ];
    }

    if (relatedConceptType === "external") {
      options = withSelectedOption(options, selectedRelatedConceptOption);
    }

    return options;
  }, [
    conceptId,
    externalConcepts?.hits,
    initialRelatedConcept,
    relatedConceptType,
    searchTriggered,
    selectedRelatedConceptOption,
  ]);

  const internalSearchEmptyMessage = isFetchingInternal
    ? `${localization.loading}...`
    : search
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  const externalSearchEmptyMessage = isFetchingExternal
    ? `${localization.loading}...`
    : search
      ? localization.search.noHits
      : `${localization.search.typeToSearch}...`;

  const handleRelatedConceptTypeChange = (value: string) => {
    setRelatedConceptType(value as RelatedConceptType);
    setRelatedConcept([]);
    setSelectedRelatedConceptOption(null);
  };

  const { getRadioProps: getRelatedConceptTypeRadioProps } = useRadioGroup({
    value: relatedConceptType,
    onChange: (nextValue) => handleRelatedConceptTypeChange(nextValue),
  });

  const handleSearchConceptChange = (value: string) => {
    if (skipSearchClearRef.current) {
      skipSearchClearRef.current = false;
      return;
    }

    if (relatedConcept[0] && selectedRelatedConceptOption?.label === value) {
      return;
    }

    setRelatedConcept([]);
    setSelectedRelatedConceptOption(null);
    setSearch(value);
    setSearchTriggered(true);
  };

  const handleRelatedConceptChange = (value: string | undefined) => {
    skipSearchClearRef.current = true;

    if (value) {
      if (relatedConceptType === "internal") {
        const selectedOption =
          internalRelatedConceptOptions.find(
            (option) => option.value === value,
          ) ??
          internalConcepts?.hits
            .filter((rel) => !conceptId || rel.originaltBegrep !== conceptId)
            .map((concept) => ({
              label: getTranslateText(concept.anbefaltTerm?.navn),
              value: concept.originaltBegrep as string,
            }))
            .find((option) => option.value === value);

        setSelectedRelatedConceptOption(
          selectedOption ?? { value, label: value },
        );
      } else if (relatedConceptType === "external") {
        const optionFromList = externalRelatedConceptOptions.find(
          (option) => option.value === value,
        );

        if (optionFromList) {
          setSelectedRelatedConceptOption(optionFromList);
        } else {
          const hit = externalConcepts?.hits
            .filter((rel) => !conceptId || !rel.uri?.includes(conceptId))
            .find((concept) => concept.uri === value);

          setSelectedRelatedConceptOption(
            hit
              ? {
                  value,
                  label: getTranslateText(hit.title),
                  description: getTranslateText(hit.organization?.prefLabel),
                }
              : { value, label: value },
          );
        }
      }
    } else {
      setSelectedRelatedConceptOption(null);
    }

    setFieldValue("relatertBegrep", value);
    setRelatedConcept(value ? [value] : []);
  };

  const handleCustomRelatedConceptChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setRelatedConcept([event.target.value]);
  };

  const selectedInternalRelatedConcept = relatedConcept[0];
  const selectedExternalRelatedConcept = relatedConcept[0];

  const selectedRelationType =
    values.relasjon &&
    relationTypeOptions.find((type) => type.value === values.relasjon)
      ? values.relasjon
      : undefined;

  const selectedRelationSubtype =
    values.relasjonsType &&
    relationSubtypeOptions.find((type) => type.value === values.relasjonsType)
      ? values.relasjonsType
      : "";

  useEffect(() => {
    setFieldValue("internal", relatedConceptType === "internal");
  }, [relatedConceptType, setFieldValue]);

  useEffect(() => {
    setFieldValue("relatertBegrep", relatedConcept[0]);
  }, [relatedConcept, setFieldValue]);

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
            <SearchSuggestionSelect
              ariaLabel="Søk begrep"
              emptyMessage={internalSearchEmptyMessage}
              error={errors.relatertBegrep}
              isFetching={isFetchingInternal}
              isMounted={isMounted}
              onSearch={handleSearchConceptChange}
              onValueChange={handleRelatedConceptChange}
              options={internalRelatedConceptOptions}
              value={selectedInternalRelatedConcept}
            />
          )}
          {relatedConceptType === "external" && (
            <SearchSuggestionSelect
              ariaLabel="Søk begrep"
              emptyMessage={externalSearchEmptyMessage}
              error={errors.relatertBegrep}
              isFetching={isFetchingExternal}
              isMounted={isMounted}
              onSearch={handleSearchConceptChange}
              onValueChange={handleRelatedConceptChange}
              options={externalRelatedConceptOptions}
              value={selectedExternalRelatedConcept}
            />
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

      <SingleSuggestionSelect
        ariaLabel={localization.conceptForm.fieldLabel.relation}
        error={errors?.relasjon}
        fieldsetLegend={
          <TitleWithHelpTextAndTag
            helpText={localization.conceptForm.helpText.relation}
            tagColor="warning"
            tagTitle={localization.tag.required}
          >
            {localization.conceptForm.fieldLabel.relation}
          </TitleWithHelpTextAndTag>
        }
        isMounted={isMounted}
        onValueChange={(value) => {
          setFieldValue("relasjon", value);
          setFieldValue("relasjonsType", null);
        }}
        options={relationTypeOptions}
        value={selectedRelationType}
      />

      {(values.relasjon === RelationTypeEnum.GENERISK ||
        values.relasjon === RelationTypeEnum.PARTITIV) && (
        <>
          <div className={styles.flex}>
            <SingleSuggestionSelect
              ariaLabel={localization.conceptForm.fieldLabel.relationLevel}
              error={errors?.relasjonsType}
              fieldsetLegend={
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
              isMounted={isMounted}
              onValueChange={(value) => setFieldValue("relasjonsType", value)}
              options={relationSubtypeOptions}
              value={selectedRelationSubtype}
            />
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
