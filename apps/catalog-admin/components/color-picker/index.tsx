import styles from './color-picker.module.css';
import { TextField } from '@digdir/design-system-react';
import { AdminContextProvider, useAdminDispatch } from '../../context/admin';
import { useEffect, useState } from 'react';

interface ColorPicker {
  defaultColor?: string;
  type: 'background' | 'font';
}

export const ColorPicker = ({ defaultColor, type }: ColorPicker) => {
  const [inputColor, setInputColor] = useState(defaultColor);
  const regex = new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$');
  const [isValidInput, setIsValidInput] = useState(regex.test(defaultColor));
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
            setIsValidInput(regex.test(event.target.value));
          }}
        />
      </div>
    </AdminContextProvider>
  );
};

export default ColorPicker;
