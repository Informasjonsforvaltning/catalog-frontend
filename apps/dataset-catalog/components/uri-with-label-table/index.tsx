import { UriWithLabel } from '@catalog-frontend/types';
import { localization, getTranslateText } from '@catalog-frontend/utils';
import { Table } from '@digdir/designsystemet-react';

type Props = {
  values?: UriWithLabel[];
};

export const UriWithLabelTable = ({ values = [] }: Props) => {
  if (values.length === 0) return null;

  return (
    <Table size='sm'>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>{localization.title}</Table.HeaderCell>
          <Table.HeaderCell>{localization.link}</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {values.map((item) => (
          <Table.Row key={item.uri}>
            <Table.Cell>{getTranslateText(item.prefLabel)}</Table.Cell>
            <Table.Cell>{item.uri}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
