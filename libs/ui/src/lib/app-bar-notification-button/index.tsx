'use client';

import React from 'react';
import {
    Dropdown,
	Button,
	Badge,
    Alert
} from '@digdir/designsystemet-react';
import { BellFillIcon, BellIcon } from '@navikt/aksel-icons';

const notifications = [
    {
        type: 'views'
    }
];

export const AppBarNotificationButton = () => {
	return (
        <Dropdown.TriggerContext>
			<Dropdown.Trigger data-size='sm' variant='tertiary'>
                <Badge.Position placement='top-right'>
                    {/* <Badge count={3} data-color='success' /> */}
                    <BellIcon />
                </Badge.Position>
			</Dropdown.Trigger>
			<Dropdown placement="bottom">
                <Alert data-color='success' data-size='sm'>
                    Du har ingen notifikasjoner
                </Alert>
				{/* <Dropdown.List>
					<Dropdown.Item>
						<Dropdown.Button data-size='sm'>
							Brukerprofil
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button data-size='sm'>
							Innstillinger
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button data-size='sm'>
							Logg ut
						</Dropdown.Button>
					</Dropdown.Item>
				</Dropdown.List> */}
			</Dropdown>
		</Dropdown.TriggerContext>
	);
};

