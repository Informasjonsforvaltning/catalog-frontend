'use client';

import { useState } from 'react';
import { FieldArray, useFormikContext } from 'formik';
import { Button, Card, Heading, Label, Link, Tag } from '@digdir/designsystemet-react';
import { ChevronDownIcon, ChevronUpIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Dataset, Distribution, ReferenceDataCode } from '@catalog-frontend/types';
import { AddButton, DeleteButton } from '@catalog-frontend/ui';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useSearchFileTypeByUri } from '../../../../hooks/useReferenceDataSearch';
import { DistributionModal } from './distribution-modal';
import { DistributionDetails } from './distribution-details';
import styles from './distributions.module.css';

interface Props {
  referenceDataEnv: string;
  searchEnv: string;
  openLicenses: ReferenceDataCode[];
}

export const DistributionSection = ({ referenceDataEnv, searchEnv, openLicenses }: Props) => {
  const { values, setFieldValue } = useFormikContext<Dataset>();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { data: selectedFileTypes } = useSearchFileTypeByUri(values?.distribution?.[0]?.format ?? [], referenceDataEnv);

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

  return (
    <>
      <FieldArray name='distribution'>
        {() => (
          <div className={styles.distributionContent}>
            {values.distribution?.map((_, index) => (
              <Card key={`distribusjon-${index}`}>
                <div className={styles.heading}>
                  <Heading
                    size='xs'
                    spacing
                  >
                    {getTranslateText(values?.distribution?.[index]?.title) ?? ''}
                  </Heading>
                  <div className={styles.buttons}>
                    <DistributionModal
                      type={'edit'}
                      distribution={values?.distribution?.[index]}
                      referenceDataEnv={referenceDataEnv}
                      searchEnv={searchEnv}
                      openLicenses={openLicenses}
                      onSuccess={(updatedDist: Distribution) => setFieldValue(`distribution[${index}]`, updatedDist)}
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
                {values?.distribution?.[index].accessURL && (
                  <Label size='sm'>{`${localization.datasetForm.fieldLabel.accessUrl}:`}</Label>
                )}
                <Link href={values?.distribution?.[index].accessURL?.[0]}>
                  {values?.distribution?.[index].accessURL}
                </Link>
                <div className={styles.tags}>
                  {values?.distribution?.[index].format?.map((uri) => (
                    <Tag
                      key={uri}
                      color='third'
                      size='sm'
                    >
                      {(selectedFileTypes?.find((format) => format.uri === uri) ?? {}).code ?? uri}
                    </Tag>
                  ))}
                </div>
                {showSeeMoreButton(values?.distribution?.[index]) && (
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
                          <ChevronUpIcon fontSize={'1.3rem'} />
                          {localization.seeLess}
                        </>
                      ) : (
                        <>
                          <ChevronDownIcon fontSize={'1.3rem'} />
                          {localization.seeMore}
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {expandedIndex === index && (
                  <DistributionDetails
                    index={index}
                    searchEnv={searchEnv}
                    referenceDataEnv={referenceDataEnv}
                    openLicenses={openLicenses}
                  />
                )}
              </Card>
            ))}
            <div className={styles.add}>
              <div>
                <DistributionModal
                  type={'new'}
                  trigger={<AddButton>{localization.datasetForm.button.addDistribution}</AddButton>}
                  onSuccess={(def) =>
                    setFieldValue(
                      values?.distribution ? `distribution[${values?.distribution?.length}]` : 'distribution[0]',
                      def,
                    )
                  }
                  referenceDataEnv={referenceDataEnv}
                  searchEnv={searchEnv}
                  openLicenses={openLicenses}
                  distribution={{
                    title: { nb: '' },
                    description: { nb: '' },
                    downloadURL: [],
                    accessURL: [],
                    format: [],
                    mediaType: [],
                    conformsTo: [{ uri: '', prefLabel: { nb: '' } }],
                    accessServiceList: [],
                  }}
                />
              </div>
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
          </div>
        )}
      </FieldArray>
    </>
  );
};
