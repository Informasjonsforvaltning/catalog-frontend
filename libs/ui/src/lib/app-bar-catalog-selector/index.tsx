'use client';

import React from 'react';
import cn from 'classnames';
import {
	Dropdown,
    Badge,
    Paragraph
} from '@digdir/designsystemet-react';
import {
	ChevronDownIcon,
	CheckmarkIcon,
} from '@navikt/aksel-icons';
import styles from './styles.module.scss';

export const AppBarCatalogSelectorList = () => {
    return (
        <div className={styles.catalogList}>
            <Dropdown.List>
                <Dropdown.Item>
                    <Dropdown.Button data-size='sm' className={cn(styles.catalogButton, styles.current)}>
                        Datasett
                        <Badge data-size='sm' count={12} data-color='neutral' variant='tinted' />
                    </Dropdown.Button>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Dropdown.Button data-size='sm' className={styles.catalogButton}>
                        <span>Datatjenester</span>
                        <Badge data-size='sm' count={3} data-color='neutral' variant='tinted' />
                    </Dropdown.Button>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Dropdown.Button data-size='sm' className={styles.catalogButton}>
                        <span>Begrep</span>
                        <Badge data-size='sm' count={0} data-color='neutral' variant='tinted' />
                    </Dropdown.Button>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Dropdown.Button data-size='sm' className={styles.catalogButton}>
                        <span>Informasjonsmodeller</span>
                        <Badge data-size='sm' count={0} data-color='neutral' variant='tinted' />
                    </Dropdown.Button>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Dropdown.Button data-size='sm' className={styles.catalogButton}>
                        <span>Tjenester og hendelser</span>
                        <Badge data-size='sm' count={1} data-color='neutral' variant='tinted' />
                    </Dropdown.Button>
                </Dropdown.Item>
            </Dropdown.List>
        </div>
    );
}

export const AppBarCatalogSelector = () => {
	return (
		<Dropdown.TriggerContext>
			<Dropdown.Trigger data-size='sm' variant='secondary'>
				Datasett
				<ChevronDownIcon />
			</Dropdown.Trigger>
			<Dropdown placement="bottom-start">
				<AppBarCatalogSelectorList />
			</Dropdown>
		</Dropdown.TriggerContext>
	);
};