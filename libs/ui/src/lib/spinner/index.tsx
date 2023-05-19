import React from 'react';

import classes from './spinner.module.css';

const Spinner: React.FC = () => (
  <div className={classes.spinner}>
    <div className={classes.animation} />
  </div>
);

export default Spinner;
