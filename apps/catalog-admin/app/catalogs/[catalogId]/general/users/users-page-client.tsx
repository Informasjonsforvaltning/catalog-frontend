"use client";

import React, { useEffect, useState } from "react";
import { Card, Details, Heading } from "@digdir/designsystemet-react";
import { Button, SearchField } from "@catalog-frontend/ui-v2";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import { localization } from "@catalog-frontend/utils";
import { useGetUsers } from "../../../../../hooks/users";
import { AssignedUser } from "@catalog-frontend/types";
import { UserEditor } from "../../../../../components/user-editor";
import { useAdminDispatch, useAdminState } from "../../../../../context/admin";

import styles from "./users.module.css";
import { PageLayout } from "../../../../../components/page-layout";

export interface UsersPageClientProps {
  catalogId: string;
}

export const UsersPageClient = ({ catalogId }: UsersPageClientProps) => {
  const { data: getUsers } = useGetUsers(catalogId);
  const dbUsers = getUsers?.users;

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { showUserEditor } = adminContext;

  useEffect(() => {
    const filteredCodeLists = dbUsers?.filter((user: AssignedUser) =>
      user.name?.toLowerCase().includes(search.toLowerCase()),
    );
    setSearchResults(filteredCodeLists);
  }, [dbUsers, search]);

  const handleCreateUser = () => {
    adminDispatch({
      type: "SET_SHOW_USER_EDITOR",
      payload: { showUserEditor: true },
    });
  };

  return (
    <PageLayout>
      <div className={styles.row}>
        <SearchField
          placeholder={localization.search.searchForUsername}
          onSearch={(search) => setSearch(search)}
        />
        <div className="editorButtons">
          <Button className={styles.createButton} onClick={handleCreateUser}>
            <PlusCircleIcon />
            {localization.catalogAdmin.addUser}
          </Button>
        </div>
      </div>

      <Heading level={2} data-size="xs">
        {localization.catalogAdmin.username}
      </Heading>

      <div className="accordionStructure">
        {showUserEditor && (
          <Card className="accordionWidth">
            <Details defaultOpen={showUserEditor}>
              <Details.Summary>
                <Heading data-size="xs" level={3} />
              </Details.Summary>
              <Details.Content>
                <UserEditor type="create" catalogId={catalogId} />
              </Details.Content>
            </Details>
          </Card>
        )}

        {searchResults?.length < 1 && (
          <Heading data-size="md">{localization.search.noHits}</Heading>
        )}
        {searchResults &&
          searchResults.map((user: AssignedUser, index: number) => (
            <Card key={index} className="accordionWidth">
              <Details>
                <Details.Summary>
                  <Heading data-size="xs">{user.name}</Heading>
                </Details.Summary>
                <Details.Content>
                  <UserEditor user={user} catalogId={catalogId} />
                </Details.Content>
              </Details>
            </Card>
          ))}
      </div>
    </PageLayout>
  );
};

export default UsersPageClient;
