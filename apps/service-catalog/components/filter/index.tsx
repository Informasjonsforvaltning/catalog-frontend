"use client";
import { ReferenceDataCode } from "@catalog-frontend/types";
import { CheckboxGroupFilter } from "@catalog-frontend/ui-v2";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { Card, Details } from "@digdir/designsystemet-react";

type Props = {
  statuses: ReferenceDataCode[];
  onStatusChange: (values: string[] | []) => void;
  onPublicationStateChange: (values: string[] | []) => void;
  statusFilters: string[];
  publicationState: string[];
};

export const Filter = ({
  statuses,
  onStatusChange,
  onPublicationStateChange,
  statusFilters,
  publicationState,
}: Props) => {
  const publicationStates = [
    { name: localization.publicationState.published, value: "true" },
    { name: localization.publicationState.unpublished, value: "false" },
  ];

  return (
    <Card>
      <Details defaultOpen>
        <Details.Summary>
          {localization.serviceCatalog.serviceStatus}
        </Details.Summary>
        <Details.Content>
          <CheckboxGroupFilter
            value={statusFilters}
            items={statuses.map((state) => ({
              value: state.uri,
              label: getTranslateText(state.label),
            }))}
            onChange={onStatusChange}
          />
        </Details.Content>
      </Details>
      <Details defaultOpen>
        <Details.Summary>{localization.publicationState.state}</Details.Summary>
        <Details.Content>
          <CheckboxGroupFilter
            value={publicationState}
            items={publicationStates.map((state) => ({
              value: state.value,
              label: state.name,
            }))}
            onChange={onPublicationStateChange}
          />
        </Details.Content>
      </Details>
    </Card>
  );
};

export default Filter;
