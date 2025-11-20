import { HTMLAttributes, ReactNode } from "react";
import cn from "classnames";
import style from "./detail-heading.module.css";

interface DetailHeadingProps extends HTMLAttributes<HTMLDivElement> {
  headingTitle?: ReactNode;
  subtitle?: ReactNode;
}

export const DetailHeading = ({
  headingTitle,
  subtitle,
  className,
}: DetailHeadingProps) => {
  return (
    <div className={cn(style.detailHeading, className)}>
      <div className={style.title}>{headingTitle}</div>
      <div className={style.subtitle}>{subtitle}</div>
    </div>
  );
};

export default DetailHeading;
