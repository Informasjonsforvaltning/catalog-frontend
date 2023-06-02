import styles from './banner.module.css';
import { TextField } from '@digdir/design-system-react';
import { AdminContextProvider, useAdminDispatch, useAdminState } from 'apps/catalog-admin/context/admin';
import { useEffect, useState } from 'react';

interface BannerProps {
  backgroundColor?: string;
  fontColor?: string;
  logo?: string;
}

export const Banner = ({ backgroundColor, fontColor, logo }: BannerProps) => {
  return (
    <div
      className={styles.container}
      style={{ background: backgroundColor }}
    >
      {logo && (
        <img
          alt='preview image'
          src={logo}
          className={styles.logo}
          style={{ color: fontColor }}
        />
      )}
      <div className={styles.heading}>
        <h1
          className={styles.title}
          style={{ color: fontColor }}
        >
          Intern begrepskatalog
        </h1>
        <p
          className={styles.company}
          style={{ color: fontColor }}
        >
          Skatteetaten
        </p>
      </div>
    </div>
  );
};

export default Banner;
