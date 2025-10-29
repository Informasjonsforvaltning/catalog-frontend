import cn from 'classnames';
import { forwardRef, ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from 'react';
import classes from './info-card.module.css';
import InfoCardItem, { InfoCardItemType } from './info-card-item';

interface InfoCardComponent extends ForwardRefExoticComponent<InfoCardProps & RefAttributes<HTMLDivElement>> {
  Item: InfoCardItemType;
}

type InfoCardSize = 'large' | 'small';

export interface InfoCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Instances of InfoCard.Item
   */
  children: ReactNode;
  /**
   * Size
   */
  size?: InfoCardSize;
}

export const InfoCard = forwardRef<HTMLDivElement, InfoCardProps>(({ size = 'large', className, ...rest }, ref) => (
  <div
    {...rest}
    className={cn(classes.infoCard, classes[size], className)}
    ref={ref}
  />
)) as InfoCardComponent;

InfoCard.Item = InfoCardItem;
InfoCard.displayName = 'InfoCard';
