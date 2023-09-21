import React, { useState } from 'react';
import { NodeApi, NodeRendererProps, Tree } from 'react-arborist';
import { TabsAddIcon, TabsRemoveIcon, XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import styles from './code-list-editor.module.css';
import { Button, InfoCard, Select } from '@catalog-frontend/ui';
import { TextField, Button as FdsButton, SingleSelectOption } from '@digdir/design-system-react';
import { Code, CodeList, TreeNode } from '@catalog-frontend/types';
import {
  convertCodeListToTreeNodes,
  getAllChildrenCodes,
  getTranslateText,
  localization,
} from '@catalog-frontend/utils';
import { useAdminDispatch, useAdminState } from '../../context/admin';

const INDENT_STEP = 15;

export interface Props {
  codeList: CodeList;
}

export const CodeListEditor = ({ codeList: dbCodeList }: Props) => {
  const adminDispatch = useAdminDispatch();
  const { updatedCodeLists } = useAdminState();
  const codeListInContext = updatedCodeLists.find((codeList) => codeList.id === dbCodeList.id);
  const currentCodeList = codeListInContext ?? dbCodeList;
  const currentCodes = currentCodeList?.codes ?? [];

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
      id: getNextId(currentCodes),
      name: { nb: 'Ny kode', nn: '', en: '' },
      parentID: null,
    };

    setSelectedCode(newCode);
  };

  const updateCodeListInContext = (codeList: CodeList) => {
    const codeListIndex = updatedCodeLists.findIndex((item: CodeList) => item.id === codeList.id);
    let codeLists = [...updatedCodeLists];
    if (codeListIndex !== -1) {
      // Code list already exists in context
      codeLists[codeListIndex] = codeList;
    } else {
      // Code list does not exist in context
      codeLists = [...updatedCodeLists, codeList];
    }
    adminDispatch({ type: 'SET_CODE_LISTS', payload: { updatedCodeLists: codeLists } });
  };

  const updateCodes = (codeId: number): Code[] => {
    const codeIndex = currentCodes.findIndex((code: Code) => code.id === codeId);

    if (codeIndex !== -1) {
      const codes = [...currentCodes];
      codes[codeIndex] = selectedCode;
      return codes;
    }
    return [...currentCodes, selectedCode]; // Add the selected code if it does not already exist
  };

  const handleCodeUpdate = (codeId: number) => {
    updateCodeListInContext({
      ...currentCodeList,
      codes: updateCodes(codeId),
    });
  };

  const handleCodeRemove = (codeId: number) => {
    const allChildrenCodes = getAllChildrenCodes(codeId, currentCodeList);
    updateCodeListInContext({
      ...currentCodeList,
      codes: currentCodes.filter((code) => !(code.id === codeId || allChildrenCodes.includes(code))),
    });
  };

  const Node = ({ node, style, dragHandle }: NodeRendererProps<TreeNode>) => {
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
        <span className={styles.text}>{node.isEditing ? <Input node={node} /> : node.data.label}</span>
      </div>
    );
  };

  function Input({ node }: { node: NodeApi<TreeNode> }) {
    return (
      <input
        autoFocus
        type='text'
        defaultValue={node.data.label}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={() => node.reset()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') node.reset();
          if (e.key === 'Enter') node.submit(e.currentTarget.value);
        }}
      />
    );
  }

  function FolderIcon({ node }: { node: NodeApi<TreeNode> }) {
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

  const handleOnClick = (node: NodeApi<TreeNode>) => {
    setSelectedCode(currentCodes?.find((code) => code.id === Number.parseInt(node.data.value)));
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

  function availableParentCodes(codes: Code[], codeId: number): SingleSelectOption[] {
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
              <Tree<TreeNode>
                data={convertCodeListToTreeNodes(currentCodeList)}
                idAccessor={(node) => node.value}
                selectionFollowsFocus={false}
                padding={15}
                rowHeight={30}
                height={441}
                width={453}
                onActivate={handleOnClick}
                onClick={() => {
                  setIsEditViewOpen(true);
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
                  options={availableParentCodes(currentCodes, selectedCode?.id)}
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
                    handleCodeRemove(selectedCode.id);
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
