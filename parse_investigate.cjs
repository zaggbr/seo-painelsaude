const { parse } = require('flatted');
const fs = require('fs');
const raw = fs.readFileSync('/tmp/exec.json', 'utf8');
const data = parse(raw);
const results = data.resultData.runData;

// 1. Quantos itens sairam do Split Keywords
const splitOut = results['Split Keywords'] && results['Split Keywords'][0].data.main[0];
const splitCount = splitOut ? splitOut.length : 0;
console.log("1. Itens Split Keywords:", splitCount);

// 2. Quantas vezes cada node rodou
const adsCount = results['Google Ads API'] ? results['Google Ads API'].length : 0;
const processCount = results['Processar Métricas'] ? results['Processar Métricas'].length : 0;
const filtroCount = results['Filtro SEO'] ? results['Filtro SEO'].length : 0;

console.log("2. Execuções:");
console.log(" - Google Ads API:", adsCount);
console.log(" - Processar Métricas:", processCount);
console.log(" - Filtro SEO:", filtroCount);

// 3. O que aconteceu com o item perdido?
console.log("\n3. Analisando as execuções do Google Ads API e Processar Métricas:");
const adsExecs = results['Google Ads API'] || [];
const procExecs = results['Processar Métricas'] || [];

for (let i = 0; i < adsExecs.length; i++) {
    const ads = adsExecs[i];
    const proc = procExecs.find(p => p.source && p.source.some(s => s.previousNodeRun === ads.executionIndex || s.previousNodeRun === i || s.previousNode === 'Google Ads API' && s.previousNodeRun === i));
    
    // We can just dump the outputs of Google Ads API
    console.log(`\n--- Execução ${i + 1} ---`);
    console.log("Google Ads API status:", ads.executionStatus);
    if (ads.error) console.log("Google Ads API Error:", ads.error.message);
    
    let adsOutput = ads.data.main[0] && ads.data.main[0][0];
    if (adsOutput) {
        let resultsArr = adsOutput.json && adsOutput.json.results;
        if (!resultsArr || resultsArr.length === 0) {
            console.log("Google Ads API Output: VAZIO (0 results)");
        } else {
            console.log("Google Ads API Output: Retornou resultados");
        }
    }

    const p_exec = procExecs[i];
    if (p_exec) {
        console.log("Processar Métricas status:", p_exec.executionStatus);
        if (p_exec.error) console.log("Processar Métricas Error:", p_exec.error.message);
        
        let p_out = p_exec.data.main[0];
        // p_out can be empty array if the node returned []
        if (!p_out || p_out.length === 0) {
            console.log("Processar Métricas Output: VAZIO (Retornou array vazio)");
        } else {
            console.log("Processar Métricas Output: Passou item para frente");
        }
    } else {
        console.log("Processar Métricas: NÃO EXECUTOU para este item (ou índice incompatível)");
    }
}

