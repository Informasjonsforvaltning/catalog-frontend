import React, { useEffect, useState } from 'react';
import styles from './code-list-editor.module.css';
import { Button } from '@catalog-frontend/ui';
import { TextField } from '@digdir/design-system-react';
import { CodeList, EditorType } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import { useAdminDispatch, useAdminState } from '../../context/admin';
import { useCreateCodeList, useDeleteCodeList, useGetAllCodeLists, useUpdateCodeList } from '../../hooks/code-lists';
import { compare } from 'fast-json-patch';
import { useRouter } from 'next/router';
import CodesEditor from '../codes-editor';

export interface Props {
  codeList?: CodeList;
  codeListsInUse?: string[];
  type?: EditorType;
}

export const CodeListEditor = ({ codeList, codeListsInUse, type }: Props) => {
  const adminDispatch = useAdminDispatch();
  const { updatedCodeLists, updatedCodes } = useAdminState();

  const router = useRouter();

  const catalogId: string = `${router.query.catalogId}` ?? '';
  const createCodeList = useCreateCodeList(catalogId);
  const deleteCodeList = useDeleteCodeList(catalogId);
  const updateCodeList = useUpdateCodeList(catalogId);

  const { data: getAllCodeLists } = useGetAllCodeLists({
    catalogId: catalogId,
  });
  const dbCodeLists = getAllCodeLists?.codeLists || [];

  const newCodeListTemplate = {
    name: '',
    description: '',
    codes: [],
  };

  const [newCodeList, setNewCodeList] = useState<CodeList>(newCodeListTemplate);

  useEffect(() => {
    if (updatedCodes) {
      setNewCodeList((prevCodeList) => ({
        ...prevCodeList,
        codes: updatedCodes['0'],
      }));
    }
  }, [updatedCodes]);

  const handleDeleteCodeList = (codeListId: string) => {
    if (!codeListsInUse.includes(codeListId)) {
      if (window.confirm(localization.codeList.confirmDelete)) {
        deleteCodeList.mutate(codeListId);
      }
    } else {
      window.alert(localization.alert.codeListInUse);
    }
  };

  const handleCodeListUpdate = (codeListId: string, newName?: string, newDescription?: string) => {
    const indexInUpdatedCodeLists = updatedCodeLists.findIndex((codeList) => codeList.id === codeListId);

    if (indexInUpdatedCodeLists !== -1) {
      const codeListToUpdate = updatedCodeLists[indexInUpdatedCodeLists];

      if (codeListToUpdate) {
        const updatedCodeList = {
          ...codeListToUpdate,
          name: newName !== undefined ? newName : codeListToUpdate.name,
          description: newDescription !== undefined ? newDescription : codeListToUpdate.description,
        };

        const updatedCodeListsCopy = [...updatedCodeLists];
        updatedCodeListsCopy[indexInUpdatedCodeLists] = updatedCodeList;

        adminDispatch({ type: 'SET_CODE_LISTS', payload: { updatedCodeLists: updatedCodeListsCopy } });
      }
    } else {
      const codeListToUpdate = dbCodeLists.find((codeList) => codeList.id === codeListId);

      if (codeListToUpdate) {
        const updatedCodeList = {
          ...codeListToUpdate,
          name: newName !== undefined ? newName : codeListToUpdate.name,
          description: newDescription !== undefined ? newDescription : codeListToUpdate.description,
        };

        const updatedCodeListsCopy = [...updatedCodeLists, updatedCodeList];
        adminDispatch({ type: 'SET_CODE_LISTS', payload: { updatedCodeLists: updatedCodeListsCopy } });
      }
    }
  };

  const handleCancel = () => {
    adminDispatch({ type: 'SET_SHOW_CODE_LIST_EDITOR', payload: { showCodeListEditor: false } });
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
    const dbCodeList = dbCodeLists.find((codeList: CodeList) => codeList.id === codeListId);
    const updatedCodeList = updatedCodeLists.find((codeList) => codeList.id === codeListId) || dbCodeList;
    const newCodes = updatedCodes[codeListId];

    const updatedCodeListCopy = {
      ...updatedCodeList,
      codes: newCodes,
    };

    if (updatedCodeListCopy && dbCodeList) {
      const diff = compare(dbCodeList, updatedCodeListCopy);

      if (diff) {
        updateCodeList
          .mutateAsync({ oldCodeList: dbCodeList, newCodeList: updatedCodeListCopy })
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
    <>
      <div className={styles.codeListInfo}>
        <div className={styles.textField}>
          <TextField
            label={localization.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              type === 'create'
                ? setNewCodeList((prevCodeList) => ({
                    ...prevCodeList,
                    name: event.target.value,
                  }))
                : handleCodeListUpdate(codeList.id, event.target.value, undefined);
            }}
            value={(updatedCodeLists.find((c) => c.id === codeList.id) || codeList)?.name || newCodeList?.name}
          />
        </div>
        <div className={styles.textField}>
          <TextField
            label={localization.description}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              type === 'create'
                ? setNewCodeList((prevCodeList) => ({ ...prevCodeList, description: event.target.value }))
                : handleCodeListUpdate(codeList.id, undefined, event.target.value);
            }}
            value={
              (updatedCodeLists.find((c) => c.id === codeList.id) || codeList)?.description || newCodeList?.description
            }
          />
        </div>
      </div>

      <CodesEditor codeList={codeList} />
      <div className={styles.formButtons}>
        <Button onClick={() => (type === 'create' ? handleCreateCodeList() : handleUpdateDbCodeList(codeList.id))}>
          {localization.saveEdits}
        </Button>
        {type === 'create' ? (
          <Button
            color='danger'
            onClick={handleCancel}
          >
            {localization.button.cancel}
          </Button>
        ) : (
          <Button
            color='danger'
            onClick={() => {
              handleDeleteCodeList(codeList.id);
            }}
          >
            {localization.button.delete}
          </Button>
        )}
      </div>
    </>
  );
};

export default CodeListEditor;
