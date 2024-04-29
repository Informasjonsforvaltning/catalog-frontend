'use client';

import React, { useEffect, useState } from 'react';
import { NodeApi, NodeRendererProps, Tree } from 'react-arborist';
import { TabsAddIcon, TabsRemoveIcon, TrashIcon, XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import styles from './codes-editor.module.css';
import { Button, InfoCard, Select } from '@catalog-frontend/ui';
import { Textfield, Button as FdsButton } from '@digdir/designsystemet-react';
import { Code, CodeList, EditorType, TreeNode } from '@catalog-frontend/types';
import {
  convertCodeListToTreeNodes,
  getAllChildrenCodes,
  getTranslateText,
  localization,
} from '@catalog-frontend/utils';
import { useAdminDispatch, useAdminState } from '../../context/admin';
import { compare } from 'fast-json-patch';
import { v4 as uuid } from 'uuid';

const INDENT_STEP = 15;
const NO_PARENT = 'noParent';

export interface Props {
  codeList?: CodeList;
  dirty?: (dirty: boolean) => void;
  type?: EditorType;
}

export const CodesEditor = ({ codeList: dbCodeList, dirty }: Props) => {
  const adminDispatch = useAdminDispatch();
  const { updatedCodeLists, updatedCodes } = useAdminState();

  const codeListInContext = updatedCodeLists?.find((codeList) => codeList.id === dbCodeList?.id);
  const currentCodeList = codeListInContext ?? dbCodeList;
  const codes = updatedCodes ? updatedCodes[dbCodeList?.id ?? ''] || updatedCodes['0'] : [];

  const [selectedCode, setSelectedCode] = useState<Code>();
  const [isEditViewOpen, setIsEditViewOpen] = useState<boolean>(false);

  const setDirtyState = () => {
    if (dirty) {
      const isDirty =
        compare(dbCodeList?.codes ?? [], updatedCodes?.[dbCodeList?.id ?? ''] ?? []).length > 0 ||
        (selectedCode ? !dbCodeList?.codes?.includes(selectedCode) : false);
      dirty(isDirty);
    }
  };

  const updateCodeName = (field: 'nb' | 'nn' | 'en', value: string) => {
    setSelectedCode(
      (prevSelectedCode) =>
        prevSelectedCode && {
          ...prevSelectedCode,
          name: {
            ...prevSelectedCode?.name,
            [field]: value,
          },
        },
    );
  };

  const updateCodeParent = (value: string) => {
    setSelectedCode(
      (prevSelectedCode) =>
        prevSelectedCode && {
          ...prevSelectedCode,
          parentID: value,
        },
    );
  };

  const createNewCode = () => {
    setSelectedCode({
      id: uuid(),
      name: { nb: 'Ny kode', nn: '', en: '' },
      parentID: null,
    });
  };

  const updateAndAddCode = (code: Code, codeList?: CodeList) => {
    const codeListId = codeList?.id ?? '0';
    const existingCodes = updatedCodes?.[codeListId] ? [...updatedCodes[codeListId]] : [];
    const index = existingCodes.findIndex((c) => c.id === code.id);

    if (index !== -1) {
      existingCodes[index] = code;
    } else {
      existingCodes.push(code);
    }

    const codesCopy = { ...updatedCodes };
    codesCopy[codeListId] = existingCodes;

    adminDispatch({
      type: 'SET_UPDATED_CODES',
      payload: { updatedCodes: codesCopy },
    });
  };

  const removeCode = (codeId: string, codeList?: CodeList) => {
    const codeListId = codeList?.id || '0';
    const allChildrenCodes = getAllChildrenCodes(codeId, codeList);
    const updatedCodesCopy = { ...updatedCodes };

    updatedCodesCopy[codeListId] = codes.filter((code) => !(code.id === codeId || allChildrenCodes.includes(code)));

    setSelectedCode(undefined);
    adminDispatch({
      type: 'SET_UPDATED_CODES',
      payload: { updatedCodes: updatedCodesCopy },
    });
  };

  // Functions related to tree view

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
    if (node.isLeaf) return <span className={styles.noFolderIcon}></span>;

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
    if (node.isLeaf) return <span className={styles.noFolderIcon}></span>;
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
    setSelectedCode(codes?.find((code) => code.id === node.data.value));
    setIsEditViewOpen(true);
  };

  const getCurrentLevel = (codes: Code[], currentCode: Code) => {
    let level = 0;
    let parent: Code | undefined = currentCode;

    while (parent && parent.parentID !== null) {
      parent = codes.find((code) => code.id === parent?.parentID);
      level++;
    }

    return level;
  };

  function findRelatedCodes(codes: Code[], codeId: string, depth = 0, maxDepth = 4) {
    if (depth > maxDepth) {
      return [];
    }
    const relatedCodes = codes?.filter((code) => code.parentID === codeId);
    const descendants = relatedCodes?.flatMap((relatedCode) =>
      findRelatedCodes(codes, relatedCode.id, depth + 1, maxDepth),
    );

    return [...relatedCodes, ...descendants];
  }

  function availableParentCodes(codes: Code[], codeId: string | undefined) {
    const relatedCodes = findRelatedCodes(codes, codeId ?? '') || [];
    const filterOptions = codes
      .filter((code: Code) => {
        return (
          code.id !== codeId && // Not itself
          !relatedCodes.includes(code) && // Not children of the code
          getCurrentLevel(codes, code) < 3 // Not codes with level higher than 4
        );
      })
      .map((code: Code) => ({
        label: String(getTranslateText(code.name)),
        value: code.id,
      }))
      .concat({ label: localization.catalogAdmin.noParentCode, value: NO_PARENT });

    return filterOptions.map((option) => (
      <option
        key={`parentOption-${option.value}`}
        value={option.value}
      >
        {option.label}
      </option>
    ));
  }

  useEffect(() => {
    setDirtyState();
  }, [selectedCode]);

  return (
    <>
      <div className={styles.editorContainer}>
        <InfoCard>
          <InfoCard.Item>
            <div className={styles.codeTree}>
              <Tree<TreeNode>
                data={convertCodeListToTreeNodes(codes)}
                idAccessor={(node) => node.value}
                selectionFollowsFocus={false}
                padding={15}
                rowHeight={30}
                height={462}
                width={453}
                onActivate={handleOnClick}
                disableEdit
                indent={45}
              >
                {Node}
              </Tree>
              <FdsButton
                onClick={() => {
                  createNewCode();
                  setIsEditViewOpen(true);
                }}
                variant='secondary'
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
                <Textfield
                  label={localization.catalogAdmin.codeName.nb}
                  value={selectedCode?.name?.nb}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateCodeName('nb', event.target.value);
                  }}
                />
              </div>
              <div className={styles.codeListEditor}>
                <Textfield
                  label={localization.catalogAdmin.codeName.nn}
                  value={selectedCode?.name?.nn}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateCodeName('nn', event.target.value);
                  }}
                />
              </div>
              <div className={styles.codeListEditor}>
                <Textfield
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
                  value={selectedCode?.parentID ? selectedCode.parentID : NO_PARENT}
                  onChange={(event) => {
                    updateCodeParent(event.target.value);
                  }}
                >
                  {availableParentCodes(codes ?? [], selectedCode?.id)}
                </Select>
              </div>

              <div className={styles.buttonRow}>
                <Button
                  onClick={() => {
                    selectedCode && updateAndAddCode(selectedCode, currentCodeList);
                    setIsEditViewOpen(false);
                  }}
                >
                  {localization.ok}
                </Button>
                <Button
                  color='danger'
                  variant='secondary'
                  onClick={() => {
                    selectedCode && removeCode(selectedCode.id, currentCodeList);
                    setIsEditViewOpen(false);
                  }}
                >
                  <TrashIcon fontSize='1.5rem' />
                  {localization.button.removeFromCodeList}
                </Button>
              </div>
            </InfoCard.Item>
          </InfoCard>
        )}
      </div>
    </>
  );
};

export default CodesEditor;
