'use client';

import { Textfield } from '@digdir/design-system-react';
import { useEffect, useState } from 'react';
import { colorRegex, localization } from '@catalog-frontend/utils';
import { Design } from '@catalog-frontend/types';
import { useGetDesign } from '../../hooks/design';
import { AdminContextProvider, useAdminDispatch, useAdminState } from '../../context/admin';
import styles from './color-picker.module.css';

interface ColorPicker {
  type: 'background' | 'font';
}

export const ColorPicker = (catalogId, { type }: ColorPicker) => {
  const { data: getDesign } = useGetDesign(catalogId);
  const dbDesign: Design = getDesign;

  const [inputColor, setInputColor] = useState('');
  const [isValidInput, setIsValidInput] = useState(true);

  const adminDispatch = useAdminDispatch();

  const adminContext = useAdminState();
  const { backgroundColor, fontColor } = adminContext;

  useEffect(() => {
    if (type === 'background') {
      setInputColor(backgroundColor);
    } else {
      setInputColor(fontColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (type === 'background') {
      adminDispatch({ type: 'SET_BACKGROUND_COLOR', payload: { backgroundColor: inputColor } });
    } else if (type === 'font') {
      adminDispatch({ type: 'SET_FONT_COLOR', payload: { fontColor: inputColor } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputColor]);

  useEffect(() => {
    if (dbDesign?.fontColor !== null && dbDesign?.fontColor !== undefined && type === 'background') {
      setInputColor(dbDesign?.backgroundColor);
      setIsValidInput(colorRegex.test(dbDesign?.backgroundColor));
    }

    if (dbDesign?.fontColor !== null && dbDesign?.fontColor !== undefined && type === 'font') {
      setInputColor(dbDesign?.fontColor);
      setIsValidInput(colorRegex.test(dbDesign?.fontColor));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dbDesign]);

  return (
    <AdminContextProvider>
      <div className={styles.container}>
        <div
          className={styles.color}
          style={{ background: inputColor }}
        />
        <Textfield
          className={styles.textField}
          error={!isValidInput && localization.validation.invalidValue}
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
