'use client';

import React from 'react';
import {
	Dropdown
} from '@digdir/designsystemet-react';
import { LeaveIcon, PersonIcon, CogIcon } from '@navikt/aksel-icons';

export const AppBarUserMenu = () => {
	return (
		<Dropdown.TriggerContext>
			<Dropdown.Trigger data-size='sm' variant='secondary'>
				Eirik Lillebo
			</Dropdown.Trigger>
			<Dropdown placement="bottom-end">
				<Dropdown.List>
					<Dropdown.Item>
						<Dropdown.Button data-size='sm'>
                            <PersonIcon />
							Brukerprofil
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button data-size='sm'>
                            <CogIcon />
							Innstillinger
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button data-size='sm'>
                            <LeaveIcon />
							Logg ut
						</Dropdown.Button>
					</Dropdown.Item>
				</Dropdown.List>
			</Dropdown>
		</Dropdown.TriggerContext>
	);
};

