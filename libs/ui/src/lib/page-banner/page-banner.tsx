import style from './page-banner.module.css';
import EllipseSVG from './svg/ellipse-1.svg';
import RectangleSVG from './svg/rectangle-1.svg';

interface PageBannerProps {
  title: string;
  subtitle: string;
}

const PageBanner = ({title, subtitle}: PageBannerProps) => {
  return (
    <div className={style.banner}>
      <div className={style.svgEllipse}>
        <EllipseSVG />
      </div>
      <div className={style.titleContainer}>
        <h1 className={style.pageTitle}>{title}</h1>
        <h2 className={style.pageSubtitle}>{subtitle}</h2>
      </div>
      <div className={style.svgRectangle}>
        <RectangleSVG />
      </div>
    </div>
  );
};

export {PageBanner};
