import { UriWithLabel } from '@catalog-frontend/types';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import { Table } from '@digdir/designsystemet-react';

type Props = {
  values?: UriWithLabel[];
  language?: string;
};

export const UriWithLabelTable = ({ values = [], language }: Props) => {
  if (values.length === 0) return null;

  return (
    <Table
      size='sm'
      style={{ tableLayout: 'fixed' }}
    >
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>{localization.title}</Table.HeaderCell>
          <Table.HeaderCell>{localization.link}</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {values.map((item) => (
          <Table.Row key={`uri-with-label-table-${item.uri}`}>
            <Table.Cell>{getTranslateText(item.prefLabel, language)}</Table.Cell>
            <Table.Cell>{item.uri}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
