const fs = require('fs');
try {
    const content = fs.readFileSync('messages/es.json', 'utf8');
    JSON.parse(content);
    console.log('Valid JSON');
} catch (e) {
    console.error('Invalid JSON:', e.message);
}
