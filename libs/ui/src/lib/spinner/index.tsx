import { FC } from 'react';
import { Spinner as SpinnerBase } from '@digdir/design-system-react';
import { localization } from '@catalog-frontend/utils';
import classes from './spinner.module.css';

export interface SpinnerProps {
  size?: 'xSmall' | 'small' | 'medium' | 'large' | '1xLarge' | '2xLarge' | '3xLarge'
}

export const Spinner: FC<SpinnerProps> = ({size = '3xLarge'}) => {
  return (
    <div className={classes.spinner}>
      <SpinnerBase
        title={localization.loading}
        size={size}
      />
    </div>
  );
};

export default Spinner;
