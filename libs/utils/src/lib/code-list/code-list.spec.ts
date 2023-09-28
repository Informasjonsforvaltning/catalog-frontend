import { Children } from 'react';
import { convertCodeListToTreeNodes } from '.';

describe('convertCodeListToTreeNodes', () => {
  test('convert codelist to treenode array', () => {
    const codes = [
      { id: 0, name: { nb: '0' }, parentID: 6 },
      { id: 1, name: { nb: '1' }, parentID: null },
      { id: 2, name: { nb: '2' }, parentID: null },
      { id: 3, name: { nb: '3' }, parentID: 0 },
      { id: 4, name: { nb: '4' }, parentID: 6 },
      { id: 5, name: { nb: '5' }, parentID: 3 },
      { id: 6, name: { nb: '6' }, parentID: null },
    ];

    const treeNodes = convertCodeListToTreeNodes(codes);
    expect(treeNodes).toStrictEqual([
      {
        value: '1',
        label: '1',
      },
      {
        value: '2',
        label: '2',
      },
      {
        value: '6',
        label: '6',
        children: [
          {
            value: '0',
            label: '0',
            children: [
              {
                value: '3',
                label: '3',
                children: [
                  {
                    value: '5',
                    label: '5',
                  },
                ],
              },
            ],
          },
          {
            value: '4',
            label: '4',
          },
        ],
      },
    ]);
  });
});
