'use client';

import { getTranslateText, sortAscending } from '@catalog-frontend/utils';

import { Organization } from '@catalog-frontend/types';
import { Combobox } from '@digdir/designsystemet-react';
import { useRouter } from 'next/navigation';

type OrganizationComboboxProps = {
  organizations: Organization[];
};

const OrganizationCombobox = (props: OrganizationComboboxProps) => {
  const { organizations } = props;

  const sortedOrganization = organizations.sort((a, b) =>
    sortAscending(getTranslateText(a.prefLabel).toString(), getTranslateText(b.prefLabel).toString()),
  );

  const router = useRouter();

  return (
    <div style={{ width: 500 }}>
      <Combobox
        size='sm'
        label={'Virksomhet'}
        placeholder='Velg en virksomhet'
        onValueChange={(value) => {
          const match = organizations.find((org) => org.organizationId === value[0]);
          if (match) {
            router.push(`/catalogs/${value[0]}`);
          }
        }}
      >
        {sortedOrganization.map((org) => (
          <Combobox.Option
            key={org.organizationId}
            value={org.organizationId}
          >
            {getTranslateText(org.prefLabel)}
          </Combobox.Option>
        ))}
      </Combobox>
    </div>
  );
};

export default OrganizationCombobox;
