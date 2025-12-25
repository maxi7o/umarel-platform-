
import fs from 'fs';
import path from 'path';

const ES_PATH = path.join(process.cwd(), 'messages/es.json');
const EN_PATH = path.join(process.cwd(), 'messages/en.json');

function flattenKeys(obj: any, prefix = ''): string[] {
    let keys: string[] = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(flattenKeys(obj[key], prefix + key + '.'));
        } else {
            keys.push(prefix + key);
        }
    }
    return keys;
}

function check() {
    console.log("Checking locale parity...");

    if (!fs.existsSync(ES_PATH) || !fs.existsSync(EN_PATH)) {
        console.error("Missing locale files!");
        process.exit(1);
    }

    const es = JSON.parse(fs.readFileSync(ES_PATH, 'utf-8'));
    const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));

    const esKeys = new Set(flattenKeys(es));
    const enKeys = new Set(flattenKeys(en));

    const missingInEs = [...enKeys].filter(k => !esKeys.has(k));
    const missingInEn = [...esKeys].filter(k => !enKeys.has(k));

    if (missingInEs.length > 0) {
        console.error("\n❌ Keys missing in ES (Spanish):");
        missingInEs.forEach(k => console.log(` - ${k}`));
    }

    if (missingInEn.length > 0) {
        console.error("\n❌ Keys missing in EN (English):");
        missingInEn.forEach(k => console.log(` - ${k}`));
    }

    if (missingInEs.length === 0 && missingInEn.length === 0) {
        console.log("\n✅ Locale files are in perfect harmony.");
        process.exit(0);
    } else {
        process.exit(1);
    }
}

check();
