import {
  DataService,
  DataServiceCost,
  ISOLanguage,
  ReferenceDataCode,
} from "@catalog-frontend/types";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import {
  Button,
  Card,
  Link,
  List,
  Paragraph,
  Tag,
} from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import { TitleWithHelpTextAndTag } from "@catalog-frontend/ui-v2";
import styles from "../data-service-form.module.css";
import { TrashIcon } from "@navikt/aksel-icons";
import { CostsModal } from "./costs-modal/costs-modal";

type Props = {
  currencies?: ReferenceDataCode[];
};

const sortCurrencies = (currencies?: ReferenceDataCode[]) => {
  const priority = ["JPY", "ISK", "SEK", "DKK", "GBP", "USD", "EUR", "NOK"];
  return currencies?.sort((a, b) => {
    if (!a.code) return 1;
    if (!b.code) return -1;

    const indexA = priority.indexOf(a.code);
    const indexB = priority.indexOf(b.code);

    if (indexA !== -1 || indexB !== -1) {
      return indexB - indexA;
    }

    return a.code.localeCompare(b.code);
  });
};

export const CostsTable = ({ currencies }: Props) => {
  const { values, setFieldValue } = useFormikContext<DataService>();
  const sortedCurrencies = sortCurrencies(currencies);
  const allowedLanguages = Object.freeze<ISOLanguage[]>(["nb", "nn", "en"]);

  const handleDeleteCost = (index: number) => () => {
    const newCosts = values.costs?.filter((_, i) => i !== index);
    setFieldValue("costs", newCosts?.length ? newCosts : []);
  };

  return (
    <div className={styles.fieldContainer}>
      <TitleWithHelpTextAndTag
        helpText={localization.dataServiceForm.helptext.costs}
      >
        {localization.dataServiceForm.fieldLabel.costs}
      </TitleWithHelpTextAndTag>
      {values?.costs?.map((item, i) => (
        <Card key={`costs-card-${i}`} data-color="neutral">
          <Card.Block className={styles.costContent}>
            <List.Unordered
              style={{
                listStyle: "none",
                paddingLeft: 0,
              }}
            >
              {item?.value && (
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
                onSuccess={(updatedItem: DataServiceCost) =>
                  setFieldValue(`costs[${i}]`, updatedItem)
                }
              />

              <Button
                variant="tertiary"
                data-color="danger"
                onClick={handleDeleteCost(i)}
              >
                <TrashIcon title="Slett" fontSize="1.5rem" />
                {localization.button.delete}
              </Button>
            </div>
          </Card.Block>
          <Card.Block className={styles.costFooter}>
            <Paragraph>{getTranslateText(item?.description)}</Paragraph>
            <div>
              {allowedLanguages
                .filter(
                  (lang) =>
                    item?.description &&
                    Object.prototype.hasOwnProperty.call(
                      item.description,
                      lang,
                    ),
                )
                .map((lang) => (
                  <Tag key={lang} data-color="third">
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
              values.costs && values?.costs.length > 0
                ? `costs[${values?.costs?.length}]`
                : "costs[0]",
              formValues,
            )
          }
        />
      </div>
    </div>
  );
};
