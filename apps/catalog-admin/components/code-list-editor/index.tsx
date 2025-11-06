"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "@catalog-frontend/ui";
import { Textfield } from "@digdir/designsystemet-react";
import { CodeList, EditorType } from "@catalog-frontend/types";
import { localization } from "@catalog-frontend/utils";
import { useAdminDispatch, useAdminState } from "../../context/admin";
import {
  useCreateCodeList,
  useDeleteCodeList,
  useGetAllCodeLists,
  useUpdateCodeList,
} from "../../hooks/code-lists";
import { compare } from "fast-json-patch";
import { CodesEditor } from "../codes-editor";

interface Props {
  codeList?: CodeList;
  codeListsInUse?: string[];
  type?: EditorType;
  dirty?: (dirty: boolean) => void;
  catalogId: string;
}

export const CodeListEditor = ({
  catalogId,
  codeList,
  codeListsInUse,
  type,
  dirty,
}: Props) => {
  const adminDispatch = useAdminDispatch();
  const { updatedCodeLists, updatedCodes } = useAdminState();

  const createCodeList = useCreateCodeList(catalogId);
  const deleteCodeList = useDeleteCodeList(catalogId);
  const updateCodeList = useUpdateCodeList(catalogId);

  const { data: getAllCodeLists } = useGetAllCodeLists({
    catalogId: catalogId,
  });
  const dbCodeLists = getAllCodeLists?.codeLists ?? [];

  const newCodeListTemplate = {
    id: "",
    catalogId: catalogId,
    name: "",
    description: "",
    codes: [],
  };

  const [newCodeList, setNewCodeList] = useState<CodeList>(newCodeListTemplate);

  useEffect(() => {
    if (updatedCodes) {
      setNewCodeList((prevCodeList) => ({
        ...prevCodeList,
        codes: updatedCodes["0"],
      }));
    }
  }, [updatedCodes]);

  useEffect(() => {
    if (dirty) {
      dirty(newCodeList.name !== "" || newCodeList.description !== "");
    }
  }, [newCodeList]);

  const handleDeleteCodeList = (codeListId: string) => {
    if (!codeListsInUse?.includes(codeListId)) {
      if (window.confirm(localization.codeList.confirmDelete)) {
        deleteCodeList.mutate(codeListId);
      }
    } else {
      window.alert(localization.alert.codeListInUse);
    }
  };

  const handleCodeListUpdate = (
    codeListId?: string,
    newName?: string,
    newDescription?: string,
  ) => {
    const indexInUpdatedCodeLists =
      updatedCodeLists?.findIndex((codeList) => codeList.id === codeListId) ??
      -1;

    if (indexInUpdatedCodeLists !== -1) {
      const codeListToUpdate = updatedCodeLists?.[indexInUpdatedCodeLists];

      if (codeListToUpdate) {
        const updatedCodeList = {
          ...codeListToUpdate,
          name: newName !== undefined ? newName : codeListToUpdate.name,
          description:
            newDescription !== undefined
              ? newDescription
              : codeListToUpdate.description,
        };

        const updatedCodeListsCopy = [...updatedCodeLists];
        updatedCodeListsCopy[indexInUpdatedCodeLists] = updatedCodeList;

        adminDispatch({
          type: "SET_CODE_LISTS",
          payload: { updatedCodeLists: updatedCodeListsCopy },
        });
      }
    } else {
      const codeListToUpdate = dbCodeLists.find(
        (codeList: any) => codeList.id === codeListId,
      );

      if (codeListToUpdate) {
        const updatedCodeList = {
          ...codeListToUpdate,
          name: newName !== undefined ? newName : codeListToUpdate.name,
          description:
            newDescription !== undefined
              ? newDescription
              : codeListToUpdate.description,
        };

        const updatedCodeListsCopy = [
          ...(updatedCodeLists || []),
          updatedCodeList,
        ];
        adminDispatch({
          type: "SET_CODE_LISTS",
          payload: { updatedCodeLists: updatedCodeListsCopy },
        });
      }
    }
  };

  const handleCancel = () => {
    adminDispatch({
      type: "SET_SHOW_CODE_LIST_EDITOR",
      payload: { showCodeListEditor: false },
    });
  };

  const handleCreateCodeList = () => {
    createCodeList
      .mutateAsync(newCodeList)
      .then(() => {
        alert(localization.alert.success);
        handleCancel();
      })
      .catch(() => {
        alert(localization.alert.fail);
      });
  };

  const handleUpdateDbCodeList = (codeListId: string) => {
    const dbCodeList = dbCodeLists.find(
      (codeList: CodeList) => codeList.id === codeListId,
    );
    const updatedCodeList =
      updatedCodeLists?.find((codeList) => codeList.id === codeListId) ??
      dbCodeList;
    const newCodes = updatedCodes?.[codeListId];

    const updatedCodeListCopy = {
      ...updatedCodeList,
      codes: newCodes,
    };

    if (updatedCodeListCopy && dbCodeList) {
      const diff = compare(dbCodeList, updatedCodeListCopy);
      if (diff.length > 0) {
        updateCodeList
          .mutateAsync({
            oldCodeList: dbCodeList,
            newCodeList: updatedCodeListCopy,
          })
          .then(() => {
            alert(localization.alert.success);
          })
          .catch(() => {
            alert(localization.alert.fail);
          });
      } else {
        window.alert(localization.alert.noChanges);
      }
    }
  };

  return (
    <div className="editorStructure">
      <div className="editorSpacing">
        <Textfield
          label={localization.name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            type === "create"
              ? setNewCodeList((prevCodeList) => ({
                  ...prevCodeList,
                  name: event.target.value,
                }))
              : handleCodeListUpdate(
                  codeList?.id,
                  event.target.value,
                  undefined,
                );
          }}
          value={
            (updatedCodeLists?.find((c) => c.id === codeList?.id) || codeList)
              ?.name || newCodeList?.name
          }
        />
      </div>
      <div className="editorSpacing">
        <Textfield
          label={localization.description}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            type === "create"
              ? setNewCodeList((prevCodeList) => ({
                  ...prevCodeList,
                  description: event.target.value,
                }))
              : handleCodeListUpdate(
                  codeList?.id,
                  undefined,
                  event.target.value,
                );
          }}
          value={
            (updatedCodeLists?.find((c) => c.id === codeList?.id) || codeList)
              ?.description || newCodeList?.description
          }
        />
      </div>

      <CodesEditor codeList={codeList} dirty={dirty} />
      <div className="editorButtons">
        <Button
          onClick={() =>
            type === "create"
              ? handleCreateCodeList()
              : handleUpdateDbCodeList(codeList?.id ?? "")
          }
        >
          {localization.saveEdits}
        </Button>
        {type === "create" ? (
          <Button variant="secondary" onClick={handleCancel}>
            {localization.button.cancel}
          </Button>
        ) : (
          <Button
            color="danger"
            onClick={() => {
              handleDeleteCodeList(codeList?.id ?? "");
            }}
          >
            {localization.button.delete}
          </Button>
        )}
      </div>
    </div>
  );
};
