import cn from 'classnames';
import EllipseSVG from './svg/ellipse-1.svg';
import RectangleSVG from './svg/rectangle-1.svg';
import style from './page-banner.module.css';

interface PageBannerProps {
  title: string;
  subtitle: string;
  logo?: string;
  logoDescription?: string;
  fontColor?: string;
  backgroundColor?: string;
}

const PageBanner = ({ title, subtitle, fontColor, backgroundColor, logo, logoDescription }: PageBannerProps) => {
  return (
    <div
      className={style.banner}
      style={{
        ...(fontColor ? { color: fontColor } : {}),
        ...(backgroundColor ? { background: backgroundColor } : {}),
      }}
    >
      {!logo && (
        <div className={style.svgEllipse}>
          <EllipseSVG />
        </div>
      )}

      <div className={cn('container', style.contentContainer)}>
        {logo && (
          <div className={style.contentContainer}>
            <img
              src={logo}
              alt={logoDescription}
              title={logoDescription}
              className={style.logoContainer}
            />
          </div>
        )}
        <div className={style.titleContainer}>
          <h1 className={style.pageTitle}>{title}</h1>
          <span className={style.pageSubtitle}>{subtitle}</span>
        </div>
      </div>

      {!logo && (
        <div className={style.svgRectangle}>
          <RectangleSVG />
        </div>
      )}
    </div>
  );
};

export { PageBanner };
