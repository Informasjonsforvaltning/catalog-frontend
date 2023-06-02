import { useAdminState } from '../../../../context/admin';
import { ColorPicker } from '../../../../components/color-picker';
import { ImageUploader } from '../../../../components/image-uploader';
import styles from './general.module.css';

export const GeneralPage = () => {
  const adminContext = useAdminState();
  const backgroundColor = adminContext.backgroundColor;
  const fontColor = adminContext.fontColor;
  const logo = adminContext.logo;

  return (
    <>
      <div
        className={styles.banner}
        style={{ background: backgroundColor, color: fontColor }}
      >
        Banner!
        {logo && (
          <img
            alt='preview image'
            src={logo}
          />
        )}
      </div>
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
