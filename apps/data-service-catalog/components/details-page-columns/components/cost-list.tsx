import { DataServiceCost } from "@catalog-frontend/types";
import { Card, Link, List, Paragraph } from "@digdir/designsystemet-react";
import React from "react";
import { getTranslateText } from "@catalog-frontend/utils";

type Props = {
  costs: DataServiceCost[] | undefined;
  language: string;
};

export const CostList = ({ costs, language }: Props) => {
  return (
    <>
      {costs?.map((cost, i) => (
        <Card key={`costs-card-${i}`} color="neutral">
          <Card.Block>
            <List.Unordered
              style={{
                listStyle: "none",
                paddingLeft: 0,
              }}
            >
              {cost?.value && (
                <List.Item>
                  {cost.value} {cost.currency?.split("/")?.reverse()[0] ?? ""}
                </List.Item>
              )}

              {cost?.documentation?.map((doc, docIndex) => (
                <List.Item key={`costs-${i}-doc-${docIndex}`}>
                  <Link href={doc} target="_blank">
                    {doc}
                  </Link>
                </List.Item>
              ))}
            </List.Unordered>
            <Paragraph>
              {getTranslateText(cost?.description, language)}
            </Paragraph>
          </Card.Block>
        </Card>
      ))}
    </>
  );
};
