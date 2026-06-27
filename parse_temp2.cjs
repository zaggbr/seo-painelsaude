const { parse } = require('flatted');
const fs = require('fs');
const raw = fs.readFileSync('/tmp/exec.json', 'utf8');
const data = parse(raw);
const results = data.resultData.runData;

fs.writeFileSync('/tmp/filtro_dump.json', JSON.stringify(results['Filtro SEO'], null, 2));
