'use client';

import React from 'react';
import {
	Dropdown
} from '@digdir/designsystemet-react';

export const AppBarUserMenu = () => {
	return (
		<Dropdown.TriggerContext>
			<Dropdown.Trigger data-size='sm' variant='secondary'>
				Eirik Lillebo
			</Dropdown.Trigger>
			<Dropdown placement="bottom-end">
				<Dropdown.List>
					<Dropdown.Item>
						<Dropdown.Button>
							Brukerprofil
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button>
							Innstillinger
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button>
							Logg ut
						</Dropdown.Button>
					</Dropdown.Item>
				</Dropdown.List>
			</Dropdown>
		</Dropdown.TriggerContext>
	);
};

