const { parse } = require('flatted');
const fs = require('fs');
const raw = fs.readFileSync('/tmp/exec.json', 'utf8');
const data = parse(raw);
const results = data.resultData.runData;

const adsCount = results['Google Ads API'] ? results['Google Ads API'].length : 0;
console.log("ADS COUNT:", adsCount);

const filtroExecs = results['Filtro SEO'] || [];
const filtroOutput = [];
for (let i = 0; i < filtroExecs.length; i++) {
    // try to get input
    let inputItem = null;
    try {
        // Find the node before it if needed, or look at 'Filtro SEO' input.
        // Actually n8n saves node input in `filtroExecs[i].data.main`? No, wait. 
        // n8n stores output in `.data.main` array. The array index is the output index.
        // For 'If' node, index 0 is True, index 1 is False.
        let trueBranch = filtroExecs[i].data.main[0];
        let falseBranch = filtroExecs[i].data.main[1];
        
        let outputTrue = trueBranch && trueBranch[0] && trueBranch[0].length > 0;
        let outputFalse = falseBranch && falseBranch[0] && falseBranch[0].length > 0;
        
        let outputJson = null;
        if (outputTrue) {
            outputJson = trueBranch[0][0].json;
        } else if (outputFalse) {
            outputJson = falseBranch[0][0].json;
        }
        
        filtroOutput.push({
            exec: i + 1,
            input: outputJson, // Since output of If is the same as input
            result: outputTrue ? true : false
        });
    } catch(e) {
        filtroOutput.push({ exec: i + 1, error: e.message });
    }
}
fs.writeFileSync('/tmp/filtro_out.json', JSON.stringify(filtroOutput, null, 2));

const splitOut = results['Split Keywords'][0].data.main[0][0];
fs.writeFileSync('/tmp/split_out.json', JSON.stringify(splitOut, null, 2));

