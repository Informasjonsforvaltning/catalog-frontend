'use client';

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

import { AppBarHamburgerMenu } from '../app-bar-hamburger-menu';
import { AppBarOrgSelector } from '../app-bar-org-selector';
import { AppBarCatalogSelector } from '../app-bar-catalog-selector';
import { AppBarNotificationButton } from '../app-bar-notification-button';
import { AppBarUserMenu } from '../app-bar-user-menu';

type AppBarProps = {}

export const AppBar = ({ children, ...props }: AppBarProps & React.HTMLAttributes<HTMLDivElement>) => {

	const [sticky, setSticky] = useState(false);

	const toggleSticky = () => {
        if (window.scrollY > 0) {
            if (!sticky) setSticky(true);
        } else {
            if (sticky) setSticky(false);
        }
    };

	useEffect(() => {
        toggleSticky();
        window.addEventListener('scroll', toggleSticky);
        return () => {
            window.removeEventListener('scroll', toggleSticky);
        };
    }, [sticky]);

	return (
		<div
			className={styles.appBar}
			{...props}
		>
			<div
				className={cn(styles.inner, {
					[styles.sticky]: sticky
				})}
			>
				<AppBarHamburgerMenu />
				<AppBarOrgSelector />
				<AppBarCatalogSelector />
				{children}
				<div style={{'flexGrow': 1}} />
				<AppBarNotificationButton />
				<AppBarUserMenu />
			</div>
		</div>
	);
}
