import fs from 'fs';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const operadoras = JSON.parse(fs.readFileSync('./src/data/operadoras.json', 'utf8'));

// Só as top 200 que estão no site
const top200 = operadoras.slice(0, 200);

let enriquecidas = 0;
const resultado = [];

for (const op of top200) {
  if (op.descricao) {
    resultado.push(op);
    continue;
  }

  try {
    process.stdout.write(`Enriquecendo: ${op.nome}... `);

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Você é especialista em saúde suplementar no Brasil. Escreva 2 parágrafos informativos sobre a operadora de planos de saúde abaixo. Use apenas os dados fornecidos, sem inventar informações.

Operadora: ${op.nome}
Modalidade: ${op.modalidade}
Total de planos ativos: ${op.total_planos}
Tipos de cobertura: ${op.segmentacoes.slice(0,3).join(', ')}
Tipos de contratação: ${op.contratacoes.join(', ')}
Abrangência: ${op.abrangencias.slice(0,2).join(', ')}

Escreva em português brasileiro, tom informativo e neutro. Máximo 120 palavras.`
        }]
      })
    });

    const data = await res.json();
    op.descricao = data.content[0].text;
    enriquecidas++;
    console.log('✓');

    await new Promise(r => setTimeout(r, 500));
  } catch (err) {
    console.log(`✗ ${err.message}`);
  }

  resultado.push(op);
}

// Salva de volta no JSON
for (const op of resultado) {
  const idx = operadoras.findIndex(o => o.slug === op.slug);
  if (idx !== -1) operadoras[idx] = op;
}

fs.writeFileSync('./src/data/operadoras.json', JSON.stringify(operadoras, null, 2));
console.log(`\nEnriquecidas: ${enriquecidas}/200`);
