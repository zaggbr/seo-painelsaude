const { parse } = require('flatted');
const fs = require('fs');
const raw = fs.readFileSync('/tmp/exec.json', 'utf8');
const data = parse(raw);
const results = data.resultData.runData;

const splitOut = results['Split Keywords'][0].data.main[0];
fs.writeFileSync('/tmp/split_full.json', JSON.stringify(splitOut, null, 2));
