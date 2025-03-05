'use client';

import { getTranslateText, sortAscending } from '@catalog-frontend/utils';

import { Organization } from '@catalog-frontend/types';
import { Combobox, Spinner } from '@digdir/designsystemet-react';
import { useRouter } from 'next/navigation';
import styles from './organization-combobox.module.css';
import { useState } from 'react';

type OrganizationComboboxProps = {
  organizations: Organization[];
};

const OrganizationCombobox = (props: OrganizationComboboxProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const { organizations } = props;

  const sortedOrganization = organizations.sort((a, b) =>
    sortAscending(getTranslateText(a.prefLabel).toString(), getTranslateText(b.prefLabel).toString()),
  );

  return (
    <div className={styles.container}>
      <Combobox
        className={styles.combobox}
        size='sm'
        label={'Virksomhet'}
        placeholder='Velg en virksomhet'
        onValueChange={(value) => {
          const match = organizations.find((org) => org.organizationId === value[0]);
          if (match) {
            setLoading(true);
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
      {loading && (
        <Spinner title={'Laster virksomhet'} />
      )}      
    </div>
  );
};

export default OrganizationCombobox;
