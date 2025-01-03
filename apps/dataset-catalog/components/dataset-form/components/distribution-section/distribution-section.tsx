'use client';

import { useState } from 'react';
import { useFormikContext } from 'formik';
import { Button, Card, Heading, Label, Link, Tag } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Dataset, Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import { AddButton, DeleteButton, FieldsetDivider } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useSearchFileTypeByUri } from '../../../../hooks/useReferenceDataSearch';
import { DistributionModal } from './distribution-modal';
import { DistributionDetails } from './distribution-details';
import styles from './distributions.module.css';
import _ from 'lodash';

type Props = {
  referenceDataEnv: string;
  searchEnv: string;
  openLicenses: ReferenceDataCode[];
};

type FormikDistribution = {
  type: string;
  values: Partial<Distribution>;
};

export const DistributionSection = ({ referenceDataEnv, searchEnv, openLicenses }: Props) => {
  const { values, setFieldValue } = useFormikContext<Dataset>();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedIndexExampleData, setExpandedIndexExampleData] = useState<number | null>(null);

  const getSelectedFileTypes = (): string[] => {
    const distributionFormats = values.distribution?.map((val) => val.format) || [];
    const sampleFormats = values.sample?.map((val) => val.format) || [];
    return [...distributionFormats, ...sampleFormats].flat().filter((item) => item !== undefined);
  };

  const { data: selectedFileTypes } = useSearchFileTypeByUri(getSelectedFileTypes(), referenceDataEnv);

  function showSeeMoreButton(distribution: Distribution | undefined | null): boolean {
    if (!distribution) {
      return false;
    }

    if (
      distribution.downloadURL?.[0] ||
      distribution.mediaType?.[0] ||
      distribution.accessServiceList?.[0] ||
      distribution.accessService?.[0] ||
      distribution.license?.uri ||
      distribution.description?.nb ||
      distribution.page?.[0]?.uri ||
      distribution?.conformsTo?.[0]?.prefLabel?.nb
    ) {
      return true;
    }
    return false;
  }

  const getField = (formValues: FormikDistribution): string => {
    const fieldValues =
      {
        distribution: values.distribution,
        sample: values.sample,
      }[formValues.type] ?? [];

    const hasValues = fieldValues.length > 0 && _.isEmpty(fieldValues[0]?.accessURL?.[0]);

    return `${formValues.type}[${hasValues ? fieldValues.length : 0}]`;
  };

  return (
    <>
      {values?.distribution && (
        <Heading
          size='xs'
          className={styles.list}
        >
          {localization.datasetForm.fieldLabel.distributions}
          <Tag
            size='sm'
            color='info'
          >
            {localization.tag.recommended}
          </Tag>
        </Heading>
      )}
      {values?.distribution?.map((item, index) => (
        <Card key={`distribusjon-${index}`}>
          <div className={styles.heading}>
            <Heading
              size='xs'
              spacing
            >
              {getTranslateText(item.title) ?? ''}
            </Heading>
            <div className={styles.buttons}>
              <DistributionModal
                type='edit'
                initialValues={item}
                referenceDataEnv={referenceDataEnv}
                searchEnv={searchEnv}
                openLicenses={openLicenses}
                onSuccess={(updatedDist: FormikDistribution) =>
                  setFieldValue(`distribution[${index}]`, updatedDist.values)
                }
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

          {item.accessURL && <Label size='sm'>{`${localization.datasetForm.fieldLabel.accessURL}:`}</Label>}
          <Link href={item?.accessURL?.[0]}>{item?.accessURL?.[0]}</Link>

          <div className={styles.tags}>
            {item?.format?.map((uri) => (
              <Tag
                key={uri}
                color='third'
                size='sm'
              >
                {(selectedFileTypes?.find((format) => format.uri === uri) ?? {}).code ?? uri}
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
      ))}

      {values?.sample && (
        <>
          <FieldsetDivider />
          <Heading size='xs'>Eksempeldata</Heading>
        </>
      )}
      {values?.sample?.map((item, index) => (
        <Card key={`sample-${index}`}>
          <div className={styles.heading}>
            <div className={styles.exampleHeading}>
              {item.accessURL && <Label size='sm'>{`${localization.datasetForm.fieldLabel.accessURL}: `}</Label>}
              <Link href={item?.accessURL?.[0]}>{item?.accessURL?.[0]}</Link>
            </div>
            <div className={styles.buttons}>
              <DistributionModal
                type='edit'
                initialValues={item}
                initialDistributionType='exampledata'
                referenceDataEnv={referenceDataEnv}
                searchEnv={searchEnv}
                onSuccess={(updatedDist: FormikDistribution) => setFieldValue(`sample[${index}]`, updatedDist.values)}
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
                color='third'
                size='sm'
              >
                {(selectedFileTypes?.find((format) => format.uri === uri) ?? {}).code ?? uri}
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
      ))}

      <div className={styles.add}>
        <DistributionModal
          type={'new'}
          trigger={<AddButton>{localization.datasetForm.button.addDistribution}</AddButton>}
          onSuccess={(formValues: FormikDistribution) => {
            setFieldValue(getField(formValues), formValues.values);
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
            accessServiceList: [],
          }}
        />

        {(!values?.distribution || values.distribution?.length === 0) && (
          <div>
            <Tag
              color='info'
              size='sm'
            >
              {localization.tag.recommended}
            </Tag>
          </div>
        )}
      </div>
    </>
  );
};
