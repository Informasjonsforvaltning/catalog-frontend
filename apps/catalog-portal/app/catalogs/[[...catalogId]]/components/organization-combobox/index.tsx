"use client";

import {
  getTranslateText,
  localization,
  sortAscending,
} from "@catalog-frontend/utils";

import { Organization } from "@catalog-frontend/types";
import {
  EXPERIMENTAL_Suggestion as Suggestion,
  Field,
  Input,
  Label,
  Spinner,
} from "@digdir/designsystemet-react";
import { useRouter } from "next/navigation";
import styles from "./organization-combobox.module.css";
import { useEffect, useMemo, useState } from "react";

type OrganizationComboboxProps = {
  organizations: Organization[];
  currentOrganization?: Organization;
};

const getOrganizationLabel = (organization: Organization) =>
  getTranslateText(organization.prefLabel);

const OrganizationCombobox = (props: OrganizationComboboxProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { organizations, currentOrganization } = props;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const organizationOptions = useMemo(
    () =>
      [...organizations]
        .filter(
          (org) => org.organizationId !== currentOrganization?.organizationId,
        )
        .sort((a, b) =>
          sortAscending(getOrganizationLabel(a), getOrganizationLabel(b)),
        ),
    [organizations, currentOrganization?.organizationId],
  );

  return (
    <div className={styles.container}>
      <Field data-size="sm" className={styles.combobox}>
        <Label>Virksomhet</Label>
        {isMounted ? (
          <Suggestion
            data-size="sm"
            onSelectedChange={(selectedItem) => {
              if (selectedItem) {
                setLoading(true);
                router.push(`/catalogs/${selectedItem.value}`);
              }
            }}
          >
            <Suggestion.Input
              aria-busy={loading}
              disabled={loading}
              placeholder="Velg en virksomhet"
            />
            <Suggestion.List>
              <Suggestion.Empty>{localization.search.noHits}</Suggestion.Empty>
              {organizationOptions.map((org) => (
                <Suggestion.Option
                  key={org.organizationId}
                  value={org.organizationId}
                  label={getOrganizationLabel(org)}
                >
                  {getOrganizationLabel(org)}
                </Suggestion.Option>
              ))}
            </Suggestion.List>
          </Suggestion>
        ) : (
          <Input
            data-size="sm"
            disabled
            readOnly
            placeholder="Velg en virksomhet"
          />
        )}
      </Field>
      {loading && <Spinner aria-label="Laster virksomhet" />}
    </div>
  );
};

export default OrganizationCombobox;
