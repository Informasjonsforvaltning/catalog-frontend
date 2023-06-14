import { CheckboxGroup } from '@catalog-frontend/ui';
import { CheckboxGroupItem } from '@digdir/design-system-react';
import { useSearchState } from '../../context/search';
import { uniqueId } from 'lodash';
import { PublishedFilterType } from '../../context/search/state';

export const createCheckboxGroup = (componentName: string, labels: string[], onChange: (e) => void) => {
  if (!componentName) {
    throw new Error('componentName is required');
  }

  if (!labels || !Array.isArray(labels)) {
    throw new Error('labels is required and should be an array');
  }

  const CustomComponent = () => {
    const searchState = useSearchState();

    return (
      <CheckboxGroup
        onChange={onChange}
        items={labels.map<CheckboxGroupItem>((label: string) => ({
          name: label,
          key: `checkbox-item-${uniqueId()}`,
          label: label,
          checked: searchState.filters.published?.includes(label as PublishedFilterType),
        }))}
      />
    );
  };

  CustomComponent.displayName = componentName;
  return CustomComponent;
};
