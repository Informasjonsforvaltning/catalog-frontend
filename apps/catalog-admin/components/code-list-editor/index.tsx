import React, { useState } from 'react';
import { NodeApi, NodeRendererProps, Tree } from 'react-arborist';
import { TabsAddIcon, TabsRemoveIcon, XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import styles from './code-list-editor.module.css';
import { Button, InfoCard, Select } from '@catalog-frontend/ui';
import { TextField, Button as FdsButton, SingleSelectOption } from '@digdir/design-system-react';
import { Code, CodeList } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useAdminDispatch, useAdminState } from '../../context/admin';

const INDENT_STEP = 15;

type Data = {
  id: string;
  name: string;
  children?: Data[];
};

export interface Props {
  dbCodeList: CodeList;
}

export const CodeListEditor = ({ dbCodeList }: Props) => {
  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { updatedCodeLists } = adminContext;
  const codeListInContext = updatedCodeLists.find((codeList) => codeList.id === dbCodeList.id);
  const codesInContext = codeListInContext?.codes || dbCodeList.codes || [];

  const [selectedCode, setSelectedCode] = useState<Code>(undefined);
  const [isEditViewOpen, setIsEditViewOpen] = useState<boolean>(false);

  // Functions for updating the code list

  function getNextId(codes: Code[]): number {
    let maxId = 0;
    for (const code of codes) {
      if (code.id > maxId && code.id !== undefined) {
        maxId = code.id;
      }
    }

    while (codes.some((code: Code) => code.id === maxId)) {
      maxId++;
    }

    return maxId;
  }

  const createNewCode = () => {
    const newCode = {
      id: getNextId(codesInContext),
      name: { nb: 'Ny kode', nn: '', en: '' },
      parentID: null,
    };

    setSelectedCode(newCode);
  };

  const removeCodeFromCodeList = (codeId: number) => {
    const filteredCodes = codesInContext.filter((code) => code.id !== codeId);
    const updatedCodeList: CodeList = { ...dbCodeList, codes: filteredCodes };

    let codeListsToBeSaved = [];
    if (updatedCodeLists.length > 0) {
      const updatedCodeListsCopy = [...updatedCodeLists];
      const index = updatedCodeListsCopy.findIndex((codeList) => codeList.id === updatedCodeList.id);
      if (index !== -1) {
        updatedCodeListsCopy[index] = updatedCodeList;
      }
      codeListsToBeSaved = updatedCodeListsCopy;
    } else {
      codeListsToBeSaved.push(updatedCodeList);
    }

    adminDispatch({ type: 'SET_CODE_LISTS', payload: { updatedCodeLists: codeListsToBeSaved } });
  };

  const updateListOfCodes = (codeId: number): Code[] => {
    const codes: Code[] = codeListInContext?.codes || dbCodeList.codes || [];
    const updatedCodes: Code[] = [...codes];
    const codeContextIndex: number = codes.findIndex((code: Code) => code.id === codeId);

    if (codeContextIndex !== -1) {
      // Code exists
      const codeToBeUpdated: Code = codes[codeContextIndex];
      const updatedCode: Code = {
        ...codeToBeUpdated,
        name: selectedCode.name ?? codeToBeUpdated.name,
        parentID: selectedCode.parentID ?? codeToBeUpdated.parentID,
      };

      updatedCodes[codeContextIndex] = updatedCode;
      return updatedCodes;
    }
    return [...updatedCodes, selectedCode]; // Add the selected code if it does not already exist
  };

  const handleCodeUpdate = (codeId: number) => {
    const contextCodeListIndex: number = updatedCodeLists.findIndex((item: CodeList) => item.id === dbCodeList.id);

    if (contextCodeListIndex !== -1) {
      // Code list already exists in context

      const codeListToUpdateInContext: CodeList = updatedCodeLists[contextCodeListIndex];
      const updatedListOfCodes: Code[] = updateListOfCodes(codeId);
      const updatedCodeList: CodeList = {
        ...codeListToUpdateInContext,
        codes: selectedCode !== undefined ? updatedListOfCodes : codeListToUpdateInContext.codes,
      };

      const updatedCodeListsCopy: CodeList[] = [...updatedCodeLists];
      updatedCodeListsCopy[contextCodeListIndex] = updatedCodeList;

      adminDispatch({ type: 'SET_CODE_LISTS', payload: { updatedCodeLists: updatedCodeListsCopy } });
    } else {
      // Code list does not exist in context

      const updatedCodeList: CodeList = {
        ...dbCodeList,
        codes: selectedCode !== undefined ? updateListOfCodes(codeId) : dbCodeList.codes,
      };

      const updatedCodeListsCopy: CodeList[] = [...updatedCodeLists, updatedCodeList];
      adminDispatch({ type: 'SET_CODE_LISTS', payload: { updatedCodeLists: updatedCodeListsCopy } });
    }
  };

  // Functions related to the tree component

  const findParent = (id: number, data: Data[]) => {
    const parent = data.find((item) => item.id === `${id}`);
    if (parent) {
      return parent;
    }

    for (const item of data) {
      if (item.children) {
        const result = findParent(id, item.children);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };

  const treeData = codesInContext.reduce((accumulator, currentValue) => {
    const parent = findParent(currentValue.parentID, accumulator);
    if (parent) {
      parent.children = [...(parent.children ?? []), { id: `${currentValue.id}`, name: currentValue.name.nb }];
    } else {
      accumulator.push({ id: `${currentValue.id}`, name: currentValue.name.nb });
    }
    return accumulator;
  }, []);

  const Node = ({ node, style, dragHandle }: NodeRendererProps<Data>) => {
    const indentSize = Number.parseFloat(`${style.paddingLeft || 0}`);
    return (
      <div
        ref={dragHandle}
        style={style}
        className={cn(styles.node, node.state)}
      >
        <div className={styles.indentLines}>
          {new Array(Math.floor(indentSize / INDENT_STEP)).fill(0).map((_, index) => {
            return <div key={index}></div>;
          })}
        </div>

        <FolderIcon node={node} />
        <span className={styles.text}>{node.isEditing ? <Input node={node} /> : node.data.name}</span>
      </div>
    );
  };

  function Input({ node }: { node: NodeApi<Data> }) {
    return (
      <input
        autoFocus
        type='text'
        defaultValue={node.data.name}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={() => node.reset()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') node.reset();
          if (e.key === 'Enter') node.submit(e.currentTarget.value);
        }}
      />
    );
  }

  function FolderIcon({ node }: { node: NodeApi<Data> }) {
    if (node.isLeaf) return <span></span>;
    return (
      <span>
        <button
          className={styles.toggleButton}
          onClick={() => node.isInternal && node.toggle()}
        >
          {node.isOpen ? <TabsRemoveIcon /> : <TabsAddIcon />}
        </button>
        &nbsp;
      </span>
    );
  }

  const handleOnClick = (node: NodeApi<Data>) => {
    setSelectedCode(codesInContext?.find((code) => code.id === Number.parseInt(node.data.id)));
  };

  const getCurrentLevel = (codes: Code[], currentCode: Code) => {
    let level = 0;
    let parent = currentCode;

    while (parent && parent.parentID !== null) {
      parent = codes.find((code) => code.id === parent.parentID);
      level++;
    }

    return level;
  };

  function findRelatedCodes(codes: Code[], codeId: number, depth = 0, maxDepth = 4) {
    if (depth > maxDepth) {
      return [];
    }
    const relatedCodes = codes.filter((code) => code.parentID === codeId);
    const descendants = relatedCodes.flatMap((relatedCode) =>
      findRelatedCodes(codes, relatedCode.id, depth + 1, maxDepth),
    );

    return [...relatedCodes, ...descendants];
  }

  function possibleParentCodes(codes: Code[], codeId: number): SingleSelectOption[] {
    const relatedCodes = findRelatedCodes(codes, codeId);
    return codes
      .filter((code: Code) => {
        return (
          code.id !== codeId && // Not itself
          !relatedCodes.includes(code) && // Not children of the code
          getCurrentLevel(codes, code) < 3 // Not codes with level higher than 4
        );
      })
      .map((code: Code) => ({
        label: String(getTranslateText(code.name)),
        value: code.id.toString(),
      }));
  }

  const updateCodeName = (field: 'nb' | 'nn' | 'en', value: string) => {
    setSelectedCode((prevSelectedCode) => ({
      ...prevSelectedCode,
      name: {
        ...prevSelectedCode?.name,
        [field]: value,
      },
    }));
  };

  const updateCodeParent = (value: string) => {
    setSelectedCode((prevSelectedCode) => ({
      ...prevSelectedCode,
      parentID: +value,
    }));
  };

  return (
    <>
      <div className={styles.editorContainer}>
        <InfoCard className={styles.codeTree}>
          <InfoCard.Item>
            <div>
              <Tree<Data>
                data={treeData}
                selectionFollowsFocus={false}
                padding={15}
                rowHeight={30}
                height={441}
                width={453}
                onActivate={handleOnClick}
                onClick={() => {
                  setIsEditViewOpen(true);
                  if (selectedCode === undefined) {
                    createNewCode();
                  }
                }}
                disableEdit
              >
                {Node}
              </Tree>
              <FdsButton
                onClick={() => {
                  createNewCode();
                  setIsEditViewOpen(true);
                }}
                variant='outline'
              >
                {localization.catalogAdmin.createCode}
              </FdsButton>
            </div>
          </InfoCard.Item>
        </InfoCard>
        {isEditViewOpen && (
          <InfoCard>
            <div className={styles.header}>
              <p className={styles.headerText}>{localization.catalogAdmin.editCode}</p>
              <XMarkIcon
                fontSize='1.5rem'
                className={styles.xmark}
                title={localization.catalogAdmin.closeEdit}
                onClick={() => setIsEditViewOpen(false)}
              />
            </div>
            <div className={styles.codeId}>ID: {selectedCode?.id}</div>
            <InfoCard.Item className={styles.codeListEditor}>
              <div className={styles.codeListEditor}>
                <TextField
                  label={localization.catalogAdmin.codeName.nb}
                  value={selectedCode?.name?.nb}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateCodeName('nb', event.target.value);
                  }}
                />
              </div>
              <div className={styles.codeListEditor}>
                <TextField
                  label={localization.catalogAdmin.codeName.nn}
                  value={selectedCode?.name?.nn}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateCodeName('nn', event.target.value);
                  }}
                />
              </div>
              <div className={styles.codeListEditor}>
                <TextField
                  label={localization.catalogAdmin.codeName.en}
                  value={selectedCode?.name?.en}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateCodeName('en', event.target.value);
                  }}
                />
              </div>
              <div className={styles.codeListEditor}>
                <Select
                  label={localization.catalogAdmin.parentCode}
                  options={possibleParentCodes(codesInContext, selectedCode?.id)}
                  value={`${selectedCode?.parentID}`}
                  onChange={updateCodeParent}
                />
              </div>

              <div className={styles.buttonRow}>
                <Button
                  onClick={() => {
                    handleCodeUpdate(selectedCode.id);
                    setIsEditViewOpen(false);
                  }}
                >
                  {localization.ok}
                </Button>
                <Button
                  color='danger'
                  onClick={() => {
                    removeCodeFromCodeList(selectedCode.id);
                    setIsEditViewOpen(false);
                  }}
                >
                  Fjern fra kodeliste
                </Button>
              </div>
            </InfoCard.Item>
          </InfoCard>
        )}
      </div>
    </>
  );
};

export default CodeListEditor;
