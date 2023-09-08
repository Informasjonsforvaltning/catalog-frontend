import React, { useEffect, useState } from 'react';
import { useAdminState } from '../../../../../context/admin';
import { ColorPicker } from '../../../../../components/color-picker';
import { ImageUploader } from '../../../../../components/image-uploader';
import styles from './design.module.css';
import { BreadcrumbType, Breadcrumbs, Button, PageBanner } from '@catalog-frontend/ui';
import { Heading, HelpText, TextField } from '@digdir/design-system-react';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { Design } from '@catalog-frontend/types';
import { useRouter } from 'next/router';
import { textRegexWithNumbers } from '@catalog-frontend/utils';
import { useGetDesign, useGetLogo, useUpdateDesign } from '../../../../../hooks/design';
import { compare } from 'fast-json-patch';

const DesignPage = () => {
  const adminContext = useAdminState();
  const router = useRouter();
  const catalogId = `${router.query.catalogId}`;

  const { backgroundColor, fontColor, logo } = adminContext;
  const [isTextInputValid, setIsTextInputValid] = useState(true);
  const [disableTextField, setDisableTextField] = useState(true);

  const { data: getDesign } = useGetDesign(catalogId);
  const dbDesign: Design = getDesign;

  const { data: getLogo } = useGetLogo(catalogId);
  const dbLogo = getLogo;

  const { orgName } = adminContext;
  const pageSubtitle = orgName || catalogId;

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
          text: getTranslateText(localization.catalogAdmin.catalogAdmin),
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
      <div className={styles.center}>
        <div className={styles.container}>
          <div className={styles.heading}>
            <Heading size='xlarge'>{localization.catalogAdmin.design}</Heading>
          </div>

          <h2 className={styles.subheading}>{localization.catalogAdmin.preview}</h2>
          <>
            <PageBanner
              title={'Intern Begrepskatalog'}
              subtitle={String(getTranslateText(pageSubtitle))}
              logoDescription={dbDesign?.hasLogo && dbDesign?.logoDescription}
              backgroundColor={backgroundColor || dbDesign?.backgroundColor || '#FFFFFF'}
              fontColor={fontColor || dbDesign?.fontColor || '#2D3741'}
              logo={logo || (dbDesign?.hasLogo && `/api/design/${catalogId}/logo`) || null}
            />
          </>
          <h2 className={styles.subheading}>{localization.catalogAdmin.customizeDesign}</h2>

          <div className={styles.backgroundContainer}>
            <div className={styles.imageUploader}>
              <div className={styles.label}>
                <h3>{localization.catalogAdmin.logo}</h3>
                <HelpText title={localization.catalogAdmin.designHelpText.helpTextDescription.logo}>
                  {localization.catalogAdmin.designHelpText.logo}
                </HelpText>
              </div>
              <ImageUploader />
            </div>
            <div className={styles.label}>
              <h3>{localization.catalogAdmin.descriptionLogo}</h3>
              <HelpText title={localization.catalogAdmin.designHelpText.helpTextDescription.logoDescription}>
                {localization.catalogAdmin.designHelpText.logoDescription}
              </HelpText>
            </div>
            <div className={styles.textFieldContainer}>
              <TextField
                className={styles.textField}
                isValid={isTextInputValid}
                value={imageLabel}
                onChange={(event) => {
                  setImageLabel(event.target.value);
                  setIsTextInputValid(textRegexWithNumbers.test(event.target.value));
                }}
                required={true}
                disabled={disableTextField}
              />
            </div>
            <div className={styles.line}></div>
            <div className={styles.colorPickers}>
              <div>
                <div className={styles.label}>
                  <h3>{localization.catalogAdmin.backgroundColor}</h3>
                  <HelpText title={localization.catalogAdmin.designHelpText.helpTextDescription.backgroundColor}>
                    {localization.catalogAdmin.designHelpText.backgroundColor}
                  </HelpText>
                </div>
                <ColorPicker type='background' />
              </div>
              <div>
                <div className={styles.label}>
                  <h3>{localization.catalogAdmin.fontColor}</h3>
                  <HelpText title={localization.catalogAdmin.designHelpText.helpTextDescription.fontColor}>
                    {localization.catalogAdmin.designHelpText.fontColor}
                  </HelpText>
                </div>
                <ColorPicker type='font' />
              </div>
            </div>
            <div>
              <Button onClick={() => handleUpdateDbDesign()}>{localization.save}</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPage;
