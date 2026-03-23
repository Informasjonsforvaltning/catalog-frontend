"use client";

import React from "react";
import styles from "./internal-fields.module.css";
import { Card, Details, Heading } from "@digdir/designsystemet-react";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import { Button } from "@catalog-frontend/ui";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { InternalField } from "@catalog-frontend/types";
import { useGetInternalFields } from "../../../../../hooks/internal-fields";
import { InternalFieldEditor } from "../../../../../components/internal-field-editor";
import { useAdminDispatch, useAdminState } from "../../../../../context/admin";
import { PageLayout } from "../../../../../components/page-layout";

export interface InternalFieldsPageClientProps {
  catalogId: string;
}

export const InternalFieldsPageClient = ({
  catalogId,
}: InternalFieldsPageClientProps) => {
  const { data: getInternalFields } = useGetInternalFields(catalogId);
  const dbFields = getInternalFields?.internal;

  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { showInternalFieldEditor } = adminContext;

  const handleCreateInternalField = () => {
    adminDispatch({
      type: "SET_SHOW_INTERNAL_FIELD_EDITOR",
      payload: { showInternalFieldEditor: true },
    });
  };

  return (
    <PageLayout>
      <div className={styles.topButtonRow}>
        <Button onClick={handleCreateInternalField}>
          <PlusCircleIcon title="" />
          {localization.catalogAdmin.create.newInternalField}
        </Button>
      </div>

      <Heading level={2} data-size="xs">
        {localization.catalogAdmin.internalFields}
      </Heading>
      <div className="accordionStructure">
        {showInternalFieldEditor && (
          <Card className="accordionWidth">
            <Details defaultOpen={showInternalFieldEditor}>
              <Details.Summary>
                <Heading data-size="sm" className={styles.label} level={3} />
              </Details.Summary>
              <Details.Content>
                <InternalFieldEditor catalogId={catalogId} />
              </Details.Content>
            </Details>
          </Card>
        )}
        {dbFields?.map((field: InternalField) => (
          <Card key={field.id} className="accordionWidth">
            <Details>
              <Details.Summary>
                <Heading data-size="xs" className={styles.label}>
                  {getTranslateText(field.label)}
                </Heading>
              </Details.Summary>

              <Details.Content>
                <InternalFieldEditor field={field} catalogId={catalogId} />
              </Details.Content>
            </Details>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default InternalFieldsPageClient;
