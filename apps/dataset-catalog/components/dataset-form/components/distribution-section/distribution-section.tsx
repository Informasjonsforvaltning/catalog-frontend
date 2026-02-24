"use client";

import { useEffect, useState } from "react";
import { Field, useFormikContext } from "formik";
import {
  Button,
  Card,
  Fieldset,
  Heading,
  Paragraph,
  Tag,
  ValidationMessage,
} from "@digdir/designsystemet-react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilWritingIcon,
} from "@navikt/aksel-icons";
import {
  Dataset,
  Distribution,
  ReferenceDataCode,
  Search,
  StorageData,
} from "@catalog-frontend/types";
import {
  AddButton,
  DeleteButton,
  FieldsetDivider,
  TitleWithHelpTextAndTag,
} from "@catalog-frontend/ui-v2";
import {
  getTranslateText,
  localization,
  DataStorage,
} from "@catalog-frontend/utils";
import { DistributionModal } from "./distribution-modal";
import { DistributionDetails } from "./distribution-details";
import styles from "./distributions.module.scss";
import { get, isEmpty } from "lodash";
import {
  ReferenceDataGraphql,
  searchReferenceDataByUri,
  searchResourcesWithFilter,
} from "@catalog-frontend/data-access";

type Props = {
  referenceDataEnv: string;
  searchEnv: string;
  openLicenses: ReferenceDataCode[];
  autoSaveId?: string;
  autoSaveStorage?: DataStorage<StorageData>;
  isMobility?: boolean;
  mobilityDataStandards?: ReferenceDataCode[];
  mobilityRights?: ReferenceDataCode[];
};

export const DistributionSection = ({
  referenceDataEnv,
  searchEnv,
  openLicenses,
  autoSaveId,
  autoSaveStorage,
  isMobility,
  mobilityDataStandards,
  mobilityRights,
}: Props) => {
  const { values, errors, setFieldValue } = useFormikContext<Dataset>();
  const [expandedIndexDistribution, setExpandedIndexDistribution] = useState<
    number | null
  >(null);
  const [expandedIndexExampleData, setExpandedIndexExampleData] = useState<
    number | null
  >(null);
  const [selectedFileTypeUris, setSelectedFileTypeUris] = useState<string[]>();
  const [selectedMediaTypeUris, setSelectedMediaTypeUris] =
    useState<string[]>();
  const [selectedDataServiceUris, setSelectedDataServiceUris] =
    useState<string[]>();
  const [selectedFileTypes, setSelectedFileTypes] = useState<
    ReferenceDataCode[]
  >([]);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<
    ReferenceDataCode[]
  >([]);
  const [selectedDataServices, setSelectedDataServices] = useState<
    Search.SearchObject[]
  >([]);

  const handleDistributionChange = (
    updatedDist: Distribution,
    distributionType: "distribution" | "sample",
    index: number,
  ) => {
    // Save to secondary storage for auto-save
    if (autoSaveStorage && autoSaveId) {
      autoSaveStorage.setSecondary("distribution", {
        id: autoSaveId,
        values: {
          distribution: updatedDist,
          distributionType,
          index,
        },
        lastChanged: new Date().toISOString(),
      });
    }
  };

  const handleDistributionCancel = (
    distributionType: "distribution" | "sample",
  ) => {
    // Clean up secondary storage on cancel
    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary("distribution");
    }
  };

  const handleDistributionSuccess = (
    updatedDist: Distribution,
    distributionType: "distribution" | "sample",
    index: number,
  ) => {
    setFieldValue(`${distributionType}[${index}]`, updatedDist);

    // Clean up secondary storage on success
    if (autoSaveStorage) {
      autoSaveStorage.deleteSecondary("distribution");
    }
  };

  useEffect(() => {
    const distributionAccessServices =
      values.distribution?.map((val) => val?.accessServices)?.flat() ?? [];
    const sampleAccessServices =
      values.sample?.map((val) => val?.accessServices)?.flat() ?? [];
    const allAccessServices = [
      ...distributionAccessServices,
      ...sampleAccessServices,
    ]
      .flat()
      .filter((item) => item !== undefined);
    const uniqueAccessServices = Array.from(new Set(allAccessServices));
    if (
      uniqueAccessServices &&
      uniqueAccessServices !== selectedDataServiceUris
    ) {
      setSelectedDataServiceUris(uniqueAccessServices);
    }

    const distributionFormats =
      values.distribution?.map((val) => val?.format) || [];
    const sampleFormats = values.sample?.map((val) => val?.format) || [];
    const allFormats = [...distributionFormats, ...sampleFormats]
      .flat()
      .filter((item) => item !== undefined);
    const uniqueFormats = Array.from(new Set(allFormats));
    if (uniqueFormats && uniqueFormats !== selectedFileTypeUris) {
      setSelectedFileTypeUris(uniqueFormats);
    }

    const distributionMediaTypes =
      values.distribution?.map((val) => val?.mediaType) || [];
    const sampleMediaTypes = values.sample?.map((val) => val?.mediaType) || [];
    const allMediaTypes = [...distributionMediaTypes, ...sampleMediaTypes]
      .flat()
      .filter((item) => item !== undefined);
    const uniqueMediaTypes = Array.from(new Set(allMediaTypes));
    if (uniqueMediaTypes && uniqueMediaTypes !== selectedMediaTypeUris) {
      setSelectedMediaTypeUris(uniqueMediaTypes);
    }
  }, [values]);

  useEffect(() => {
    const updateSelectedDataServices = async () => {
      if (selectedDataServiceUris && !isEmpty(selectedDataServiceUris)) {
        const searchOperation: Search.SearchOperation = {
          filters: { uri: { value: selectedDataServiceUris } },
          pagination: { page: 0, size: 100 },
        };
        const res = await searchResourcesWithFilter(
          searchEnv,
          "dataservices",
          searchOperation,
        );
        const data = await res.json();
        setSelectedDataServices(data.hits as Search.SearchObject[]);
      }
    };

    updateSelectedDataServices();
  }, [selectedDataServiceUris]);

  useEffect(() => {
    const updateSelectedMediaTypes = async () => {
      if (selectedMediaTypeUris && !isEmpty(selectedMediaTypeUris)) {
        const data: ReferenceDataCode[] = await searchReferenceDataByUri(
          selectedMediaTypeUris,
          referenceDataEnv,
          [ReferenceDataGraphql.SearchAlternative.IanaMediaTypes],
        );
        setSelectedMediaTypes(data);
      }
    };

    updateSelectedMediaTypes();
  }, [selectedMediaTypeUris]);

  useEffect(() => {
    const updateSelectedFileTypes = async () => {
      if (selectedFileTypeUris && !isEmpty(selectedFileTypeUris)) {
        const data: ReferenceDataCode[] = await searchReferenceDataByUri(
          selectedFileTypeUris,
          referenceDataEnv,
          [ReferenceDataGraphql.SearchAlternative.EuFileTypes],
        );
        setSelectedFileTypes(data);
      }
    };

    updateSelectedFileTypes();
  }, [selectedFileTypeUris]);

  const distributionArrayIsEmpty = (arr: Distribution[]) =>
    Array.isArray(arr) && arr.every((item) => item == null);

  function showSeeMoreButton(
    distribution: Distribution | undefined | null,
  ): boolean {
    if (!distribution) {
      return false;
    }

    if (
      !isEmpty(distribution.downloadURL) ||
      !isEmpty(distribution.mediaType) ||
      !isEmpty(distribution.accessServices) ||
      distribution.license ||
      !isEmpty(distribution.description) ||
      !isEmpty(distribution.page) ||
      !isEmpty(distribution?.conformsTo)
    ) {
      return true;
    }
    return false;
  }

  return (
    <div>
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.distribution}
            tagTitle={
              isMobility
                ? localization.tag.required
                : localization.tag.recommended
            }
            tagColor={isMobility ? undefined : "info"}
          >
            {localization.datasetForm.fieldLabel.distributions}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        {values?.distribution &&
          !distributionArrayIsEmpty(values?.distribution) &&
          values?.distribution?.map(
            (item, index) =>
              !isEmpty(item) && (
                <Card key={`distribusjon-${index}`}>
                  <div className={styles.heading}>
                    <div className={styles.field}>
                      {!isEmpty(item?.title) && (
                        <>
                          <Heading data-size="2xs" level={3}>
                            {localization.datasetForm.fieldLabel.title}
                          </Heading>
                          <Paragraph data-size="sm">
                            {getTranslateText(item.title)}
                          </Paragraph>
                        </>
                      )}
                    </div>
                    <div className={styles.buttons}>
                      <DistributionModal
                        type="edit"
                        initialValues={{ ...item }}
                        initialFileTypes={selectedFileTypes ?? []}
                        initialMediaTypes={selectedMediaTypes ?? []}
                        initialAccessServices={selectedDataServices ?? []}
                        referenceDataEnv={referenceDataEnv}
                        searchEnv={searchEnv}
                        openLicenses={openLicenses}
                        mobilityDataStandards={mobilityDataStandards}
                        mobilityRights={mobilityRights}
                        distributionType="distribution"
                        onSuccess={(updatedDist) => {
                          handleDistributionSuccess(
                            updatedDist,
                            "distribution",
                            index,
                          );
                        }}
                        onCancel={() =>
                          handleDistributionCancel("distribution")
                        }
                        onChange={(updatedDist) =>
                          handleDistributionChange(
                            updatedDist,
                            "distribution",
                            index,
                          )
                        }
                        isMobility={isMobility}
                        trigger={
                          <Button variant="tertiary" data-size="sm">
                            <PencilWritingIcon
                              title="Rediger"
                              fontSize="1.5rem"
                            />
                            {localization.button.edit}
                          </Button>
                        }
                      />
                      <DeleteButton
                        onClick={() => {
                          const newArray = [...(values.distribution ?? [])];
                          newArray.splice(index, 1);
                          setFieldValue("distribution", newArray);
                          handleDistributionCancel("distribution");
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    {item?.accessURL && (
                      <>
                        <Heading data-size="2xs" level={4}>
                          {localization.datasetForm.fieldLabel.accessURL}
                        </Heading>
                        {item.accessURL.map((url: string, index: number) => {
                          return (
                            <Paragraph
                              key={`accessURL-${index}`}
                              data-size="sm"
                            >
                              {url}
                            </Paragraph>
                          );
                        })}
                      </>
                    )}
                  </div>

                  <div className={styles.field}>
                    {!isEmpty(item?.format) && (
                      <Heading data-size="2xs" level={4}>
                        {localization.datasetForm.fieldLabel.format}
                      </Heading>
                    )}
                    <div className={styles.tags}>
                      {item?.format?.map((uri) => (
                        <Tag key={uri} data-color="warning" data-size="sm">
                          {(
                            selectedFileTypes?.find(
                              (format) => format?.uri === uri,
                            ) ?? {}
                          ).code ?? uri}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  {showSeeMoreButton(item) && (
                    <div>
                      <Button
                        variant="tertiary"
                        onClick={() => {
                          setExpandedIndexDistribution(
                            expandedIndexDistribution === index ? null : index,
                          );
                        }}
                        className={styles.button}
                        data-size="sm"
                      >
                        {expandedIndexDistribution === index ? (
                          <>
                            <ChevronUpIcon fontSize="1.3rem" />
                            {localization.seeLess}
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon fontSize="1.3rem" />
                            {localization.seeMore}
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {expandedIndexDistribution === index && (
                    <DistributionDetails
                      selectedDataServices={selectedDataServices ?? []}
                      selectedMediaTypes={selectedMediaTypes ?? []}
                      distribution={item}
                      openLicenses={openLicenses}
                    />
                  )}
                  {get(errors, "distribution[" + index + "]") && (
                    <ValidationMessage data-size="sm">
                      {localization.validation.multipleInvalidValues}
                    </ValidationMessage>
                  )}
                </Card>
              ),
          )}
        <ValidationMessage>{errors.distribution}</ValidationMessage>
        <div className={styles.add}>
          <DistributionModal
            type="new"
            distributionType="distribution"
            trigger={
              <AddButton>
                {localization.datasetForm.button.addDistribution}
              </AddButton>
            }
            onSuccess={(formValues: Distribution) => {
              handleDistributionSuccess(
                formValues,
                "distribution",
                values.distribution?.length ?? 0,
              );
            }}
            onCancel={() => handleDistributionCancel("distribution")}
            onChange={(formValues: Distribution) => {
              handleDistributionChange(
                formValues,
                "distribution",
                values.distribution?.length ?? 0,
              );
            }}
            referenceDataEnv={referenceDataEnv}
            searchEnv={searchEnv}
            openLicenses={openLicenses}
            mobilityDataStandards={mobilityDataStandards}
            mobilityRights={mobilityRights}
            initialFileTypes={[]}
            initialMediaTypes={[]}
            initialAccessServices={[]}
            initialValues={{
              title: {},
              description: {},
              downloadURL: [],
              accessURL: [""],
              format: [],
              mediaType: [],
              page: [],
              conformsTo: [],
              accessServices: [],
              rights: { type: "" },
              mobilityDataStandard: "",
            }}
            isMobility={isMobility}
          />
        </div>
      </Fieldset>
      <FieldsetDivider />
      <Fieldset data-size="sm">
        <Fieldset.Legend>
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.sample}
          >
            {localization.datasetForm.fieldLabel.sample}
          </TitleWithHelpTextAndTag>
        </Fieldset.Legend>
        {values?.sample &&
          !distributionArrayIsEmpty(values?.sample) &&
          values?.sample
            ?.filter((sample) => !isEmpty(sample))
            .map(
              (item, index) =>
                !isEmpty(item) && (
                  <Card key={`sample-${index}`}>
                    <div className={styles.heading}>
                      <div className={styles.field}>
                        {item?.accessURL && (
                          <>
                            <Heading data-size="2xs" level={4}>
                              {localization.datasetForm.fieldLabel.accessURL}
                            </Heading>
                            {item.accessURL.map(
                              (url: string, index: number) => (
                                <Paragraph
                                  key={`accessURL-${index}`}
                                  data-size="sm"
                                >
                                  {url}
                                </Paragraph>
                              ),
                            )}
                          </>
                        )}
                      </div>
                      <div className={styles.buttons}>
                        <DistributionModal
                          type="edit"
                          initialValues={{ ...item }}
                          initialFileTypes={selectedFileTypes ?? []}
                          initialMediaTypes={selectedMediaTypes ?? []}
                          initialAccessServices={selectedDataServices ?? []}
                          distributionType="sample"
                          referenceDataEnv={referenceDataEnv}
                          searchEnv={searchEnv}
                          openLicenses={openLicenses}
                          mobilityDataStandards={mobilityDataStandards}
                          mobilityRights={mobilityRights}
                          onSuccess={(updatedDist: Distribution) => {
                            handleDistributionSuccess(
                              updatedDist,
                              "sample",
                              index,
                            );
                          }}
                          onCancel={() => handleDistributionCancel("sample")}
                          onChange={(updatedDist: Distribution) =>
                            handleDistributionChange(
                              updatedDist,
                              "sample",
                              index,
                            )
                          }
                          trigger={
                            <Button variant="tertiary" data-size="sm">
                              <PencilWritingIcon
                                title="Rediger"
                                fontSize="1.5rem"
                              />
                              {localization.button.edit}
                            </Button>
                          }
                          isMobility={isMobility}
                        />
                        <DeleteButton
                          onClick={() => {
                            const newArray = [...(values.sample ?? [])];
                            newArray.splice(index, 1);
                            setFieldValue("sample", newArray);
                            handleDistributionCancel("sample");
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.field}>
                      {!isEmpty(item?.format) && (
                        <Heading data-size="2xs" level={4}>
                          {localization.datasetForm.fieldLabel.format}
                        </Heading>
                      )}
                      <div className={styles.tags}>
                        {item?.format?.map((uri) => (
                          <Tag key={uri} data-color="info" data-size="sm">
                            {(
                              selectedFileTypes?.find(
                                (format) => format?.uri === uri,
                              ) ?? {}
                            ).code ?? uri}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    {showSeeMoreButton(item) && (
                      <div>
                        <Button
                          variant="tertiary"
                          onClick={() => {
                            setExpandedIndexExampleData(
                              expandedIndexExampleData === index ? null : index,
                            );
                          }}
                          className={styles.button}
                          data-size="sm"
                        >
                          {expandedIndexExampleData === index ? (
                            <>
                              <ChevronUpIcon fontSize="1.3rem" />
                              {localization.seeLess}
                            </>
                          ) : (
                            <>
                              <ChevronDownIcon fontSize="1.3rem" />
                              {localization.seeMore}
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {expandedIndexExampleData === index && (
                      <DistributionDetails
                        selectedDataServices={selectedDataServices ?? []}
                        selectedMediaTypes={selectedMediaTypes ?? []}
                        distribution={item}
                        openLicenses={openLicenses}
                      />
                    )}
                    {get(errors, "sample[" + index + "]") && (
                      <ValidationMessage data-size="sm">
                        Inneholder en eller flere ugyldige verdier
                      </ValidationMessage>
                    )}
                  </Card>
                ),
            )}

        <div className={styles.add}>
          <DistributionModal
            type="new"
            distributionType="sample"
            trigger={
              <AddButton>{localization.datasetForm.button.addSample}</AddButton>
            }
            onSuccess={(formValues: Distribution) => {
              handleDistributionSuccess(
                formValues,
                "sample",
                values.sample?.length ?? 0,
              );
            }}
            onCancel={() => handleDistributionCancel("sample")}
            onChange={(formValues: Distribution) => {
              handleDistributionChange(
                formValues,
                "sample",
                values.sample?.length ?? 0,
              );
            }}
            referenceDataEnv={referenceDataEnv}
            searchEnv={searchEnv}
            openLicenses={openLicenses}
            mobilityDataStandards={mobilityDataStandards}
            mobilityRights={mobilityRights}
            initialFileTypes={[]}
            initialMediaTypes={[]}
            initialAccessServices={[]}
            isMobility={isMobility}
            initialValues={{
              title: {},
              description: {},
              downloadURL: [],
              accessURL: [""],
              format: [],
              mediaType: [],
              page: [],
              conformsTo: [],
              accessServices: [],
            }}
          />
        </div>
      </Fieldset>
    </div>
  );
};
