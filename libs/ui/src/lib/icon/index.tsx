/**
 * Check all available icon name and className here: https://github.com/fellesdatakatalog/fdk-kit/tree/develop/packages/icons/src/assets/svg
 */

import {SvgIconTypes} from '@fellesdatakatalog/icons';
import React, {FC} from 'react';
import {Icon as StyledIcon, Text} from './styled';

type IconType = 'icon' | 'textIcon';

interface IconProps {
  name?: SvgIconTypes;
  type?: IconType;
  text?: string;
  className?: string;
}

export const Icon: FC<IconProps> = ({
  className,
  name,
  type = 'icon',
  text = 'nb',
}) => {
  return type === 'textIcon' ? (
    <StyledIcon
      className={className}
      name={name as SvgIconTypes}
    >
      <Text
        x="10%"
        y="50%"
      >
        {text}
      </Text>
    </StyledIcon>
  ) : (
    <StyledIcon
      className={className}
      name={name as SvgIconTypes}
    />
  );
};

export default Icon;
