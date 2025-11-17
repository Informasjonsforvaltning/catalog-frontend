'use client';
import { ReferenceDataCode } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Accordion } from '@digdir/designsystemet-react';
import { CheckboxGroup } from '@fellesdatakatalog/ui';

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
            <CheckboxGroup
              value={statusFilters}
              onChange={(values) => onStatusChange(values)}
              hideLegend
              legend={localization.serviceCatalog.serviceStatus}
              options={statuses.map((status) => ({
                value: status.uri,
                label: getTranslateText(status.label) || '',
              }))}
            />
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item open>
          <Accordion.Header level={2}>{localization.publicationState.state}</Accordion.Header>
          <Accordion.Content>
            <CheckboxGroup
              value={publicationState}
              onChange={(values) => onPublicationStateChange(values)}
              hideLegend
              legend={localization.publicationState.state}
              options={publicationStates.map((state) => ({
                value: state.value,
                label: getTranslateText(state.name) || '',
              }))}
            />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Filter;
