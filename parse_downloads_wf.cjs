const fs = require('fs');
const wf = JSON.parse(fs.readFileSync('/Users/zagg/Downloads/ZGC_pSEO_SaudePublica.json', 'utf8'));
console.log(JSON.stringify(wf.connections, null, 2));
