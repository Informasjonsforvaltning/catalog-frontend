'use client';

import React from 'react';
import {
	Dropdown
} from '@digdir/designsystemet-react';
import {
	ChevronDownIcon,
	CheckmarkIcon,
} from '@navikt/aksel-icons';

export const AppBarDatasetSelector = () => {
	return (
		<Dropdown.TriggerContext>
			<Dropdown.Trigger data-size='sm' variant='secondary'>
				Datasett
				<ChevronDownIcon />
			</Dropdown.Trigger>
			<Dropdown placement="bottom-start">
				<Dropdown.List>
					<Dropdown.Item>
						<Dropdown.Button>
							Datasett
							<CheckmarkIcon />
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button>
							Data tjenester
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button>
							Begrep
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button>
							Informasjonsmodeller
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button>
							Tjenester og hendelser
						</Dropdown.Button>
					</Dropdown.Item>
				</Dropdown.List>
			</Dropdown>
		</Dropdown.TriggerContext>
	);
};

