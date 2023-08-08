import styles from './color-picker.module.css';
import { TextField } from '@digdir/design-system-react';
import { AdminContextProvider, useAdminDispatch } from '../../context/admin';
import { useEffect, useState } from 'react';
import { colorRegex } from '@catalog-frontend/utils';

interface ColorPicker {
  defaultColor?: string;
  type: 'background' | 'font';
}

export const ColorPicker = ({ defaultColor, type }: ColorPicker) => {
  const [inputColor, setInputColor] = useState(defaultColor);
  const [isValidInput, setIsValidInput] = useState(colorRegex.test(defaultColor));
  const adminDispatch = useAdminDispatch();

  useEffect(() => {
    if (type === 'background') {
      adminDispatch({ type: 'SET_BACKGROUND_COLOR', payload: { backgroundColor: inputColor } });
    } else if (type === 'font') {
      adminDispatch({ type: 'SET_FONT_COLOR', payload: { fontColor: inputColor } });
    }
  }, [inputColor]);

  return (
    <AdminContextProvider>
      <div className={styles.container}>
        <div
          className={styles.color}
          style={{ background: inputColor }}
        ></div>
        <TextField
          className={styles.textField}
          defaultValue={defaultColor}
          isValid={isValidInput}
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
