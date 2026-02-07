
const fs = require('fs');

try {
    const raw = fs.readFileSync('messages/es.json', 'utf8');
    try {
        JSON.parse(raw);
        console.log('✅ es.json is valid');
    } catch (e) {
        console.error('❌ es.json is INVALID:', e.message);
        const match = e.message.match(/position (\d+)/);
        if (match) {
            const pos = parseInt(match[1]);
            const start = Math.max(0, pos - 50);
            const end = Math.min(raw.length, pos + 50);
            console.log('Context:', raw.substring(start, end));
            console.log('         ' + ' '.repeat(pos - start) + '^');
        }
    }
} catch (e) {
    console.error('File read error:', e);
}
