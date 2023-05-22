import { FC } from 'react';
import { Spinner as SpinnerBase } from '@digdir/design-system-react';
import { localization } from '@catalog-frontend/utils';
import classes from './spinner.module.css';

export const Spinner: FC = () => {
  return (
    <div className={classes.spinner}>
      <SpinnerBase
        title={localization.loading}
        size='3xLarge'
      />
    </div>
  );
};

export default Spinner;
