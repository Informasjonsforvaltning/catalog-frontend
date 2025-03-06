'use client';

import { useState } from 'react';
import { useFormikContext } from 'formik';
import { Box, Button, Card, Heading, Link, Tag } from '@digdir/designsystemet-react';
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
      distribution.license?.uri ||
      distribution.description?.nb ||
      distribution.page?.[0]?.uri ||
      distribution?.conformsTo?.[0]?.prefLabel?.nb
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
    <div>
      <Box className={styles.fieldSet}>
        <Heading
          size='xs'
          level={3}
        >
          <TitleWithHelpTextAndTag
            helpText={localization.datasetForm.helptext.distribution}
            tagColor='info'
            tagTitle={localization.tag.recommended}
          >
            {localization.datasetForm.fieldLabel.distributions}
          </TitleWithHelpTextAndTag>
        </Heading>
        {values?.distribution &&
          !distributionArrayIsEmpty(values?.distribution) &&
          values?.distribution?.map(
            (item, index) =>
              !isEmpty(item) && (
                <Card key={`distribusjon-${index}`}>
                  <div className={styles.heading}>
                    <Heading
                      size='xs'
                      spacing
                      level={4}
                    >
                      {getTranslateText(item?.title) ?? ''}
                    </Heading>
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

                  {item?.accessURL && (
                    <Heading
                      size='2xs'
                      level={4}
                    >{`${localization.datasetForm.fieldLabel.accessURL}:`}</Heading>
                  )}
                  <Link href={item?.accessURL?.[0]}>{item?.accessURL?.[0]}</Link>

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
            title: { nb: '' },
            description: { nb: '' },
            downloadURL: [''],
            accessURL: [''],
            format: [],
            mediaType: [],
            page: [{ uri: '' }],
            conformsTo: [{ uri: '', prefLabel: { nb: '' } }],
            accessServiceUris: [],
          }}
        />
      </Box>

      <FieldsetDivider />
      <Box className={styles.fieldSet}>
        <Heading
          level={3}
          size='xs'
        >
          <TitleWithHelpTextAndTag helpText={localization.datasetForm.helptext.sample}>
            {localization.datasetForm.fieldLabel.sample}
          </TitleWithHelpTextAndTag>
        </Heading>

        {values?.sample &&
          !distributionArrayIsEmpty(values?.sample) &&
          values?.sample?.map(
            (item, index) =>
              !isEmpty(item) && (
                <Card key={`sample-${index}`}>
                  <div className={styles.heading}>
                    <div className={styles.exampleHeading}>
                      {item?.accessURL && (
                        <Heading
                          size='2xs'
                          level={4}
                        >{`${localization.datasetForm.fieldLabel.accessURL}: `}</Heading>
                      )}
                      <Link href={item?.accessURL?.[0]}>{item?.accessURL?.[0]}</Link>
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
              downloadURL: [''],
              accessURL: [''],
              format: [],
              mediaType: [],
              page: [{ uri: '' }],
              conformsTo: [{ uri: '', prefLabel: { nb: '' } }],
              accessServiceUris: [],
            }}
          />
        </div>
      </Box>
    </div>
  );
};
