'use client';
import { ReferenceDataCode } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Accordion, Checkbox } from '@digdir/designsystemet-react';

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
    { name: localization.publicationState.published, value: 'true' },
    { name: localization.publicationState.unpublished, value: 'false' },
  ];

  return (
    <div>
      <Accordion border={true}>
        <Accordion.Item open>
          <Accordion.Header level={2}>{localization.serviceCatalog.serviceStatus}</Accordion.Header>
          <Accordion.Content>
            <Checkbox.Group
              value={statusFilters}
              onChange={(values) => onStatusChange(values)}
              hideLegend
              legend={localization.serviceCatalog.serviceStatus}
            >
              {statuses.map((status) => (
                <Checkbox
                  key={`filter-${status.code}`}
                  value={status.uri}
                >
                  {getTranslateText(status.label)}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item open>
          <Accordion.Header level={2}>{localization.publicationState.state}</Accordion.Header>
          <Accordion.Content>
            <Checkbox.Group
              value={publicationState}
              onChange={(values) => onPublicationStateChange(values)}
              hideLegend
              legend={localization.publicationState.state}
            >
              {publicationStates.map((state) => (
                <Checkbox
                  key={state.name}
                  value={state.value}
                >
                  {getTranslateText(state.name)}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Filter;
