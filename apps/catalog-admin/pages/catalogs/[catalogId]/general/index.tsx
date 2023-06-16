import React, { useEffect, useState } from 'react';
import { useAdminState } from '../../../../context/admin';
import { ColorPicker } from '../../../../components/color-picker';
import { ImageUploader } from '../../../../components/image-uploader';
import { Banner } from '../../../../components/banner';
import styles from './general.module.css';
import { Breadcrumbs, Button, PageBanner } from '@catalog-frontend/ui';
import { Heading, HelpText, TextField } from '@digdir/design-system-react';
import { localization } from '@catalog-frontend/utils';

const GeneralPage = () => {
  const adminContext = useAdminState();
  const { backgroundColor, fontColor, logo } = adminContext;
  const [imageLabel, setImageLabel] = useState('');
  const [isTextInputValid, setIsTextInputValid] = useState(false);
  const [disableTextField, setDisableTextField] = useState(true);

  function validateInputContent(text: string): boolean {
    const alphanumericRegex = /^(?=.*[A-Za-z0-9])[A-Za-z0-9 ]+$/;
    return logo ? alphanumericRegex.test(text) : false;
  }

  useEffect(() => {
    if (logo) {
      setDisableTextField(false);
      setIsTextInputValid(false);
    } else {
      setDisableTextField(true);
      setIsTextInputValid(true);
    }
  }, [logo]);

  return (
    <>
      <div className={styles.center}>
        <div className={styles.container}>
          <Breadcrumbs />
          <div className={styles.heading}>
            <Heading size='xlarge'>{localization.catalogAdmin.general}</Heading>
          </div>

          <h2 className={styles.subheading}>{localization.catalogAdmin.preview}</h2>
          {backgroundColor === '#FFFFFF' && fontColor === '#2D3741' && !logo ? (
            <PageBanner
              title={'Intern begrepskaralog'}
              subtitle={'Skatteetaten'}
            />
          ) : (
            <Banner
              backgroundColor={backgroundColor}
              fontColor={fontColor}
              logo={logo}
            />
          )}

          <h2 className={styles.subheading}>{localization.catalogAdmin.customizeDesign}</h2>

          <div className={styles.backgroundContainer}>
            <div className={styles.imageUploader}>
              <div className={styles.label}>
                <h3>{localization.catalogAdmin.logo}</h3>
                <HelpText title={'Tekstene skal byttes ut men vet ikke hva som skal stå enda:-)'}>
                  {'SVG eller PNG format'}
                </HelpText>
              </div>
              <ImageUploader />
            </div>
            <div className={styles.label}>
              <h3>{localization.catalogAdmin.descriptionLogo}</h3>
              <HelpText title={'Beskrivelse av logo hjelpetekst'}>{'Ønsker til hjelpetekst?'}</HelpText>
            </div>
            <div className={styles.textFieldContainer}>
              <TextField
                className={styles.textField}
                isValid={isTextInputValid}
                onChange={(event) => {
                  setImageLabel(event.target.value);
                  setIsTextInputValid(validateInputContent(event.target.value));
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
                  <HelpText title={'Bakgrunnsfarge hjelpetekst'}>{'Ønsker til hjelpetekst?'}</HelpText>
                </div>

                <ColorPicker
                  type='background'
                  defaultColor={'#FFFFFF'}
                />
              </div>
              <div>
                <div className={styles.label}>
                  <h3>{localization.catalogAdmin.fontColor}</h3>
                  <HelpText title={'Skriftfarge hjelpetekst'}>{'Ønsker til hjelpetekst?'}</HelpText>
                </div>

                <ColorPicker
                  type='font'
                  defaultColor={'#2D3741'}
                />
              </div>
            </div>
            <div>
              <Button>{localization.save}</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneralPage;
