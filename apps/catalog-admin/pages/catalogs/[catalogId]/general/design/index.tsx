import React, { useEffect, useState } from 'react';
import { useAdminState } from '../../../../../context/admin';
import { ColorPicker } from '../../../../../components/color-picker';
import { ImageUploader } from '../../../../../components/image-uploader';
import { Banner } from '../../../../../components/banner';
import styles from './design.module.css';
import { Breadcrumbs, Button, PageBanner } from '@catalog-frontend/ui';
import { Heading, HelpText, TextField } from '@digdir/design-system-react';
import { hasOrganizationReadPermission, localization } from '@catalog-frontend/utils';
import { getToken } from 'next-auth/jwt';
import { Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { useRouter } from 'next/router';

const DesignPage = (organization) => {
  const adminContext = useAdminState();
  const router = useRouter();
  const catalogId: string = `${router.query.catalogId}` ?? '';
  const pageSubtitle = organization.organization?.name ?? catalogId;
  const { backgroundColor, fontColor, logo } = adminContext;
  const [imageLabel, setImageLabel] = useState('');
  const [isTextInputValid, setIsTextInputValid] = useState(false);
  const [disableTextField, setDisableTextField] = useState(true);

  function validateLogoDescription(text: string): boolean {
    const alphanumericRegex = /^[a-zA-ZæøåÆØÅ0-9\s\-_&,.]+$/;
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
              title={localization.catalogType.concept}
              subtitle={pageSubtitle}
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
                onChange={(event) => {
                  setImageLabel(event.target.value);
                  setIsTextInputValid(validateLogoDescription(event.target.value));
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

                <ColorPicker
                  type='background'
                  defaultColor={'#FFFFFF'}
                />
              </div>
              <div>
                <div className={styles.label}>
                  <h3>{localization.catalogAdmin.fontColor}</h3>
                  <HelpText title={localization.catalogAdmin.designHelpText.helpTextDescription.fontColor}>
                    {localization.catalogAdmin.designHelpText.fontColor}
                  </HelpText>
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

export async function getServerSideProps({ req, params }) {
  const token = await getToken({ req });
  const { catalogId } = params;

  const hasPermission = token && hasOrganizationReadPermission(token.access_token, catalogId);
  if (!hasPermission) {
    return {
      notFound: true,
    };
  }

  const organization: Organization = await getOrganization(catalogId);
  return {
    props: {
      organization,
    },
  };
}

export default DesignPage;
