"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./code-lists.module.css";
import { Card, Details, Heading } from "@digdir/designsystemet-react";
import {
  Button,
  SearchField,
  useWarnIfUnsavedChanges,
} from "@catalog-frontend/ui";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import { useGetAllCodeLists } from "../../../../../hooks/code-lists";
import { Code, CodeList } from "@catalog-frontend/types";
import { localization } from "@catalog-frontend/utils";
import { useAdminDispatch, useAdminState } from "../../../../../context/admin";
import CodeListEditor from "../../../../../components/code-list-editor";
import { PageLayout } from "../../../../../components/page-layout";
import { compare } from "fast-json-patch";

export interface CodeListsPageClientProps {
  catalogId: string;
  codeListsInUse: string[];
}

const CodeListsPageClient = ({
  catalogId,
  codeListsInUse,
}: CodeListsPageClientProps) => {
  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { showCodeListEditor, updatedCodeLists, updatedCodes } = adminContext;

  const [search, setSearch] = useState("");
  const [dirtyCodeLists, setDirtyCodeLists] = useState<string[]>([]);
  const [initialCodes, setInitialCodes] = useState<{ [key: string]: Code[] }>(
    {},
  );

  const { data: getAllCodeLists } = useGetAllCodeLists({
    catalogId: catalogId,
  });
  const dbCodeLists = useMemo(
    () => getAllCodeLists?.codeLists ?? [],
    [getAllCodeLists],
  );

  useEffect(() => {
    if (Object.keys(initialCodes).length === 0) {
      setInitialCodes({ ...updatedCodes });
    }
  }, [updatedCodes]);

  const filteredCodeLists = () =>
    dbCodeLists.filter((codeList: CodeList) =>
      codeList.name.toLowerCase().includes(search.toLowerCase()),
    );

  const unsavedCodeChanges = () => {
    return updatedCodes && initialCodes
      ? compare(updatedCodes, initialCodes).length > 0
      : false;
  };

  const unsavedCodeListChanges = () => {
    return updatedCodeLists ? updatedCodeLists?.length > 0 : false;
  };

  useWarnIfUnsavedChanges({
    unsavedChanges:
      unsavedCodeChanges() ||
      unsavedCodeListChanges() ||
      dirtyCodeLists.length > 0,
  });

  useEffect(() => {
    // Adds a copy of the codes in context
    const updatedCodesAccumulator = { ...updatedCodes };

    dbCodeLists.forEach((codeList: CodeList) => {
      if (codeList) {
        updatedCodesAccumulator[codeList.id ?? ""] = codeList?.codes ?? [];
      }
    });

    adminDispatch({
      type: "SET_UPDATED_CODES",
      payload: { updatedCodes: updatedCodesAccumulator },
    });
  }, [dbCodeLists]);

  const handleCreateCodeList = () => {
    adminDispatch({
      type: "SET_SHOW_CODE_LIST_EDITOR",
      payload: { showCodeListEditor: true },
    });
    adminDispatch({
      type: "SET_UPDATED_CODES",
      payload: { updatedCodes: { ...updatedCodes, ["0"]: [] } },
    });
  };

  return (
    <PageLayout>
      <div className={styles.row}>
        <SearchField
          placeholder="Søk etter kodeliste..."
          onSearch={(search) => setSearch(search)}
        />

        <Button onClick={handleCreateCodeList}>
          <PlusCircleIcon />
          {localization.catalogAdmin.createCodeList}
        </Button>
      </div>
      <Heading level={2} data-size="xs">
        {localization.catalogAdmin.codeLists}
      </Heading>
      <div className="accordionStructure">
        {showCodeListEditor && (
          <Card className="accordionWidth">
            <Details defaultOpen={showCodeListEditor}>
              <Details.Summary>
                <Heading data-size="sm" />
              </Details.Summary>

              <Details.Content>
                <CodeListEditor type="create" catalogId={catalogId} />
              </Details.Content>
            </Details>
          </Card>
        )}
        {filteredCodeLists() &&
          filteredCodeLists()?.map((codeList: CodeList, index: number) => (
            <Card className="accordionWidth" key={index}>
              <Details>
                <Details.Summary>
                  <div>
                    <Heading data-size="xs">{codeList.name}</Heading>
                    <p className={styles.description}>{codeList.description}</p>
                  </div>
                </Details.Summary>
                <Details.Content>
                  <p className={styles.id}>ID: {codeList.id}</p>
                </Details.Content>

                <Details.Content>
                  <CodeListEditor
                    codeList={codeList}
                    codeListsInUse={codeListsInUse}
                    catalogId={catalogId}
                    dirty={(dirty) =>
                      setDirtyCodeLists((prev) => {
                        if (dirty && !prev.includes(codeList.id ?? "")) {
                          return [...prev, codeList.id ?? ""];
                        }
                        if (!dirty) {
                          return prev.filter((id) => id !== codeList.id);
                        }
                        return prev;
                      })
                    }
                  />
                </Details.Content>
              </Details>
            </Card>
          ))}
      </div>
    </PageLayout>
  );
};

export default CodeListsPageClient;
