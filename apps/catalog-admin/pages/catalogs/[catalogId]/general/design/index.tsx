import React, { useEffect, useState } from 'react';
import { useAdminState } from '../../../../../context/admin';
import { ColorPicker } from '../../../../../components/color-picker';
import { ImageUploader } from '../../../../../components/image-uploader';
import styles from './design.module.css';
import { Breadcrumbs, Button, PageBanner } from '@catalog-frontend/ui';
import { Heading, HelpText, TextField } from '@digdir/design-system-react';
import { hasOrganizationReadPermission, localization } from '@catalog-frontend/utils';
import { getToken } from 'next-auth/jwt';
import { Design, Organization } from '@catalog-frontend/types';
import { getOrganization } from '@catalog-frontend/data-access';
import { useRouter } from 'next/router';
import { textRegexWithNumbers } from '@catalog-frontend/utils';
import { useGetDesign, useGetLogo, useUpdateDesign } from '../../../../../hooks/design';
import { compare } from 'fast-json-patch';

const DesignPage = ({ organization, FDK_REGISTRATION_BASE_URI }) => {
  const adminContext = useAdminState();
  const router = useRouter();
  const catalogId = `${router.query.catalogId}` || '';
  const pageSubtitle = organization.organization?.name || catalogId;
  const { backgroundColor, fontColor, logo } = adminContext;
  const [isTextInputValid, setIsTextInputValid] = useState(false);
  const [disableTextField, setDisableTextField] = useState(true);

  const { data: getDesign } = useGetDesign(catalogId);
  const dbDesign: Design = getDesign;

  const { data: getLogo } = useGetLogo(catalogId);
  const dbLogo = getLogo;

  function validateLogoDescription(text: string): boolean {
    return logo ? textRegexWithNumbers.test(text) : false;
  }

  //const dbBlob = new Blob([dbLogo], { type: 'image/svg+xml' }); //OBS husk å legge til at type kan være png
  //const dbUrl = URL.createObjectURL(dbBlob);

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
        .then(() => {
          alert('Design updated successfully!');
        })
        .catch(() => {
          alert('Failed to design field.');
        });
    } else {
      console.log('No changes detected.');
    }
  };

  useEffect(() => {
    if (logo) {
      setDisableTextField(false);
      setIsTextInputValid(false);
    } else {
      setDisableTextField(true);
      setIsTextInputValid(true);
    }
  }, [logo]);

  useEffect(() => {
    if (dbDesign?.logoDescription !== undefined) {
      setImageLabel(dbDesign.logoDescription);
    }
  }, [dbDesign]);

  // console.log(dbDesign?.hasLogo);
  // console.log(dbLogo);

  return (
    <>
      <div className={styles.center}>
        <div className={styles.container}>
          <Breadcrumbs baseURI={FDK_REGISTRATION_BASE_URI} />
          <div className={styles.heading}>
            <Heading size='xlarge'>{localization.catalogAdmin.general}</Heading>
          </div>

          <h2 className={styles.subheading}>{localization.catalogAdmin.preview}</h2>
          {!dbDesign?.backgroundColor && !dbDesign?.fontColor && !dbDesign?.hasLogo ? (
            <PageBanner
              title={localization.catalogType.concept}
              subtitle={pageSubtitle}
            />
          ) : (
            <>
              <PageBanner
                title={'Begrepskatalogen (admin)'}
                subtitle={pageSubtitle}
                logoDescription={dbDesign?.hasLogo && dbDesign?.logoDescription}
                backgroundColor={backgroundColor || dbDesign?.backgroundColor || '#FFFFFF'}
                fontColor={fontColor || dbDesign?.fontColor || '#2D3741'}
                logo={logo || (dbDesign?.hasLogo && `/api/design/${catalogId}/logo`) || null} //OBS! hasLogo ikke oppdatert ved sletting
              />
            </>
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
                value={imageLabel}
                onChange={(event) => {
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

export async function getServerSideProps({ req, params }) {
  const token = await getToken({ req });
  const { catalogId } = params;

  const hasPermission = token && hasOrganizationReadPermission(token.access_token, catalogId);
  if (!hasPermission) {
    return {
      notFound: true,
    };
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  return {
    props: {
      organization,
      FDK_REGISTRATION_BASE_URI: process.env.FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default DesignPage;
