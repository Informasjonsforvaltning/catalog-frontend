import React from 'react';
import styles from './styles.module.scss';

import {
	Button,
	Avatar
} from '@digdir/designsystemet-react';

import { MenuHamburgerIcon, HouseFillIcon } from '@navikt/aksel-icons';

type AppBarProps = {}

export const AppBar = ({ children, ...props }: AppBarProps & React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div className={styles.appBar} {...props}>
			<Button size='sm' variant='tertiary'>
				<MenuHamburgerIcon fontSize='1.333333rem' />
			</Button>
			<Button size='sm' variant='secondary'>
				Digitaliseringsdirektoratet
			</Button>
			{children}
			<Button size='sm' variant='tertiary'>
				Begreper
			</Button>
			<div style={{'flexGrow': 1}} />
			<Button size='sm' variant='secondary'>
				Eirik Lillebo
			</Button>
		</div>
	);
}
