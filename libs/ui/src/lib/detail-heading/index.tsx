import { HTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import style from './detail-heading.module.css';

interface DetailHeadingProps extends HTMLAttributes<HTMLDivElement> {
  headingTitle?: ReactNode;
  subtitle?: ReactNode;
}

export const DetailHeading = ({ headingTitle, subtitle, className, ...rest }: DetailHeadingProps) => {
  return (
    <div className={cn(style.detailHeading, className)}>
      <div className={cn(style.title)}>{headingTitle}</div>
      <div className={cn(style.subtitle)}>{subtitle}</div>
    </div>
  );
};

export default DetailHeading;
