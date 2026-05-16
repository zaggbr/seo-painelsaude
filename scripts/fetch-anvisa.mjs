import fs from 'fs';

console.log('Buscando medicamentos na API Anvisa...');

let pagina = 1;
let todos = [];
let continuar = true;

while (continuar) {
  try {
    const url = `https://consultas.anvisa.gov.br/api/consulta/medicamentos/?count=100&offset=${(pagina-1)*100}&situacao=1`;
    process.stdout.write(`Página ${pagina}... `);
    
    const res = await fetch(url, {
      headers: {
        'Authorization': 'Guest',
        'Accept': 'application/json'
      }
    });
    
    if (!res.ok) { console.log(`Erro ${res.status}`); break; }
    
    const data = await res.json();
    const items = data.content || data.medicamentos || data || [];
    
    if (!Array.isArray(items) || items.length === 0) {
      continuar = false;
    } else {
      todos = todos.concat(items);
      console.log(`${items.length} medicamentos`);
      pagina++;
      
      if (pagina > 5) continuar = false; // Teste com 5 páginas primeiro
      await new Promise(r => setTimeout(r, 500));
    }
  } catch (err) {
    console.log(`Erro: ${err.message}`);
    break;
  }
}

console.log(`\nTotal: ${todos.length} medicamentos`);
if (todos.length > 0) {
  console.log('Exemplo:', JSON.stringify(todos[0], null, 2));
  fs.writeFileSync('./src/data/remedios_raw.json', JSON.stringify(todos, null, 2));
  console.log('Salvo em src/data/remedios_raw.json');
}
