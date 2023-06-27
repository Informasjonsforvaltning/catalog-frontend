import { useState } from 'react';
import { NodeApi, NodeRendererProps, Tree, TreeApi } from 'react-arborist';
import { TabsAddIcon, TabsRemoveIcon } from '@navikt/aksel-icons';
import cn from 'classnames';
import styles from './code-list-editor.module.css';
import { Button, Card, InfoCard, Select } from '@catalog-frontend/ui';
import { TextField } from '@digdir/design-system-react';
import { Code } from '@catalog-frontend/types';

type Data = {
  id: string;
  name: string;
  children?: Data[];
};

const INDENT_STEP = 15;

export interface Props {
  codeList: string;
}

export const CodeListEditor = ({ codeList }: Props) => {
  const [tree, setTree] = useState<TreeApi<Data> | null | undefined>(null);
  const [selectedCode, setSelectedCode] = useState<Code>(null);
  const codes: Code[] = [
    {
      id: 1,
      name: { nb: 'Kode 1', nn: 'Kode 1', en: 'Code 1' },
      parentId: -1,
    },
    {
      id: 2,
      name: { nb: 'Kode 2', nn: 'Kode 2', en: 'Code 2' },
      parentId: -1,
    },
    {
      id: 3,
      name: { nb: 'Kode 3', nn: 'Kode 3', en: 'Code 3' },
      parentId: -1,
    },
    {
      id: 31,
      name: { nb: 'Kode 3.1', nn: 'Kode 3.1', en: 'Code 3.1' },
      parentId: 3,
    },
    {
      id: 32,
      name: { nb: 'Kode 3.2', nn: 'Kode 3.2', en: 'Code 3.2' },
      parentId: 3,
    },
    {
      id: 331,
      name: { nb: 'Kode 3.3.1', nn: 'Kode 3.3.1', en: 'Code 3.3.1' },
      parentId: 32,
    },
  ];

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

  const treeData = codes.reduce((accumulator, currentValue) => {
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
    setSelectedCode(codes.find((code) => code.id === Number.parseInt(node.data.id)));
  };

  const handleOnMove = ({ dragIds, dragNodes, parentId, parentNode, index }) => {
    console.log('move');
    console.log(dragIds, dragNodes, parentId, parentNode, index);
  };

  return (
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
            onMove={handleOnMove}
            disableEdit
          >
            {Node}
          </Tree>
        </InfoCard.Item>
      </InfoCard>
      <InfoCard className={styles.codeTree}>
        <InfoCard.Item>
          <TextField
            label='Navn (norsk bokmål)'
            value={selectedCode?.name?.nb}
          />
          <TextField
            label='Navn (nynorsk)'
            value={selectedCode?.name?.nn}
          />
          <TextField
            label='Navn (engelsk)'
            value={selectedCode?.name?.en}
          />
          {/* <Select
            label='Overordnet kode'
            options={[]}
          /> */}
          <div className={styles.buttonRow}>
            <Button>Lagre</Button>
            <Button color='danger'>Slett</Button>
          </div>
        </InfoCard.Item>
      </InfoCard>
    </div>
  );
};

export default CodeListEditor;
