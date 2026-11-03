"use client";

import { Standard } from "@catalog-frontend/types";
import { localization, getTranslateText } from "@catalog-frontend/utils";
import { Link, Paragraph, Table } from "@digdir/designsystemet-react";

type Props = {
  values?: Standard[];
  language?: string;
};

export const StandardTable = ({ values = [], language }: Props) => {
  if (values.length === 0) return null;

  return (
    <Table data-size="sm" style={{ tableLayout: "fixed", width: "100%" }}>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>{localization.title}</Table.HeaderCell>
          <Table.HeaderCell>{localization.link}</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {values.map((item, index) => (
          <Table.Row key={`standard-table-${index}`}>
            <Table.Cell>
              {getTranslateText(item?.prefLabel, language)}
            </Table.Cell>
            <Table.Cell>
              {item?.seeAlso?.map((url, urlIndex) => (
                <Paragraph data-size="sm" key={`standard-link-${urlIndex}`}>
                  <Link href={url}>{url}</Link>
                </Paragraph>
              ))}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
