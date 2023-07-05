import React, { useState } from 'react';
import { NodeApi, NodeRendererProps, Tree, TreeApi } from 'react-arborist';
import { TabsAddIcon, TabsRemoveIcon, XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import styles from './code-list-editor.module.css';
import { Button, InfoCard, Select } from '@catalog-frontend/ui';
import { TextField } from '@digdir/design-system-react';
import { Code, CodeList } from '@catalog-frontend/types';
import { getTranslateText } from '@catalog-frontend/utils';
import { useAdminDispatch, useAdminState } from '../../context/admin';

const INDENT_STEP = 15;

type Data = {
  id: string;
  name: string;
  children?: Data[];
};

export interface Props {
  codeList: CodeList;
}

export const CodeListEditor = ({ codeList }: Props) => {
  const [tree, setTree] = useState<TreeApi<Data> | null | undefined>(null);
  const [selectedCode, setSelectedCode] = useState<Code>(undefined);
  const [updatedCodeList, setUpdatedCodeList] = useState(codeList);
  const [isEditViewOpen, setIsEditViewOpen] = useState(false);
  const adminDispatch = useAdminDispatch();
  const adminContext = useAdminState();
  const { updatedCodeLists } = adminContext;
  const codeListInContext = updatedCodeLists.find((c) => c.id === codeList.id);

  // Functions for updating the code list

  function getNextId(codes: Code[]): number {
    let maxId = 0;
    for (const code of codes) {
      if (code.id > maxId) {
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
      id: getNextId(combineListsofCodes()),
      name: { nb: '', nn: '', en: '' },
      parentID: -1,
    };

    setSelectedCode(newCode);
  };

  const removeFromCodeList = (codeId: number) => {
    setUpdatedCodeList((prevCodeList) => {
      const filteredCodes = prevCodeList.codes.filter((code) => code.id !== codeId);
      const updatedCodeList = { ...prevCodeList, codes: filteredCodes };
      adminDispatch({ type: 'SET_CODE_LISTS', payload: { updatedCodeLists: [updatedCodeList] } });
      return updatedCodeList;
    });
  };

  const updateListOfCodes = (codes: Code[], codeId: number) => {
    const codeIndex = codes.findIndex((code) => code.id === codeId);
    const updatedCodes = [...codes];

    if (codeIndex !== -1) {
      const codeToBeUpdated = codes[codeIndex];
      const updatedCode = {
        ...codeToBeUpdated,
        name: selectedCode.name ?? codeToBeUpdated.name,
        parentID: selectedCode.parentID ?? codeToBeUpdated.parentID,
      };

      updatedCodes[codeIndex] = updatedCode;

      return updatedCodes;
    }
    return [...updatedCodes, selectedCode]; // Add the selected code if it does not already exist
  };

  const handleCodeUpdate = (codeList: CodeList, codeId: number) => {
    const codeListToUpdateIndex = updatedCodeLists.findIndex((item) => item.id === codeList.id);

    if (codeListToUpdateIndex !== -1) {
      // Already exists in context
      const codeListToUpdate = updatedCodeLists[codeListToUpdateIndex];
      const updatedListOfCodes = updateListOfCodes(codeListToUpdate.codes, codeId);
      const updatedCodeList = {
        ...codeListToUpdate,
        codes: selectedCode !== undefined ? updatedListOfCodes : codeListToUpdate.codes,
      };

      const updatedCodeListsCopy = [...updatedCodeLists];
      updatedCodeListsCopy[codeListToUpdateIndex] = updatedCodeList;

      adminDispatch({ type: 'SET_CODE_LISTS', payload: { updatedCodeLists: updatedCodeListsCopy } });
    } else {
      const updatedCodeList: CodeList = {
        ...codeList,
        codes: selectedCode !== undefined ? updateListOfCodes(codeList.codes, codeId) : codeList.codes,
      };

      const updatedCodeListsCopy = [...updatedCodeLists, updatedCodeList];
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

  const combineListsofCodes = (): Code[] => {
    const codesInContext: Code[] = codeListInContext?.codes || [];
    const codesInDb: Code[] = codeList.codes || [];

    const combinedCodes: Code[] = [...codesInContext];

    codesInDb.forEach((codeDb: Code) => {
      const isDuplicate: boolean = codesInContext.some((codeContext: Code) => codeContext.id === codeDb.id);
      if (!isDuplicate) {
        combinedCodes.push(codeDb);
      }
    });
    return combinedCodes;
  };

  const possibleParentCodes = (codes: Code[], currentCode: Code) => {
    return (
      codes
        ?.filter((code: Code) => code.id !== currentCode.id && code.parentID !== currentCode.id)
        .map((code) => ({
          label: getTranslateText(code.name),
          value: code.id,
        })) ?? []
    );
  };

  const updateCodeName = (field: 'nb' | 'nn' | 'en', value: string) => {
    setSelectedCode((prevSelectedCode) => ({
      ...prevSelectedCode,
      name: {
        ...prevSelectedCode.name,
        [field]: value,
      },
    }));
  };

  const updateCodeParent = (value: number) => {
    setSelectedCode((prevSelectedCode) => ({
      ...prevSelectedCode,
      parentID: value,
    }));
  };

  const treeData = combineListsofCodes().reduce((accumulator, currentValue) => {
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
    setSelectedCode(combineListsofCodes()?.find((code) => code.id === Number.parseInt(node.data.id)));
  };

  function handleOnMove(args: {
    dragIds: string[];
    dragNodes: NodeApi<Data>[];
    parentId: string;
    parentNode: NodeApi<Data>;
    index: number;
  }): void | Promise<void> {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      <div className={styles.editorContainer}>
        <InfoCard className={styles.codeTree}>
          <InfoCard.Item>
            <Tree<Data>
              data={treeData}
              ref={(t) => setTree(t)}
              selectionFollowsFocus={false}
              padding={15}
              rowHeight={30}
              height={treeData.length * 85}
              onActivate={handleOnClick}
              onClick={() => setIsEditViewOpen(true)}
              onMove={handleOnMove}
              //onCreate={handleOnCreate}
              disableEdit
            >
              {Node}
            </Tree>
          </InfoCard.Item>
          <InfoCard.Item>
            <Button
              onClick={() => {
                createNewCode();
                setIsEditViewOpen(true);
              }}
            >
              Opprett ny kode
            </Button>
          </InfoCard.Item>
        </InfoCard>
        {isEditViewOpen && (
          <InfoCard>
            <div className={styles.header}>
              <p className={styles.headerText}>Code Edit</p>
              <XMarkIcon
                fontSize='1.5rem'
                className={styles.xmark}
                title='close edit view'
                onClick={() => setIsEditViewOpen(false)}
              />
            </div>
            <InfoCard.Item className={styles.codeListEditor}>
              <div className={styles.codeListEditor}>
                <TextField
                  label='Navn (norsk bokmål)'
                  value={selectedCode?.name?.nb}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateCodeName('nb', event.target.value);
                  }}
                />
              </div>
              <div className={styles.codeListEditor}>
                <TextField
                  label='Navn (nynorsk)'
                  value={selectedCode?.name?.nn}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateCodeName('nn', event.target.value);
                  }}
                />
              </div>
              <div className={styles.codeListEditor}>
                <TextField
                  label='Navn (engelsk)'
                  value={selectedCode?.name?.en}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateCodeName('en', event.target.value);
                  }}
                />
              </div>
              <div className={styles.codeListEditor}>
                <Select
                  label='Overordnet kode'
                  options={possibleParentCodes(combineListsofCodes(), selectedCode)}
                  value={selectedCode?.parentID}
                  onChange={updateCodeParent}
                />
              </div>

              <div className={styles.buttonRow}>
                <Button
                  onClick={() => {
                    handleCodeUpdate(updatedCodeList, selectedCode.id);
                    setIsEditViewOpen(false);
                  }}
                >
                  Ok
                </Button>
                <Button
                  color='danger'
                  onClick={() => {
                    removeFromCodeList(selectedCode.id);
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
