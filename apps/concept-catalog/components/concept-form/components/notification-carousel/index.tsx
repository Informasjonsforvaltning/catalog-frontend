'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import styles from './notification-carousel.module.scss';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

export type NotificationCarouselProps = {
  controlsPosition?: 'left' | 'right';
  notifications: ReactNode[];
  interval?: number;
};

export const NotificationCarousel = ({ controlsPosition = 'right', notifications, interval = 10000 }: NotificationCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextNotification = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % notifications.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevNotification = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? notifications.length - 1 : prevIndex - 1));
      setIsAnimating(false);
    }, 300);
  };

  const Controls = () => (
    <div className={styles.carouselControls}>
      <button
        className={styles.carouselButton}
        onClick={prevNotification}
      >
        <ChevronUpIcon fontSize='1.5rem' />
      </button>
      <button
        className={styles.carouselButton}
        onClick={nextNotification}
      >
        <ChevronDownIcon fontSize='1.5rem' />
      </button>
    </div>
  );

  useEffect(() => {
    if(notifications.length > 1) {
      const timer = setInterval(nextNotification, interval);
      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [interval, notifications.length]);

  return (
    <div className={styles.carouselContainer}>
      {notifications.length > 1 && controlsPosition === 'left' && (
        <Controls />
      )}
      <div
        className={styles.carouselNotification}
        style={{
          transform: isAnimating ? 'translateY(100%)' : 'translateY(0)',
          opacity: isAnimating ? 0 : 1,
        }}
      >
        {notifications[currentIndex]}
      </div>
      {notifications.length > 1 && controlsPosition === 'right' && (
        <Controls />
      )}
    </div>
  );
};

export default NotificationCarousel;
