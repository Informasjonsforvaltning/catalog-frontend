import cn from "classnames";
import { forwardRef } from "react";
import classes from "./info-card.module.css";
import InfoCardItem, { InfoCardItemType } from "./info-card-item";

interface InfoCardComponent
  extends React.ForwardRefExoticComponent<
    InfoCardProps & React.RefAttributes<HTMLDivElement>
  > {
  Item: InfoCardItemType;
}

export const infoCardSize = ["large", "small"] as const;
type InfoCardSize = (typeof infoCardSize)[number];

export interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Instances of InfoCard.Item
   */
  children: React.ReactNode;
  /**
   * Size
   */
  size?: InfoCardSize;
}

export const InfoCard = forwardRef<HTMLDivElement, InfoCardProps>(
  ({ size = "large", className, ...rest }, ref) => (
    <div
      {...rest}
      className={cn(classes.infoCard, classes[size], className)}
      ref={ref}
    />
  ),
) as InfoCardComponent;

InfoCard.Item = InfoCardItem;

export default InfoCard;
InfoCard.displayName = "InfoCard";
