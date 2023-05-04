import cn from './page-banner.module.css';
import EllipseSVG from './svg/ellipse-1.svg';
import RectangleSVG from './svg/rectangle-1.svg';

interface PageBannerProps {
  title: string;
  subtitle: string;
}

const PageBanner = ({title, subtitle}: PageBannerProps) => {
  return (
    <div className={cn['banner']}>
      <div className={cn['svg-ellipse']}>
        <EllipseSVG />
      </div>
      <div className={cn['title-container']}>
        <h1 className={cn['page-title']}>{title}</h1>
        <h2 className={cn['page-subtitle']}>{subtitle}</h2>
      </div>
      <div className={cn['svg-rectangle']}>
        <RectangleSVG />
      </div>
    </div>
  );
};

export {PageBanner};
