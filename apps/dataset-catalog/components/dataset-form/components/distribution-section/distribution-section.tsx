'use client';

import { useState } from 'react';
import { useFormikContext } from 'formik';
import { Box, Button, Card, Heading, Paragraph, Tag } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Dataset, Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import { AddButton, DeleteButton, FieldsetDivider, TitleWithHelpTextAndTag } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useSearchFileTypeByUri } from '../../../../hooks/useReferenceDataSearch';
import { DistributionModal } from './distribution-modal';
import { DistributionDetails } from './distribution-details';
import styles from './distributions.module.scss';
import { isEmpty } from 'lodash';

type Props = {
  referenceDataEnv: string;
  searchEnv: string;
  openLicenses: ReferenceDataCode[];
};

export const DistributionSection = ({ referenceDataEnv, searchEnv, openLicenses }: Props) => {
  const { values, setFieldValue } = useFormikContext<Dataset>();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedIndexExampleData, setExpandedIndexExampleData] = useState<number | null>(null);

  const getSelectedFileTypes = (): string[] => {
    const distributionFormats = values.distribution?.map((val) => val?.format) || [];
    const sampleFormats = values.sample?.map((val) => val?.format) || [];
    return [...distributionFormats, ...sampleFormats].flat().filter((item) => item !== undefined);
  };

  const { data: selectedFileTypes } = useSearchFileTypeByUri(getSelectedFileTypes(), referenceDataEnv);

  const distributionArrayIsEmpty = (arr: Distribution[]) => Array.isArray(arr) && arr.every((item) => item == null);

  function showSeeMoreButton(distribution: Distribution | undefined | null): boolean {
    if (!distribution) {
      return false;
    }

    if (
      distribution.downloadURL?.[0] ||
      distribution.mediaType?.[0] ||
      distribution.accessServiceUris?.[0] ||
      distribution.license ||
      distribution.description?.nb ||
      distribution.page?.[0] ||
      distribution?.conformsTo?.[0]
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
                      <Heading
                        size='2xs'
                        spacing
                        level={3}
                      >
                        {localization.datasetForm.fieldLabel.title}
                      </Heading>
                      <Paragraph size='sm'>{getTranslateText(item?.title) ?? ''}</Paragraph>
                    </div>
                    <div className={styles.buttons}>
                      <DistributionModal
                        type='edit'
                        initialValues={item}
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
                      <Heading
                        size='2xs'
                        level={4}
                      >
                        {localization.datasetForm.fieldLabel.accessURL}
                      </Heading>
                    )}
                    <Paragraph size='sm'>{item?.accessURL?.[0]}</Paragraph>
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
                      distribution={item}
                      searchEnv={searchEnv}
                      referenceDataEnv={referenceDataEnv}
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
                        <Heading
                          size='2xs'
                          level={4}
                        >
                          {localization.datasetForm.fieldLabel.accessURL}
                        </Heading>
                      )}
                      <Paragraph size='sm'>{item?.accessURL?.[0]}</Paragraph>
                    </div>
                    <div className={styles.buttons}>
                      <DistributionModal
                        type='edit'
                        initialValues={item}
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
                      distribution={item}
                      searchEnv={searchEnv}
                      referenceDataEnv={referenceDataEnv}
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
            initialValues={{
              title: { nb: '' },
              description: { nb: '' },
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
