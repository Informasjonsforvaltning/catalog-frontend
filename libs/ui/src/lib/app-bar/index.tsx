'use client';

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import styles from './styles.module.scss';

import {
	Button,
	Avatar,
	Dropdown
} from '@digdir/designsystemet-react';
import { OrgLogo } from '@fellesdatakatalog/ui';

import {
	MenuHamburgerIcon,
	BellIcon,
	ChevronDownIcon,
	CheckmarkIcon,
	// FilesIcon,
	// CodeIcon,
	// ChatElipsisIcon,
	// TenancyIcon,
	// CompassIcon
} from '@navikt/aksel-icons';

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
				<Button data-size='sm' variant='tertiary'>
					<MenuHamburgerIcon fontSize='1.333333rem' />
				</Button>
				{/* <CopyButton copyLabel='copy' copiedLabel='copied' copyOnClick='hello' /> */}
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
				{/* <Button data-size='sm' variant='secondary'>
					<OrgLogo orgLogoSrc='https://orglogo.digdir.no/api/emblem/svg/974761076' style={{fontSize:'1.5rem'}} />
					Skatteetaten
				</Button> */}
				{children}
				<Dropdown.TriggerContext>
					<Dropdown.Trigger data-size='sm' variant='secondary'>
						{/* <FilesIcon /> */}
						Datasett
						<ChevronDownIcon />
					</Dropdown.Trigger>
					<Dropdown placement="bottom-start">
						<Dropdown.List>
							<Dropdown.Item>
								<Dropdown.Button>
									{/* <FilesIcon /> */}
									Datasett
									<CheckmarkIcon />
								</Dropdown.Button>
							</Dropdown.Item>
							<Dropdown.Item>
								<Dropdown.Button>
									{/* <CodeIcon /> */}
									Data tjenester
								</Dropdown.Button>
							</Dropdown.Item>
							<Dropdown.Item>
								<Dropdown.Button>
									{/* <ChatElipsisIcon /> */}
									Begrep
								</Dropdown.Button>
							</Dropdown.Item>
							<Dropdown.Item>
								<Dropdown.Button>
									{/* <TenancyIcon /> */}
									Informasjonsmodeller
								</Dropdown.Button>
							</Dropdown.Item>
							<Dropdown.Item>
								<Dropdown.Button>
									{/* <CompassIcon /> */}
									Tjenester og hendelser
								</Dropdown.Button>
							</Dropdown.Item>
						</Dropdown.List>
					</Dropdown>
				</Dropdown.TriggerContext>
				<div style={{'flexGrow': 1}} />
				<Button data-size='sm' variant='tertiary'>
					<BellIcon />
				</Button>
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
			</div>
		</div>
	);
}
