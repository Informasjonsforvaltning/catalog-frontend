import { TextField } from '@digdir/design-system-react';
import { useEffect, useState } from 'react';
import { colorRegex } from '@catalog-frontend/utils';
import { Design } from '@catalog-frontend/types';
import { useRouter } from 'next/router';
import { useGetDesign } from '../../hooks/design';
import { AdminContextProvider, useAdminDispatch } from '../../context/admin';
import styles from './color-picker.module.css';

interface ColorPicker {
  type: 'background' | 'font';
}

export const ColorPicker = ({ type }: ColorPicker) => {
  const router = useRouter();
  const catalogId = `${router.query.catalogId}` || '';

  if (!/^\d+$/.test(catalogId)) {
    throw new Error('Invalid catalogId');
  }

  const { data: getDesign } = useGetDesign(catalogId);
  const dbDesign: Design = getDesign;

  const [inputColor, setInputColor] = useState('');
  const [isValidInput, setIsValidInput] = useState(null);

  const adminDispatch = useAdminDispatch();

  useEffect(() => {
    if (type === 'background') {
      adminDispatch({ type: 'SET_BACKGROUND_COLOR', payload: { backgroundColor: inputColor } });
    } else if (type === 'font') {
      adminDispatch({ type: 'SET_FONT_COLOR', payload: { fontColor: inputColor } });
    }
  }, [inputColor]);

  useEffect(() => {
    if (dbDesign?.backgroundColor !== undefined && type === 'background') {
      setInputColor(dbDesign?.backgroundColor);
      setIsValidInput(colorRegex.test(dbDesign?.backgroundColor));
    }

    if (dbDesign?.fontColor !== undefined && type === 'font') {
      setInputColor(dbDesign?.fontColor);
      setIsValidInput(colorRegex.test(dbDesign?.fontColor));
    }
  }, [dbDesign]);

  return (
    <AdminContextProvider>
      <div className={styles.container}>
        <div
          className={styles.color}
          style={{ background: inputColor }}
        ></div>
        <TextField
          className={styles.textField}
          isValid={isValidInput}
          value={inputColor}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInputColor(event.target.value);
            setIsValidInput(colorRegex.test(event.target.value));
          }}
        />
      </div>
    </AdminContextProvider>
  );
};

export default ColorPicker;
