'use client';

import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Button, Heading, Link, Divider, List } from '@digdir/designsystemet-react';
import { MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons';
import { AppBarOrgSelector } from '../app-bar-org-selector';
import { AppBarCatalogSelectorList } from '../app-bar-catalog-selector';
import styles from './styles.module.scss';

export const AppBarHamburgerMenu = () => {

    const [ open, setOpen ] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Event handlers
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && open) {
                setOpen(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node) && open) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscKey);
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('keydown', handleEscKey);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [open]);



	return (
        <div ref={containerRef} className={cn(styles.container, { [styles.open]: open })}>
            <Button className={styles.toggleBtn} data-size='sm' variant='tertiary' onClick={() => setOpen(!open)}>
                {
                    open ?
                    <XMarkIcon /> :
                    <MenuHamburgerIcon fontSize='1.333333rem' />
                }
            </Button>
            {
                open &&
                <div className={styles.drawer}>
                    <div className={styles.drawerInner}>
                        <div>
                            <Heading data-size='xs' level={3}>Dine virksomheter:</Heading>
                            <AppBarOrgSelector />
                        </div>
                        <Divider />
                        <nav className={styles.catalogList}>
                            <Heading data-size='xs' level={3}>Dine kataloger:</Heading>
                            <AppBarCatalogSelectorList />
                        </nav>
                        <Divider />
                        {/* <div style={{flexGrow:1}} /> */}
                        <nav>
                            <List.Unordered style={{ listStyle: 'none', padding: 0 }}>
                                <List.Item><Link href="#">Help og støtte</Link></List.Item>
                                <List.Item><Link href="#">Kontakt oss</Link></List.Item>
                                <List.Item><Link href="#">Bruksvilkår</Link></List.Item>
                                <List.Item><Link href="#">Personvernerklæring</Link></List.Item>
                                <List.Item><Link href="#">Informasjonskapsler</Link></List.Item>
                                <List.Item><Link href="#">Tilgjengelighetserklæring</Link></List.Item>
                            </List.Unordered>
                        </nav>
                    </div>
                </div>
            }
        </div>
    );
};

