import { test as init, expect } from '@playwright/test';

init.use({ storageState: 'apps/concept-catalog-e2e/playwright/.auth/admin.json' });

init('remove all concepts', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    expect(dialog.message()).toEqual('Er du sikker du ønsker å slette begrepet?');
    await dialog.accept();
  });

  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  do {
    await page.waitForURL(`/${process.env.USER_ADMIN_CATALOG_ID}`);
    await page.locator('[class*="search-hit-container_searchHitsContainer"]').waitFor({ state: 'visible' });
    if ((await page.locator('a:near(h2)').count()) > 0) {
      await page.locator('a:near(h2)').first().click();
      await page.getByRole('button', { name: 'Slett' }).click();
      await page.waitForURL(`/${process.env.USER_ADMIN_CATALOG_ID}`);
      await page.locator('[class*="search-hit-container_searchHitsContainer"]').waitFor({ state: 'visible' });
    }
  } while ((await page.locator('a:near(h2)').count()) > 0);
});

init('create concept gress', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await expect(page.getByRole('button', { name: 'Nytt begrep' })).toBeVisible();
  await page.getByRole('button', { name: 'Nytt begrep' }).click();
  await page.locator('input[name="anbefaltTerm\\.navn\\.nb"]').fill('Gress');
  await page
    .locator('textarea[name="definisjon\\.tekst\\.nb"]')
    .fill(
      'Gress er de urteaktige plantene som danner plantedekket (gressteppet) i eng, plen og beite.\n\nI botanikken er gress planter i gressfamilien, og kjennetegnes av smale blad der nervene danner linjer. Blomstene er små, grønne eller brune, og samlet i aks.\n\nI dagligtale er det flere enn artene i gressfamilien som kan bli regnet for gress, for eksempel arter i starrfamilien og sivfamilien. De overjordiske deler av potetplanter, rotvekster og rotgrønnsaker kan iblant også omtales som gress, for eksempel potetgress.',
    );
  await page.locator('input:near(:text("Forhold til kilde"))').nth(0).click();
  await page.locator('#react-select-2-option-1').getByText('Basert på kilde').click();
  await page.getByRole('button', { name: 'Legg til ny kilde' }).click();
  await page.locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.tekst"]').click();
  await page
    .locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.tekst"]')
    .fill('Store Norske leksikon');
  await page.locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.uri"]').click();
  await page.locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.uri"]').fill('https://snl.no/gress');

  await page.locator('textarea[name="definisjonForAllmennheten\\.tekst\\.nb"]').fill('Dyrefor');
  await page.locator('input:near(:text("Forhold til kilde"))').nth(1).click();
  await page.locator('#react-select-3-option-0').getByText('Egendefinert').click();

  await page.locator('textarea[name="definisjonForSpesialister\\.tekst\\.nb"]').click();
  await page
    .locator('textarea[name="definisjonForSpesialister\\.tekst\\.nb"]')
    .fill('Ferdigplen er den enkle måten å få en fiks ferdig hage på.');
  await page.locator('input:near(:text("Forhold til kilde"))').nth(2).click();
  await page.locator('#react-select-4-option-1').getByText('Basert på kilde').click();
  await page.getByRole('button', { name: 'Legg til ny kilde' }).nth(1).click();
  await page
    .locator('input[name="definisjonForSpesialister\\.kildebeskrivelse\\.kilde\\[0\\]\\.tekst"]')
    .fill('Follo ferdigplen');
  await page
    .locator('input[name="definisjonForSpesialister\\.kildebeskrivelse\\.kilde\\[0\\]\\.uri"]')
    .fill('https://folloferdigplen.no/');
  await page.locator('textarea[name="merknad\\.nb"]').fill('Grønn');
  await page.getByRole('button', { name: 'Tillatt og frarådet term' }).click();
  await page
    .locator('form div')
    .filter({ hasText: 'Tillatt og frarådet termTillatt termTerm som blir sett på som egnet for begrepet' })
    .getByRole('textbox')
    .first()
    .fill('timotei');
  await page
    .locator('form div')
    .filter({ hasText: 'Tillatt og frarådet termTillatt termTerm som blir sett på som egnet for begrepet' })
    .getByRole('textbox')
    .nth(1)
    .fill('ugress');
  await page
    .locator('div')
    .filter({ hasText: /^Frarådet term$/ })
    .click();
  await page.getByRole('button', { name: 'Bruk av begrepet' }).click();
  await page.locator('input[name="omfang\\.uri"]').fill('https://www.youtube.com/watch?v=cGgs86SHw-s');
  await page.locator('input[name="omfang\\.tekst"]').fill('Uttalelse av gress');
  await page.getByText('GyldighetGyldig f.o.m.Her registrerer du datoen som begrepet skal gjelde fra og ').click();
  await page
    .locator('form div')
    .filter({ hasText: 'Bruk av begrepetBegrepsstatusStatus for begrepet. Undersøk hvilke statuser som s' })
    .getByRole('textbox')
    .nth(1)
    .click();
  await page.locator('textarea[name="eksempel\\.nb"]').fill('Engelsk raigress (Lolium perenne)');

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

init('create concept fisk with all languages', async ({ page }) => {
  await page.goto(`/${process.env.USER_ADMIN_CATALOG_ID}`);
  await expect(page.getByRole('button', { name: 'Nytt begrep' })).toBeVisible();
  await page.getByRole('button', { name: 'Nytt begrep' }).click();

  await page.locator('label').filter({ hasText: 'Vis norsk nynorsk (nn)' }).locator('div').nth(1).click();
  await page.locator('label').filter({ hasText: 'Vis engelsk (en)' }).locator('div').nth(1).click();

  await page.locator('input[name="anbefaltTerm\\.navn\\.nb"]').fill('Fisk');
  await page.locator('input[name="anbefaltTerm\\.navn\\.nn"]').fill('Fisk');
  await page.locator('input[name="anbefaltTerm\\.navn\\.en"]').fill('Fish');
  await page
    .locator('textarea[name="definisjon\\.tekst\\.nb"]')
    .fill(
      'Fisk er primært vannlevende virveldyr med gjeller, og med finner i stedet for bein. Avkommet kalles yngel. Det fins nærmere 30 000 fiskearter, med noen flere representanter for havlevende arter enn for ferskvannsarter.',
    );
  await page
    .locator('textarea[name="definisjon\\.tekst\\.nn"]')
    .fill(
      'Fisk er primært vannlevende virveldyr med gjeller, og med finnar i staden for bein. Avkommet kallast yngel. Det finst nærare 30 000 fiskearter, med nokre fleire representantar for havlevende artar enn for ferskvannsarter.',
    );
  await page
    .locator('textarea[name="definisjon\\.tekst\\.en"]')
    .fill(
      'Fish are primarily aquatic vertebrates with gills, and with fins instead of bones. The offspring are called fry. There are close to 30,000 species of fish, with some more representatives of sea-dwelling species than of freshwater species.',
    );
  await page.locator('input:near(:text("Forhold til kilde"))').nth(0).click();
  await page.locator('#react-select-2-option-1').getByText('Basert på kilde').click();
  await page.getByRole('button', { name: 'Legg til ny kilde' }).click();
  await page.locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.tekst"]').click();
  await page.locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.tekst"]').fill('Wikipedia');
  await page.locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.uri"]').click();
  await page
    .locator('input[name="definisjon\\.kildebeskrivelse\\.kilde\\[0\\]\\.uri"]')
    .fill('https://no.wikipedia.org/wiki/Fisk');

  await page.locator('textarea[name="definisjonForAllmennheten\\.tekst\\.nb"]').fill('Fisk og chips');
  await page.locator('textarea[name="definisjonForAllmennheten\\.tekst\\.nn"]').fill('Fisk og chips');
  await page.locator('textarea[name="definisjonForAllmennheten\\.tekst\\.en"]').fill('Fish and chips');
  await page.locator('input:near(:text("Forhold til kilde"))').nth(1).click();
  await page.locator('#react-select-3-option-0').getByText('Egendefinert').click();

  await page.locator('textarea[name="definisjonForSpesialister\\.tekst\\.nb"]').click();
  await page
    .locator('textarea[name="definisjonForSpesialister\\.tekst\\.nb"]')
    .fill(
      'Uthaug fisk tar vare på gamle tradisjoner innen foredling av sildeprodukter. Varespekteret selges fra den røde brygge på Uthaug og fra salgsbiler på torg og martna rundt om i Norge. Her får du produkter som spekesildfilet, røkt sild, kryddersildfilet og appetittfilet.',
    );
  await page
    .locator('textarea[name="definisjonForSpesialister\\.tekst\\.nn"]')
    .fill(
      'Uthaug fisk tek vare på gamle tradisjonar innan foredling av sildeprodukter. Varespekteret blir selt frå den raude bryggja på Uthaug og frå salsbilar på torg og martna rundt om i Noreg. Her får du produkt som spekesildfilet, røykt sild, kryddersildfilet og appetittfilet.',
    );
  await page
    .locator('textarea[name="definisjonForSpesialister\\.tekst\\.en"]')
    .fill(
      'Uthaug fish takes care of old traditions in the processing of herring products. The range of goods is sold from the red wharf at Uthaug and from sales vans at squares and martna around Norway. Here you get products such as cured herring fillet, smoked herring, seasoned herring fillet and appetizing fillet.',
    );

  await page.locator('input:near(:text("Forhold til kilde"))').nth(2).click();
  await page.locator('#react-select-4-option-1').getByText('Basert på kilde').click();
  await page.getByRole('button', { name: 'Legg til ny kilde' }).nth(1).click();
  await page
    .locator('input[name="definisjonForSpesialister\\.kildebeskrivelse\\.kilde\\[0\\]\\.tekst"]')
    .fill('Uthaug fisk');
  await page
    .locator('input[name="definisjonForSpesialister\\.kildebeskrivelse\\.kilde\\[0\\]\\.uri"]')
    .fill('https://www.matriketmidt.no/produsenter/oerland/uthaug-fisk/');
  await page.locator('textarea[name="merknad\\.nb"]').fill('havbruk');
  await page.locator('textarea[name="merknad\\.nn"]').fill('havbruk');
  await page.locator('textarea[name="merknad\\.en"]').fill('aquaculture');

  await page.getByRole('button', { name: 'Tillatt og frarådet term' }).click();
  await page
    .locator('div:nth-child(2) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input')
    .first()
    .fill('laks');
  await page
    .locator('div:nth-child(2) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input')
    .first()
    .press('Enter');
  await page
    .locator('div:nth-child(3) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input')
    .first()
    .fill('laks');
  await page
    .locator('div:nth-child(3) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input')
    .first()
    .press('Enter');
  await page
    .locator('div:nth-child(4) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input')
    .first()
    .fill('salmon');
  await page
    .locator('div:nth-child(4) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input')
    .first()
    .press('Enter');
  await page
    .locator(
      'div:nth-child(2) > div:nth-child(2) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input',
    )
    .fill('skalldyr');
  await page
    .locator(
      'div:nth-child(2) > div:nth-child(2) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input',
    )
    .press('Enter');
  await page
    .locator(
      'div:nth-child(2) > div:nth-child(3) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input',
    )
    .fill('skaldyr');
  await page
    .locator(
      'div:nth-child(2) > div:nth-child(3) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input',
    )
    .press('Enter');
  await page
    .locator(
      'div:nth-child(2) > div:nth-child(4) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input',
    )
    .fill('shellfish');
  await page
    .locator(
      'div:nth-child(2) > div:nth-child(4) > .fdk-form-label > .fdk-reg-input-tags > span > .react-tagsinput-input',
    )
    .press('Enter');

  await page.getByRole('button', { name: 'Bruk av begrepet' }).click();
  await page.locator('input:near(:text("Utkast"))').click();
  await page.getByText('Gjeldende', { exact: true }).click();
  await page
    .locator('form div')
    .filter({ hasText: 'Bruk av begrepetBegrepsstatusStatus for begrepet. Undersøk hvilke statuser som s' })
    .locator('input[type="text"]')
    .nth(1)
    .fill('Biologisk mangfold');
  await page
    .locator('form div')
    .filter({ hasText: 'Bruk av begrepetBegrepsstatusStatus for begrepet. Undersøk hvilke statuser som s' })
    .locator('input[type="text"]')
    .nth(2)
    .fill('Biologisk mangfald');
  await page
    .locator('form div')
    .filter({ hasText: 'Bruk av begrepetBegrepsstatusStatus for begrepet. Undersøk hvilke statuser som s' })
    .locator('input[type="text"]')
    .nth(3)
    .fill('Biodiversity');
  await page.locator('textarea[name="eksempel\\.nb"]').fill('Øret');
  await page.locator('textarea[name="eksempel\\.nn"]').fill('Øret');
  await page.locator('textarea[name="eksempel\\.en"]').fill('Trout');
  await page.locator('input[name="omfang\\.uri"]').fill('https://www.youtube.com/watch?v=VHv3y0ZM62U');
  await page.locator('input[name="omfang\\.tekst"]').fill('Mads Hansen og Ida Fladen kveles av surstrømming!');

  await page.getByText('GyldighetGyldig f.o.m.Her registrerer du datoen som begrepet skal gjelde fra og ').click();

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
  await page.locator('input[name="kontaktpunkt\\.harEpost"]').fill('fisk@fellesdatakatalog.digdir.no');
  await page.locator('input[name="kontaktpunkt\\.harTelefon"]').fill('123456789');

  await page.locator('input[name="abbreviatedLabel"]').fill('FSK');
  await page.locator('input[name="versjonsnr\\.major"]').fill('1');
  await page.locator('input[name="versjonsnr\\.minor"]').fill('1');
  await page.locator('input[name="versjonsnr\\.patch"]').fill('2');
  await page
    .locator('form div')
    .filter({ hasText: 'Interne opplysningerOpplysningene under er til intern bruk og vil ikke publisere' })
    .getByRole('textbox')
    .nth(4)
    .fill('fauna');
  await page.getByRole('button', { name: 'Lagre' }).click();
});
