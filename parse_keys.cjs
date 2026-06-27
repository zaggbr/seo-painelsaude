const { parse } = require('flatted');
const fs = require('fs');
const raw = fs.readFileSync('/tmp/exec.json', 'utf8');
const data = parse(raw);
console.log(Object.keys(data));
if (data.workflowData) { console.log("workflowData is at root"); }
console.log(data.workflowData ? Object.keys(data.workflowData) : "no workflowData at root");
console.log(data.resultData ? Object.keys(data.resultData) : "no resultData at root");
