"use client";
import { ReferenceDataCode } from "@catalog-frontend/types";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { Details, Checkbox } from "@digdir/designsystemet-react";

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
    <div>
      <Details open>
        <Details.Summary>
          {localization.serviceCatalog.serviceStatus}
        </Details.Summary>
        <Details.Content>
          <Checkbox.Group
            value={statusFilters}
            onChange={(values) => onStatusChange(values)}
            hideLegend
            legend={localization.serviceCatalog.serviceStatus}
          >
            {statuses.map((status) => (
              <Checkbox key={`filter-${status.code}`} value={status.uri}>
                {getTranslateText(status.label)}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Details.Content>
      </Details>
      <Details open>
        <Details.Summary>
          {localization.publicationState.state}
        </Details.Summary>
        <Details.Content>
          <Checkbox.Group
            value={publicationState}
            onChange={(values) => onPublicationStateChange(values)}
            hideLegend
            legend={localization.publicationState.state}
          >
            {publicationStates.map((state) => (
              <Checkbox key={state.name} value={state.value}>
                {state.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Details.Content>
      </Details>
    </div>
  );
};

export default Filter;
