
const fs = require('fs');
const path = require('path');

function scan(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        if (f === 'node_modules' || f === '.next' || f === '.git') continue;
        const full = path.join(dir, f);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            scan(full);
        } else if (f.endsWith('.json')) {
            try {
                const raw = fs.readFileSync(full, 'utf8');
                JSON.parse(raw);
            } catch (e) {
                console.error(`❌ INVALID JSON: ${full}`);
                console.error(e.message);

                // Show tail if "Unexpected non-whitespace"
                if (e.message.includes('Unexpected non-whitespace')) {
                    const match = e.message.match(/position (\d+)/);
                    if (match) {
                        const pos = parseInt(match[1]);
                        console.log('Pos:', pos);
                        console.log('Context:', raw.substring(Math.max(0, pos - 20), Math.min(raw.length, pos + 20)));
                    }
                }
            }
        }
    }
}

console.log('Scanning JSON files...');
scan('.');
console.log('Done scanning.');
