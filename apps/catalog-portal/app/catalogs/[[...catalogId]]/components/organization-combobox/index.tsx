"use client";

import {
  getTranslateText,
  localization,
  sortAscending,
} from "@catalog-frontend/utils";
import {
  SingleSuggestionSelect,
  useSuggestionMounted,
} from "@catalog-frontend/ui";

import { Organization } from "@catalog-frontend/types";
import { Field, Label, Spinner } from "@digdir/designsystemet-react";
import { useRouter } from "next/navigation";
import styles from "./organization-combobox.module.css";
import { useMemo, useState } from "react";

type OrganizationComboboxProps = {
  organizations: Organization[];
  currentOrganization?: Organization;
};

const getOrganizationLabel = (organization: Organization) =>
  getTranslateText(organization.prefLabel);

const OrganizationCombobox = (props: OrganizationComboboxProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isMounted = useSuggestionMounted();

  const { organizations, currentOrganization } = props;

  const organizationOptions = useMemo(
    () =>
      [...organizations]
        .filter(
          (org) => org.organizationId !== currentOrganization?.organizationId,
        )
        .sort((a, b) =>
          sortAscending(getOrganizationLabel(a), getOrganizationLabel(b)),
        )
        .map((org) => ({
          value: org.organizationId,
          label: getOrganizationLabel(org),
        })),
    [organizations, currentOrganization?.organizationId],
  );

  return (
    <div className={styles.container}>
      <Field data-size="sm" className={styles.combobox}>
        <Label>Virksomhet</Label>
        <SingleSuggestionSelect
          disabled={loading}
          emptyMessage={localization.search.noHits}
          isMounted={isMounted}
          onValueChange={(value) => {
            if (value) {
              setLoading(true);
              router.push(`/catalogs/${value}`);
            }
          }}
          options={organizationOptions}
          placeholder="Velg en virksomhet"
        />
      </Field>
      {loading && <Spinner aria-label="Laster virksomhet" />}
    </div>
  );
};

export default OrganizationCombobox;
