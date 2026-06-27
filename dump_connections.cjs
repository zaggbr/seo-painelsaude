const fs = require('fs');
const wf = JSON.parse(fs.readFileSync('/Users/zagg/seo-painelsaude/docs/n8n-backups/ZGC_pSEO_SaudePublica.json', 'utf8'));
console.log(JSON.stringify(wf.connections, null, 2));
