
import fs from 'fs';
import path from 'path';
import { SUPPORTED_LOCALES } from '../i18n/config';

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const SOURCE_LOCALE = 'en';

async function generateLocales() {
    console.log('Generating locale files...');

    const sourcePath = path.join(MESSAGES_DIR, `${SOURCE_LOCALE}.json`);
    if (!fs.existsSync(sourcePath)) {
        console.error(`Source locale file not found at ${sourcePath}`);
        process.exit(1);
    }

    const sourceContent = fs.readFileSync(sourcePath, 'utf-8');

    for (const locale of SUPPORTED_LOCALES) {
        if (locale === SOURCE_LOCALE) continue;

        const targetPath = path.join(MESSAGES_DIR, `${locale}.json`);

        if (!fs.existsSync(targetPath)) {
            console.log(`Creating ${locale}.json...`);
            fs.writeFileSync(targetPath, sourceContent);
        } else {
            console.log(`${locale}.json already exists. Skipping.`);
        }
    }

    console.log('Locale generation complete.');
}

generateLocales();
