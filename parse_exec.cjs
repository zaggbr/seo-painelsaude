const { parse } = require('flatted');
const fs = require('fs');
const raw = fs.readFileSync('/tmp/exec.json', 'utf8');
const data = parse(raw);
const results = data.resultData.runData;

const split_node = results['Split Keywords'];
if (split_node && split_node.length > 0) {
    const arr = split_node[0].data.main[0];
    fs.writeFileSync('/tmp/split_out.json', JSON.stringify(arr, null, 2));
}
