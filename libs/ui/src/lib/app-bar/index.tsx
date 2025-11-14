'use client';

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

import {
	Button,
} from '@digdir/designsystemet-react';
import { BellIcon } from '@navikt/aksel-icons';
import { AppBarHamburgerMenu } from '../app-bar-hamburger-menu';
import { AppBarOrgSelector } from '../app-bar-org-selector';
import { AppBarDatasetSelector } from '../app-bar-catalog-selector';
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
				{children}
				<AppBarDatasetSelector />
				<div style={{'flexGrow': 1}} />
				<Button data-size='sm' variant='tertiary'>
					<BellIcon />
				</Button>
				<AppBarUserMenu />
			</div>
		</div>
	);
}
