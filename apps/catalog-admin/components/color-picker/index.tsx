import styles from './color-picker.module.css';
import { TextField } from '@digdir/design-system-react';
import { useState } from 'react';

interface ColorPicker {
  defaultColor?: string;
}

export const ColorPicker = ({ defaultColor }: ColorPicker) => {
  const [inputColor, setInputColor] = useState(defaultColor);
  const regex = new RegExp('^#(?:[0-9a-fA-F]{3}){1,2}$');
  const [isValidInput, setIsValidInput] = useState(regex.test(defaultColor));

  return (
    <div className={styles.container}>
      <div
        className={styles.color}
        style={{ background: inputColor }}
      ></div>
      <TextField
        className={styles.textField}
        defaultValue={defaultColor ? defaultColor : '#FFFFFF'}
        isValid={isValidInput}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInputColor(event.target.value);
          setIsValidInput(regex.test(event.target.value));
        }}
      />
    </div>
  );
};

export default ColorPicker;
