"use client";

import { Cost, ISOLanguage, ReferenceDataCode } from "@catalog-frontend/types";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { Card, Link, List, Paragraph, Tag } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { DeleteButton } from "../button";
import { TitleWithHelpTextAndTag } from "../title-with-help-text-and-tag";
import { CostsModal } from "./costs-modal";
import styles from "./costs.module.scss";

type CostsFormValues = {
  costs?: Cost[];
};

type Props = {
  currencies?: ReferenceDataCode[];
  helpText?: string;
};

const CURRENCY_PRIORITY = [
  "JPY",
  "ISK",
  "SEK",
  "DKK",
  "GBP",
  "USD",
  "EUR",
  "NOK",
];

const ALLOWED_LANGUAGES = Object.freeze<ISOLanguage[]>(["nb", "nn", "en"]);

const sortCurrencies = (currencies?: ReferenceDataCode[]) => {
  if (!currencies) return currencies;

  return [...currencies].sort((a, b) => {
    if (!a.code) return 1;
    if (!b.code) return -1;

    const indexA = CURRENCY_PRIORITY.indexOf(a.code);
    const indexB = CURRENCY_PRIORITY.indexOf(b.code);

    if (indexA !== -1 || indexB !== -1) {
      return indexB - indexA;
    }

    return a.code.localeCompare(b.code);
  });
};

export const CostsTable = ({ currencies, helpText }: Props) => {
  const { values, setFieldValue } = useFormikContext<CostsFormValues>();
  const sortedCurrencies = sortCurrencies(currencies);

  const handleDeleteCost = (index: number) => () => {
    const newCosts = values.costs?.filter((_, i) => i !== index);
    setFieldValue("costs", newCosts?.length ? newCosts : []);
  };

  return (
    <div className={styles.fieldContainer}>
      <TitleWithHelpTextAndTag
        helpText={helpText ?? localization.cost.helptext.costs}
      >
        {localization.cost.fieldLabel.costs}
      </TitleWithHelpTextAndTag>

      {values?.costs?.map((item, i) => (
        <Card key={`costs-card-${i}`} data-color="neutral">
          <Card.Block className={styles.costContent}>
            <List.Unordered className={styles.list}>
              {item?.value !== undefined && item?.value !== null && (
                <List.Item>
                  {item.value} {item.currency?.split("/")?.reverse()[0] ?? ""}
                </List.Item>
              )}

              {item?.documentation?.map((doc, docIndex) => (
                <List.Item key={`costs-${i}-doc-${docIndex}`}>
                  <Link href={doc} target="_blank">
                    {doc}
                  </Link>
                </List.Item>
              ))}
            </List.Unordered>
            <div>
              <CostsModal
                template={item}
                type="edit"
                currencies={sortedCurrencies}
                onSuccess={(updatedItem: Cost) =>
                  setFieldValue(`costs[${i}]`, updatedItem)
                }
              />

              <DeleteButton onClick={handleDeleteCost(i)} />
            </div>
          </Card.Block>
          <Card.Block className={styles.costFooter}>
            <Paragraph>{getTranslateText(item?.description)}</Paragraph>
            <div>
              {ALLOWED_LANGUAGES.filter(
                (lang) =>
                  item?.description &&
                  Object.prototype.hasOwnProperty.call(item.description, lang),
              ).map((lang) => (
                <Tag key={lang} data-color="info">
                  {localization.language[lang]}
                </Tag>
              ))}
            </div>
          </Card.Block>
        </Card>
      ))}

      <div>
        <CostsModal
          template={{ description: {} }}
          type="new"
          currencies={sortedCurrencies}
          onSuccess={(formValues) =>
            setFieldValue(
              values.costs && values.costs.length > 0
                ? `costs[${values.costs.length}]`
                : "costs[0]",
              formValues,
            )
          }
        />
      </div>
    </div>
  );
};
