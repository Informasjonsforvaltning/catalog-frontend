'use client';

import { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { Box, Button, Card, Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Dataset, Distribution, ReferenceDataCode, Search } from '@catalog-frontend/types';
import { AddButton, DeleteButton, FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { DistributionModal } from './distribution-modal';
import { DistributionDetails } from './distribution-details';
import styles from './distributions.module.scss';
import { isEmpty } from 'lodash';
import {
  ReferenceDataGraphql,
  searchReferenceDataByUri,
  searchResourcesWithFilter,
} from '@catalog-frontend/data-access';

type Props = {
  referenceDataEnv: string;
  searchEnv: string;
  openLicenses: ReferenceDataCode[];
};

export const DistributionSection = ({ referenceDataEnv, searchEnv, openLicenses }: Props) => {
  const { values, setFieldValue } = useFormikContext<Dataset>();
  const [selectedFileTypeUris, setSelectedFileTypeUris] = useState<string[]>();
  const [selectedMediaTypeUris, setSelectedMediaTypeUris] = useState<string[]>();
  const [selectedDataServiceUris, setSelectedDataServiceUris] = useState<string[]>();
  const [selectedFileTypes, setSelectedFileTypes] = useState<ReferenceDataCode[]>();
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<ReferenceDataCode[]>();
  const [selectedDataServices, setSelectedDataServices] = useState<Search.SearchObject[]>();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedIndexExampleData, setExpandedIndexExampleData] = useState<number | null>(null);

  useEffect(() => {
    const distributionAccessServices = values.distribution?.map((val) => val?.accessServiceUris)?.flat() ?? [];
    const sampleAccessServices = values.sample?.map((val) => val?.accessServiceUris)?.flat() ?? [];
    const allAccessServices = [...distributionAccessServices, ...sampleAccessServices]
      .flat()
      .filter((item) => item !== undefined);
    const uniqueAccessServices = Array.from(new Set(allAccessServices));
    if (uniqueAccessServices !== selectedDataServiceUris) {
      setSelectedDataServiceUris(uniqueAccessServices);
    }

    const distributionFormats = values.distribution?.map((val) => val?.format) || [];
    const sampleFormats = values.sample?.map((val) => val?.format) || [];
    const allFormats = [...distributionFormats, ...sampleFormats].flat().filter((item) => item !== undefined);
    const uniqueFormats = Array.from(new Set(allFormats));
    if (uniqueFormats !== selectedFileTypeUris) {
      setSelectedFileTypeUris(uniqueFormats);
    }

    const distributionMediaTypes = values.distribution?.map((val) => val?.mediaType) || [];
    const sampleMediaTypes = values.sample?.map((val) => val?.mediaType) || [];
    const allMediaTypes = [...distributionMediaTypes, ...sampleMediaTypes].flat().filter((item) => item !== undefined);
    const uniqueMediaTypes = Array.from(new Set(allMediaTypes));
    if (uniqueMediaTypes !== selectedMediaTypeUris) {
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
        const res = await searchResourcesWithFilter(searchEnv, 'dataservices', searchOperation);
        const data = await res.json();
        setSelectedDataServices(data.hits as Search.SearchObject[]);
      }
    };

    updateSelectedDataServices();
  }, [selectedDataServiceUris]);

  useEffect(() => {
    const updateSelectedMediaTypes = async () => {
      if (selectedMediaTypeUris && !isEmpty(selectedMediaTypeUris)) {
        const data: ReferenceDataCode[] = await searchReferenceDataByUri(selectedMediaTypeUris, referenceDataEnv, [
          ReferenceDataGraphql.SearchAlternative.IanaMediaTypes,
        ]);
        setSelectedMediaTypes(data);
      }
    };

    updateSelectedMediaTypes();
  }, [selectedMediaTypeUris]);

  useEffect(() => {
    const updateSelectedFileTypes = async () => {
      if (selectedFileTypeUris && !isEmpty(selectedFileTypeUris)) {
        const data: ReferenceDataCode[] = await searchReferenceDataByUri(selectedFileTypeUris, referenceDataEnv, [
          ReferenceDataGraphql.SearchAlternative.EuFileTypes,
        ]);
        setSelectedFileTypes(data);
      }
    };

    updateSelectedFileTypes();
  }, [selectedFileTypeUris]);

  const distributionArrayIsEmpty = (arr: Distribution[]) => Array.isArray(arr) && arr.every((item) => item == null);

  function showSeeMoreButton(distribution: Distribution | undefined | null): boolean {
    if (!distribution) {
      return false;
    }

    if (
      !isEmpty(distribution.downloadURL) ||
      !isEmpty(distribution.mediaType) ||
      !isEmpty(distribution.accessServiceUris) ||
      distribution.license ||
      !isEmpty(distribution.description) ||
      !isEmpty(distribution.page) ||
      !isEmpty(distribution?.conformsTo)
    ) {
      return true;
    }
    return false;
  }

  type DistributionKey = 'distribution' | 'sample';

  const getField = (distributionType: string): string => {
    const fieldValues = values[distributionType as DistributionKey] ?? [];
    const hasValues = fieldValues.length > 0 && !isEmpty(fieldValues[0]?.accessURL?.[0]);
    return `${distributionType}[${hasValues ? fieldValues.length : 0}]`;
  };

  return (
    <Box>
      <div className={styles.fieldSet}>
        <TitleWithHelpTextAndTag
          helpText={localization.datasetForm.helptext.distribution}
          tagColor='info'
          tagTitle={localization.tag.recommended}
        >
          {localization.datasetForm.fieldLabel.distributions}
        </TitleWithHelpTextAndTag>
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
                          <Heading
                            size='2xs'
                            spacing
                            level={3}
                          >
                            {localization.datasetForm.fieldLabel.title}
                          </Heading>
                          <Paragraph size='sm'>{getTranslateText(item.title)}</Paragraph>
                        </>
                      )}
                    </div>
                    <div className={styles.buttons}>
                      <DistributionModal
                        type='edit'
                        initialValues={item}
                        initialFileTypes={selectedFileTypes ?? []}
                        initialMediaTypes={selectedMediaTypes ?? []}
                        initialAccessServices={selectedDataServices ?? []}
                        referenceDataEnv={referenceDataEnv}
                        searchEnv={searchEnv}
                        openLicenses={openLicenses}
                        distributionType='distribution'
                        onSuccess={(updatedDist) => {
                          setFieldValue(`distribution[${index}]`, updatedDist);
                        }}
                        trigger={
                          <Button
                            variant='tertiary'
                            size='sm'
                          >
                            <PencilWritingIcon
                              title='Rediger'
                              fontSize='1.5rem'
                            />
                            {localization.button.edit}
                          </Button>
                        }
                      />
                      <DeleteButton onClick={() => setFieldValue(`distribution[${index}]`, undefined)} />
                    </div>
                  </div>

                  <div className={styles.field}>
                    {item?.accessURL && (
                      <>
                        <Heading
                          size='2xs'
                          level={4}
                        >
                          {localization.datasetForm.fieldLabel.accessURL}
                        </Heading>
                        {item.accessURL.map((url: string, index: number) => {
                          return (
                            <Paragraph
                              key={`accessURL-${index}`}
                              size='sm'
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
                      <Heading
                        size='2xs'
                        level={4}
                      >
                        {localization.datasetForm.fieldLabel.format}
                      </Heading>
                    )}
                    <div className={styles.tags}>
                      {item?.format?.map((uri) => (
                        <Tag
                          key={uri}
                          color='third'
                          size='sm'
                        >
                          {(selectedFileTypes?.find((format) => format?.uri === uri) ?? {}).code ?? uri}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  {showSeeMoreButton(item) && (
                    <div>
                      <Button
                        variant='tertiary'
                        onClick={() => {
                          setExpandedIndex(expandedIndex === index ? null : index);
                        }}
                        className={styles.button}
                        size='sm'
                      >
                        {expandedIndex === index ? (
                          <>
                            <ChevronUpIcon fontSize='1.3rem' />
                            {localization.seeLess}
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon fontSize='1.3rem' />
                            {localization.seeMore}
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {expandedIndex === index && (
                    <DistributionDetails
                      selectedDataServices={selectedDataServices ?? []}
                      selectedMediaTypes={selectedMediaTypes ?? []}
                      distribution={item}
                      openLicenses={openLicenses}
                    />
                  )}
                </Card>
              ),
          )}
        <DistributionModal
          type='new'
          distributionType='distribution'
          trigger={<AddButton>{localization.datasetForm.button.addDistribution}</AddButton>}
          onSuccess={(formValues: Distribution, distributionType) => {
            setFieldValue(getField(distributionType), formValues);
          }}
          referenceDataEnv={referenceDataEnv}
          searchEnv={searchEnv}
          openLicenses={openLicenses}
          initialFileTypes={[]}
          initialMediaTypes={[]}
          initialAccessServices={[]}
          initialValues={{
            title: {},
            description: {},
            downloadURL: [],
            accessURL: [],
            format: [],
            mediaType: [],
            page: [],
            conformsTo: [],
            accessServiceUris: [],
          }}
        />
      </div>
      <FieldsetDivider />
      <div className={styles.fieldSet}>
        <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.sample}>
          {localization.datasetForm.fieldLabel.sample}
        </TitleWithHelpTextAndTag>
        {values?.sample &&
          !distributionArrayIsEmpty(values?.sample) &&
          values?.sample?.map(
            (item, index) =>
              !isEmpty(item) && (
                <Card key={`sample-${index}`}>
                  <div className={styles.heading}>
                    <div className={styles.field}>
                      {item?.accessURL && (
                        <>
                          <Heading
                            size='2xs'
                            level={4}
                          >
                            {localization.datasetForm.fieldLabel.accessURL}
                          </Heading>
                          {item.accessURL.map((url: string, index: number) => {
                            return (
                              <Paragraph
                                key={`accessURL-${index}`}
                                size='sm'
                              >
                                {url}
                              </Paragraph>
                            );
                          })}
                        </>
                      )}
                    </div>
                    <div className={styles.buttons}>
                      <DistributionModal
                        type='edit'
                        initialValues={item}
                        initialFileTypes={selectedFileTypes ?? []}
                        initialMediaTypes={selectedMediaTypes ?? []}
                        initialAccessServices={selectedDataServices ?? []}
                        distributionType='sample'
                        referenceDataEnv={referenceDataEnv}
                        searchEnv={searchEnv}
                        onSuccess={(updatedDist: Distribution) => {
                          setFieldValue(`sample[${index}]`, updatedDist);
                        }}
                        trigger={
                          <Button
                            variant='tertiary'
                            size='sm'
                          >
                            <PencilWritingIcon
                              title='Rediger'
                              fontSize='1.5rem'
                            />
                            {localization.button.edit}
                          </Button>
                        }
                      />
                      <DeleteButton onClick={() => setFieldValue(`sample[${index}]`, undefined)} />
                    </div>
                  </div>

                  <div className={styles.field}>
                    {!isEmpty(item?.format) && (
                      <Heading
                        size='2xs'
                        level={4}
                      >
                        {localization.datasetForm.fieldLabel.format}
                      </Heading>
                    )}
                    <div className={styles.tags}>
                      {item?.format?.map((uri) => (
                        <Tag
                          key={uri}
                          color='info'
                          size='sm'
                        >
                          {(selectedFileTypes?.find((format) => format?.uri === uri) ?? {}).code ?? uri}
                        </Tag>
                      ))}
                    </div>
                  </div>

                  {showSeeMoreButton(item) && (
                    <div>
                      <Button
                        variant='tertiary'
                        onClick={() => {
                          setExpandedIndexExampleData(expandedIndexExampleData === index ? null : index);
                        }}
                        className={styles.button}
                        size='sm'
                      >
                        {expandedIndexExampleData === index ? (
                          <>
                            <ChevronUpIcon fontSize='1.3rem' />
                            {localization.seeLess}
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon fontSize='1.3rem' />
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
                </Card>
              ),
          )}

        <div className={styles.add}>
          <DistributionModal
            type='new'
            distributionType='sample'
            trigger={<AddButton>{localization.datasetForm.button.addSample}</AddButton>}
            onSuccess={(formValues: Distribution, distributionType) => {
              setFieldValue(getField(distributionType), formValues);
            }}
            referenceDataEnv={referenceDataEnv}
            searchEnv={searchEnv}
            openLicenses={openLicenses}
            initialFileTypes={[]}
            initialMediaTypes={[]}
            initialAccessServices={[]}
            initialValues={{
              title: {},
              description: {},
              downloadURL: [],
              accessURL: [],
              format: [],
              mediaType: [],
              page: [],
              conformsTo: [],
              accessServiceUris: [],
            }}
          />
        </div>
      </div>
    </Box>
  );
};
