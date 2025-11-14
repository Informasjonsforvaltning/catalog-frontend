'use client';

import React from 'react';
import { Button } from '@digdir/designsystemet-react';
import { MenuHamburgerIcon } from '@navikt/aksel-icons';

export const AppBarHamburgerMenu = () => {
	return (
		<Button data-size='sm' variant='tertiary'>
			<MenuHamburgerIcon fontSize='1.333333rem' />
		</Button>
	);
};

