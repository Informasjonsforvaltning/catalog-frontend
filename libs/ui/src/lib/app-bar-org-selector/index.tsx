'use client';

import React from 'react';
import {
	Dropdown
} from '@digdir/designsystemet-react';
import { OrgLogo } from '@fellesdatakatalog/ui';
import {
	ChevronDownIcon,
	CheckmarkIcon,
} from '@navikt/aksel-icons';

export const AppBarOrgSelector = () => {
	return (
		<Dropdown.TriggerContext>
			<Dropdown.Trigger data-size='sm' variant='secondary'>
				<OrgLogo orgLogoSrc='https://orglogo.digdir.no/api/emblem/svg/974761076' style={{fontSize:'1.5rem'}} />
				Skatteetaten
				<ChevronDownIcon />
			</Dropdown.Trigger>
			<Dropdown placement="bottom-start">
				<Dropdown.List>
					<Dropdown.Item>
						<Dropdown.Button>
							<OrgLogo orgLogoSrc='https://orglogo.digdir.no/api/emblem/svg/974761076' style={{fontSize:'1.5rem'}} />
							Skatteetaten
							<CheckmarkIcon />
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button>
							<OrgLogo orgLogoSrc='https://orglogo.digdir.no/api/emblem/svg/985399077' style={{fontSize:'1.5rem'}} />
							MAttilsynet
						</Dropdown.Button>
					</Dropdown.Item>
					<Dropdown.Item>
						<Dropdown.Button>
							<OrgLogo orgLogoSrc='https://orglogo.digdir.no/api/emblem/svg/991825827' style={{fontSize:'1.5rem'}} />
							Digitaliseringsdirektoratet
						</Dropdown.Button>
					</Dropdown.Item>
				</Dropdown.List>
			</Dropdown>
		</Dropdown.TriggerContext>
	);
};

