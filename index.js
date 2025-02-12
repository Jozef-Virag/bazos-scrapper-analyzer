import puppeteer from 'puppeteer';
import { Command } from 'commander';
import filenamify from 'filenamify';
import fs from 'fs-extra';
import metadata from './package.json' assert { type: 'json' };
import path from 'path';

const program = new Command();

program
    .version(metadata.version)
    .command('search [query] [zip]')
    .description('Searches Bazos.sk using the given search query within the given Slovak ZIP code area.')
    .option('-r, --radius [km]', 'radius in kilometers around the ZIP code to search in')
    .option('-f, --from [amount]', 'price from amount (EUR)')
    .option('-t, --to [amount]', 'price to amount (EUR)')
    .option('-w, --window', 'to run in non-headless mode (windowed)')
    .action(scrape);

program.parse(process.argv);

async function scrape(query, zip, { radius, from: priceMin, to: priceMax, window }) {
    console.log(`Searching for '${query}' in Slovak ZIP code area ${zip} in radius ${radius} priced between ${priceMin || 'any'} and ${priceMax || 'any'} EUR.`);

    const browser = await puppeteer.launch({ headless: !window });
    const page = (await browser.pages())[0];
    await page.bringToFront();

    // Block third-party requests to speed up scraping
    await page.setRequestInterception(true);
    page.on('request', request => {
        const url = new URL(request.url());
        if (url.hostname !== 'bazos.sk' && url.hostname !== 'www.bazos.sk') {
            request.abort();
        } else {
            request.continue();
        }
    });

    await page.goto('https://www.bazos.sk');

    const context = browser.defaultBrowserContext();
    await context.overridePermissions('https://www.bazos.sk', ['geolocation']);
    

    await page.waitForSelector('.cc-nb-okagree', { visible: true });
    await page.click('.cc-nb-okagree');

    const searchInput = await page.$('#hledat');
    await searchInput.focus();
    await page.keyboard.type(query);

    if (zip) {
        const locationInput = await page.$('#hlokalita');
        await locationInput.focus();
        await page.keyboard.type(zip);
    }

    if (radius) {
        const radiusInput = await page.$('input[name=humkreis]');
        await radiusInput.focus();
        await page.evaluate(() => document.querySelector('input[name=humkreis]').value = '');
        await page.keyboard.type(radius);
    }

    if (priceMin) {
        const priceFromInput = await page.$('input[name=cenaod]');
        await priceFromInput.focus();
        await page.keyboard.type(priceMin);
    }

    if (priceMax) {
        const priceToInput = await page.$('input[name=cenado]');
        await priceToInput.focus();
        await page.keyboard.type(priceMax);
    }

    const submitButton = await page.$('input[name=Submit]');
    await submitButton.click();

    await page.waitForNavigation();

    const results = [];
    let hasNextPage = false;

    do {
        // Extrahovanie inzerátov na stránke
        const pageResults = await page.evaluate((query) => {
            const ads = [];
            const adElements = document.querySelectorAll('.inzeraty');

            adElements.forEach(ad => {
                const titleElement = ad.querySelector('h2 a');
                const priceElement = ad.querySelector('.inzeratycena b');
                const locationElement = ad.querySelector('.inzeratylok');

                const title = titleElement?.innerText.trim();
                const link = titleElement?.href;
                const price = priceElement?.innerText.trim();
                const locationText = locationElement?.innerText.trim();
                
                let location = '';
                let zip = '';
                if (locationText) {
                    const locationParts = locationText.split('\n');
                    location = locationParts[0].trim();
                    zip = locationParts[1].trim();
                }

                if (title && link && title.toLowerCase().includes(query.toLowerCase())) {
                    ads.push({ title, link, price, location, zip });
                }
            });

            // Zistenie, či je ďalšia stránka
            const nextPageElement = document.querySelector('div.strankovani a:last-child');
            const nextPageHref = nextPageElement?.innerText === 'Ďalšia' ? nextPageElement.href : null;

            return { ads, nextPageHref };
        }, query);

        results.push(...pageResults.ads);

        if (pageResults.nextPageHref) {
            console.log('next page found');
            await page.goto(pageResults.nextPageHref);
            hasNextPage = true;
        } else {
            console.log('no more pages');
            hasNextPage = false;
        }
    } while (hasNextPage);

    console.log(`Scraped ${results.length} results.`);
    console.log(results);

    // Uloženie výsledkov do JSON súboru
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = filenamify(`${query}-${zip}-${radius || 'any'}-${priceMin || 'any'}-${priceMax || 'any'}-${timestamp}.json`);
    const filePath = path.join('results', fileName);
    await fs.writeJSON(filePath, results, { spaces: 2 });
    console.log(`Results saved to ${filePath}`);

    await browser.close();
}