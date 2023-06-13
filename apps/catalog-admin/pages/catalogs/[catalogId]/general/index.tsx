import { useAdminState } from '../../../../context/admin';
import { ColorPicker } from '../../../../components/color-picker';
import { ImageUploader } from '../../../../components/image-uploader';
import { Banner } from '../../../../components/banner';
import styles from './general.module.css';

export const GeneralPage = () => {
  const adminContext = useAdminState();
  const backgroundColor = adminContext.backgroundColor;
  const fontColor = adminContext.fontColor;
  const logo = adminContext.logo;

  return (
    <>
      <Banner
        backgroundColor={backgroundColor}
        fontColor={fontColor}
        logo={logo}
      />

      <ImageUploader />
      <ColorPicker
        type='background'
        defaultColor={'#FFFFFF'}
      />
      <ColorPicker
        type='font'
        defaultColor={'#2D3741'}
      />
    </>
  );
};

export default GeneralPage;
