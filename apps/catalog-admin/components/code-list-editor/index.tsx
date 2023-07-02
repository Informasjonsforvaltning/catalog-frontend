import React, { useRef, useState } from 'react';
import { NodeApi, NodeRendererProps, Tree, TreeApi } from 'react-arborist';
import { TabsAddIcon, TabsRemoveIcon, XMarkIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import styles from './code-list-editor.module.css';
import { Button, Card, InfoCard, Select } from '@catalog-frontend/ui';
import { SingleSelectOption, TextField } from '@digdir/design-system-react';
import { Code, CodeList } from '@catalog-frontend/types';
import { getTranslateText } from '@catalog-frontend/utils';

type Data = {
  id: string;
  name: string;
  children?: Data[];
};

const INDENT_STEP = 15;

export interface Props {
  codeList: CodeList;
}

export const CodeListEditor = ({ codeList }: Props) => {
  const [tree, setTree] = useState<TreeApi<Data> | null | undefined>(null);
  const [selectedCode, setSelectedCode] = useState<Code>({
    id: 0,
    name: { nb: '', nn: '', en: '' },
    parentId: -1,
  });
  const [updatedCodeList, setUpdatedCodeList] = useState(codeList);
  const [isEditViewOpen, setIsEditViewOpen] = useState(false);

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

  const findCodeName = (codeId: number, codes: Code[]) => {
    const codeMatch = codes && codes.find((item) => item.id === codeId);
    if (codeMatch) {
      return getTranslateText(codeMatch.name);
    }
  };

  const treeData = updatedCodeList.codes?.reduce((accumulator, currentValue) => {
    const parent = findParent(currentValue.parentId, accumulator);
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
    setSelectedCode(updatedCodeList.codes?.find((code) => code.id === Number.parseInt(node.data.id)));
  };

  const handleOnCreate = (parentId: string, parentNode: NodeApi<Data>, index, type) => {
    throw new Error('Function not implemented.');
  };

  const handleOnMove = ({ dragIds, dragNodes, parentId, parentNode, index }) => {
    console.log('move');
    console.log(dragIds, dragNodes, parentId, parentNode, index);
  };

  function codeExists(codes: Code[], codeToCheck: Code): boolean {
    return codes.includes(codeToCheck);
  }

  const possibleParentCodes = (codes: Code[], parentCode: Code) => {
    return (
      codes
        ?.map((item) => {
          if (item !== parentCode) {
            return {
              label: getTranslateText(item.name),
              value: item.id,
            };
          }
          return null;
        })
        .filter((item) => item !== null) ?? []
    );
  };

  function getNextId(codes: Code[]): number {
    let maxId = 0;
    for (const code of codes) {
      if (code.id > maxId) {
        maxId = code.id;
      }
    }
    return maxId + 1;
  }

  const createNewCode = () => {
    const newCode = {
      id: getNextId(updatedCodeList.codes),
      name: { nb: 'Test2', nn: '', en: '' },
      parentId: -1,
    };

    setSelectedCode(newCode);

    setUpdatedCodeList((prevCodeList) => {
      const newCodeList = [...prevCodeList.codes, newCode];
      return { ...prevCodeList, codes: newCodeList };
    });
  };

  const removeFromCodeList = (codeId: number) => {
    setUpdatedCodeList((prevCodeList) => {
      const filteredCodes = prevCodeList.codes.filter((code) => code.id !== codeId);
      return { ...prevCodeList, codes: filteredCodes };
    });
  };

  const handleUpdateCodeListCodes = (codes: Code[], updatedCode: Code) => {
    const newCodes = codes.map((item) => {
      if (item.id === updatedCode.id) {
        return updatedCode;
      }
      return item;
    });

    const newCodeList: CodeList = {
      name: updatedCodeList.name,
      description: updatedCodeList.description,
      codes: newCodes,
    };

    setUpdatedCodeList(newCodeList);
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
      parentId: value,
    }));
  };

  return (
    <div className={styles.editorContainer}>
      <Button
        onClick={() => {
          createNewCode();
          setIsEditViewOpen(true);
        }}
      >
        Opprett ny kode
      </Button>
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
                options={possibleParentCodes(updatedCodeList.codes, selectedCode)}
                value={selectedCode?.parentId}
                onChange={updateCodeParent}
              />
            </div>

            <div className={styles.buttonRow}>
              <Button onClick={() => handleUpdateCodeListCodes(updatedCodeList.codes, selectedCode)}>Ok</Button>
              <Button
                color='danger'
                onClick={() => removeFromCodeList(selectedCode.id)}
              >
                Fjern fra kodeliste
              </Button>
            </div>
          </InfoCard.Item>
        </InfoCard>
      )}
    </div>
  );
};

export default CodeListEditor;
