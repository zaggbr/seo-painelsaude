const { parse } = require('flatted');
const fs = require('fs');
const raw = fs.readFileSync('/tmp/exec.json', 'utf8');
const data = parse(raw);
if (data.workflowData) {
  console.log("WORKFLOW DATA FOUND");
  const conn = data.workflowData.connections["Salvar no Google Sheets"];
  console.log(JSON.stringify(conn, null, 2));
} else {
  console.log("No workflow data.");
}
