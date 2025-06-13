import { DateRange } from '@catalog-frontend/types';
import { formatDate, localization } from '@catalog-frontend/utils';
import { Table } from '@digdir/designsystemet-react';
import styles from '../details-columns.module.css';

type Props = {
  temporal: DateRange[] | undefined;
};

export const TemporalDetails = ({ temporal }: Props) => {
  return (
    <>
      {temporal && (
        <Table
          size='sm'
          className={styles.table}
        >
          <Table.Head>
            <Table.Row>
              <Table.HeaderCell>{localization.from}</Table.HeaderCell>
              <Table.HeaderCell>{localization.to}</Table.HeaderCell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {temporal.map((item, index) => {
              const startDate = item?.startDate ? new Date(item.startDate) : null;
              const endDate = item?.endDate ? new Date(item.endDate) : null;

              return (
                <Table.Row key={`tableRow-temporal-${index}`}>
                  <Table.Cell>{startDate ? formatDate(startDate) : '-'}</Table.Cell>
                  <Table.Cell>{endDate ? formatDate(endDate) : '-'}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      )}
    </>
  );
};
