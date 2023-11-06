import { test as init, expect } from '@playwright/test';

init.use({ storageState: 'apps/concept-catalog-e2e/playwright/.auth/admin.json' });

init('remove all concepts', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
});

init('create concept gress', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await page.getByRole('button', { name: 'Nytt begrep' }).click();
  await page.locator('input[name="anbefaltTerm\\.navn\\.nb"]').fill('Gress');
  await page
    .locator('textarea[name="definisjon\\.tekst\\.nb"]')
    .fill(
      'Gress er de urteaktige plantene som danner plantedekket (gressteppet) i eng, plen og beite.\n\nI botanikken er gress planter i gressfamilien, og kjennetegnes av smale blad der nervene danner linjer. Blomstene er små, grønne eller brune, og samlet i aks.\n\nI dagligtale er det flere enn artene i gressfamilien som kan bli regnet for gress, for eksempel arter i starrfamilien og sivfamilien. De overjordiske deler av potetplanter, rotvekster og rotgrønnsaker kan iblant også omtales som gress, for eksempel potetgress.',
    );

  await page.getByText('Egendefinert', { exact: true }).click();
  await page.getByText('Basert på kilde', { exact: true }).click();
  await page.getByRole('button', { name: 'Legg til ny kilde' }).click();
  await page.locator('textarea[name="definisjonForAllmennheten\\.tekst\\.nb"]').fill('Dyrefor');
  await page.getByText('Egendefinert', { exact: true }).click();
  await page.locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.tekst"]').click();
  await page
    .locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.tekst"]')
    .fill('Store Norske leksikon');
  await page.locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.uri"]').click();
  await page.locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.uri"]').fill('https://snl.no/gress');
  await page.locator('textarea[name="definisjonForSpesialister\\.tekst\\.nb"]').click();
  await page
    .locator('textarea[name="definisjonForSpesialister\\.tekst\\.nb"]')
    .fill('Ferdigplen er den enkle måten å få en fiks ferdig hage på.');
  await page.locator('#react-select-4-option-1').getByText('Basert på kilde').click();
  await page
    .locator('div')
    .filter({ hasText: /^Legg til ny kilde$/ })
    .getByRole('button')
    .click();
  await page.locator('input[name="definisjonForSpesialister\\.kildebeskrivelse\\.kilde\\[0\\]\\.tekst"]').click();
  await page
    .locator('input[name="definisjonForSpesialister\\.kildebeskrivelse\\.kilde\\[0\\]\\.tekst"]')
    .fill('Follow ferdigplen');
  await page.locator('input[name="definisjonForSpesialister\\.kildebeskrivelse\\.kilde\\[0\\]\\.uri"]').click();
  await page
    .locator('input[name="definisjonForSpesialister\\.kildebeskrivelse\\.kilde\\[0\\]\\.uri"]')
    .fill('https://folloferdigplen.no/');
  await page.locator('textarea[name="merknad\\.nb"]').click();
  await page.locator('textarea[name="merknad\\.nb"]').fill('Grønn');
  await page.getByRole('button', { name: 'Tillatt og frarådet term' }).click();
  await page
    .locator('form div')
    .filter({ hasText: 'Tillatt og frarådet termTillatt termTerm som blir sett på som egnet for begrepet' })
    .getByRole('textbox')
    .first()
    .click();
  await page
    .locator('form div')
    .filter({ hasText: 'Tillatt og frarådet termTillatt termTerm som blir sett på som egnet for begrepet' })
    .getByRole('textbox')
    .first()
    .fill('Timotei');
  await page
    .locator('form div')
    .filter({ hasText: 'Tillatt og frarådet termTillatt termTerm som blir sett på som egnet for begrepet' })
    .getByRole('textbox')
    .nth(1)
    .click();
  await page
    .locator('form div')
    .filter({ hasText: 'Tillatt og frarådet termTillatt termTerm som blir sett på som egnet for begrepet' })
    .getByRole('textbox')
    .nth(1)
    .fill('ugress');
  await page.locator('label').filter({ hasText: 'Timotei' }).locator('a').click();
  await page
    .locator('form div')
    .filter({ hasText: 'Tillatt og frarådet termTillatt termTerm som blir sett på som egnet for begrepet' })
    .getByRole('textbox')
    .first()
    .click();
  await page
    .locator('form div')
    .filter({ hasText: 'Tillatt og frarådet termTillatt termTerm som blir sett på som egnet for begrepet' })
    .getByRole('textbox')
    .first()
    .fill('timotei');
  await page
    .locator('div')
    .filter({ hasText: /^Frarådet term$/ })
    .click();
  await page.getByRole('button', { name: 'Bruk av begrepet' }).click();
  await page.locator('input[name="omfang\\.uri"]').fill('https://www.youtube.com/watch?v=cGgs86SHw-s');
  await page.locator('input[name="omfang\\.tekst"]').click();
  await page.locator('input[name="omfang\\.tekst"]').fill('Uttalelse av gress');
  await page.getByText('GyldighetGyldig f.o.m.Her registrerer du datoen som begrepet skal gjelde fra og ').click();
  await page
    .locator('form div')
    .filter({ hasText: 'Bruk av begrepetBegrepsstatusStatus for begrepet. Undersøk hvilke statuser som s' })
    .getByRole('textbox')
    .nth(1)
    .click();
  await page.locator('textarea[name="eksempel\\.nb"]').click();
  await page
    .locator('form div')
    .filter({ hasText: 'Bruk av begrepetBegrepsstatusStatus for begrepet. Undersøk hvilke statuser som s' })
    .getByRole('textbox')
    .nth(1)
    .click();
  await page
    .locator('form div')
    .filter({ hasText: 'Bruk av begrepetBegrepsstatusStatus for begrepet. Undersøk hvilke statuser som s' })
    .getByRole('textbox')
    .nth(1)
    .fill('Biologisk mangfold');
  await page
    .locator('form div')
    .filter({ hasText: 'GyldighetGyldig f.o.m.Her registrerer du datoen som begrepet skal gjelde fra og ' })
    .locator('i')
    .nth(1)
    .click();
  await page.getByLabel('Choose Monday, November 6th, 2023').click();
  await page
    .locator('form div')
    .filter({ hasText: 'Gyldig f.o.m.Her registrerer du datoen som begrepet skal gjelde fra og med.Flere' })
    .nth(2)
    .click();
  await page
    .locator('form div')
    .filter({ hasText: 'GyldighetGyldig f.o.m.Her registrerer du datoen som begrepet skal gjelde fra og ' })
    .locator('i')
    .nth(3)
    .click();
  await page.getByText('November 2023').click();
  await page
    .locator('div')
    .filter({ hasText: /^2023$/ })
    .first()
    .click();
  await page
    .getByLabel(
      'Next MonthNovember 202320282027202620252024✓20232023SuMoTuWeThFrSa29303112345678910111213141516171819202122232425262728293012',
    )
    .fill('31.12.3000');
  await page.getByRole('button', { name: 'Kontaktinformasjon' }).click();
  await page.locator('input[name="kontaktpunkt\\.harEpost"]').fill('gress@fellesdatakatalog.digdir.no');
  await page.locator('input[name="kontaktpunkt\\.harTelefon"]').fill('123456789');
  await page.locator('input[name="abbreviatedLabel"]').fill('GRS');
  await page
    .locator('form div')
    .filter({ hasText: 'Interne opplysningerOpplysningene under er til intern bruk og vil ikke publisere' })
    .getByRole('textbox')
    .nth(4)
    .fill('flora');
  await page.getByRole('button', { name: 'Lagre' }).click();
});
