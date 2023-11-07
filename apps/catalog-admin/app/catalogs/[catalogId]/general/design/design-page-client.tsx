'use client';

import React, { useEffect, useState } from 'react';
import { useAdminState } from '../../../../../context/admin';
import { ColorPicker } from '../../../../../components/color-picker';
import { ImageUploader } from '../../../../../components/image-uploader';
import styles from './design.module.css';
import { BreadcrumbType, Breadcrumbs, Button, PageBanner } from '@catalog-frontend/ui';
import { Heading, Label, Textfield } from '@digdir/design-system-react';
import { getTranslateText, localization, textRegexWithNumbers } from '@catalog-frontend/utils';
import { Design } from '@catalog-frontend/types';
import { useGetDesign, useGetLogo, useUpdateDesign } from '../../../../../hooks/design';
import { compare } from 'fast-json-patch';
import { PageLayout } from '../../../../../components/page-layout';

const DesignPageClient = ({ catalogId, organization }) => {
  const adminContext = useAdminState();

  const { backgroundColor, fontColor, logo } = adminContext;
  const [isTextInputValid, setIsTextInputValid] = useState(true);
  const [disableTextField, setDisableTextField] = useState(true);

  const { data: getDesign } = useGetDesign(catalogId);
  const dbDesign: Design = getDesign;

  const { data: getLogo } = useGetLogo(catalogId);
  const dbLogo = getLogo;

  const [imageLabel, setImageLabel] = useState('');
  const updateDesign = useUpdateDesign(catalogId);

  const handleUpdateDbDesign = () => {
    const newDesign = {
      backgroundColor: backgroundColor,
      fontColor: fontColor,
      logoDescription: imageLabel,
      hasLogo: dbDesign.hasLogo,
    };

    const diff = compare(dbDesign, newDesign);

    if (diff) {
      updateDesign
        .mutateAsync({ oldDesign: dbDesign, newDesign: newDesign })
        .then(() => alert(localization.alert.success))
        .catch(() => alert(localization.alert.fail));
    } else {
      console.log('No changes detected.');
    }
  };

  useEffect(() => {
    const hasValidLabel = dbDesign?.hasLogo ? textRegexWithNumbers.test(dbDesign.logoDescription) : false;
    setDisableTextField(!(logo || (dbDesign && dbDesign.hasLogo) || hasValidLabel));
  }, [logo, dbLogo, dbDesign]);

  useEffect(() => {
    if (dbDesign?.logoDescription !== undefined && dbDesign?.logoDescription !== null) {
      setImageLabel(dbDesign.logoDescription);
    }
  }, [dbDesign?.logoDescription]);

  const breadcrumbList = catalogId
    ? ([
        {
          href: `/catalogs/${catalogId}`,
          text: getTranslateText(localization.manageCatalog),
        },
        {
          href: `/catalogs/${catalogId}/general`,
          text: getTranslateText(localization.general),
        },
        {
          href: `/catalogs/${catalogId}/general/design`,
          text: getTranslateText(localization.catalogAdmin.design),
        },
      ] as BreadcrumbType[])
    : [];

  return (
    <>
      <Breadcrumbs breadcrumbList={breadcrumbList} />

      <PageLayout>
        <div className={styles.heading}>
          <Heading size='xlarge'>{localization.catalogAdmin.design}</Heading>
        </div>
        <div className={styles.subheading}>
          <Heading size='small'>{localization.catalogAdmin.preview}</Heading>
        </div>

        <>
          <PageBanner
            title={'Administrere Begrepskatalog'}
            subtitle={String(getTranslateText(organization?.prefLabel))}
            logoDescription={dbDesign?.hasLogo && dbDesign?.logoDescription}
            backgroundColor={backgroundColor || dbDesign?.backgroundColor || '#FFFFFF'}
            fontColor={fontColor || dbDesign?.fontColor || '#2D3741'}
            logo={logo || (dbDesign?.hasLogo && `/api/design/${catalogId}/logo`) || null}
          />
        </>
        <div className={styles.subheading}>
          <Heading size='small'>{localization.catalogAdmin.customizeDesign}</Heading>
        </div>

        <div className={styles.backgroundContainer}>
          <div className={styles.imageUploader}>
            <div className={styles.infoBox}>
              <Label>{localization.catalogAdmin.logo}</Label>
              <p>{localization.catalogAdmin.designHelpText.logo}</p>
            </div>
            <ImageUploader catalogId={catalogId} />
          </div>
          <div className={styles.infoBox}>
            <Label>{localization.catalogAdmin.descriptionLogo}</Label>
            <p>{localization.catalogAdmin.designHelpText.logoDescription}</p>
          </div>
          <div className={styles.textFieldContainer}>
            <Textfield
              className={styles.textField}
              error={!isTextInputValid && localization.validation.invalidValue}
              value={imageLabel}
              onChange={(event) => {
                setImageLabel(event.target.value);
                setIsTextInputValid(textRegexWithNumbers.test(event.target.value));
              }}
              required={true}
              disabled={disableTextField}
            />
          </div>
        </div>
        <div className={styles.backgroundContainer}>
          <div className={styles.infoBox}>
            <Label>{localization.catalogAdmin.colors}</Label>
            <p>{localization.catalogAdmin.designHelpText.colors}</p>
          </div>
          <div className={styles.colorPickers}>
            <div>
              <div className={styles.label}>
                <Label>{localization.catalogAdmin.backgroundColor}</Label>
              </div>
              <ColorPicker type='background' />
            </div>
            <div>
              <div className={styles.label}>
                <Label>{localization.catalogAdmin.fontColor}</Label>
              </div>
              <ColorPicker type='font' />
            </div>
          </div>
          <div>
            <Button onClick={() => handleUpdateDbDesign()}>{localization.save}</Button>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default DesignPageClient;
