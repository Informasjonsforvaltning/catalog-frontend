/**
 * Check all available icon name and className here: https://github.com/fellesdatakatalog/fdk-kit/tree/develop/packages/icons/src/assets/svg
 */

import SvgIcon, { SvgIconTypes } from '@fellesdatakatalog/icons';
import { FC } from 'react';
import styles from './icon.module.css';
import cn from 'classnames';

type IconType = 'icon' | 'textIcon';

interface IconProps {
  name?: SvgIconTypes;
  type?: IconType;
  text?: string;
  className?: string;
}

export const Icon: FC<IconProps> = ({ className, name, type = 'icon', text = 'nb' }) => {
  return type === 'textIcon' ? (
    <SvgIcon
      className={cn(className, styles.icon)}
      name={name as SvgIconTypes}
    >
      <text
        className={styles.text}
        x='10%'
        y='50%'
      >
        {text}
      </text>
    </SvgIcon>
  ) : (
    <SvgIcon
      className={cn(className, styles.icon)}
      name={name as SvgIconTypes}
    />
  );
};

export default Icon;
