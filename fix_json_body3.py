import json

with open('docs/n8n-backups/ZGC_pSEO_SaudePublica.json', 'r') as f:
    wf = json.load(f)

perfect_json_body = """={
  "model": "gpt-4o-mini",
  "temperature": 0.85,
  "response_format": { "type": "json_object" },
  "messages": [
    {
      "role": "system",
      "content": "Você é um especialista em SEO brasileiro. Gere 20 palavras-chave para o nicho informado. Retorne SOMENTE JSON: {\\"keywords\\": [\\"keyword 1\\", \\"keyword 2\\"]}. REGRAS: cada keyword deve ter 2-4 palavras (não mais). Seja EXTREMAMENTE criativo, focado em termos de cauda longa, explorando dores e buscas menos óbvias do nicho. EVITE focar sempre nos mesmos temas repetitivos (como apenas 'fila' ou 'marcação'). Busque novos ângulos, direitos do paciente, gratuidades e dúvidas raras. Evite frases completas."
    },
    {
      "role": "user",
      "content": "Nicho: {{ $json.nicho_label }}. Gere 20 keywords de 2-4 palavras com volume de busca real no Brasil."
    }
  ]
}"""

for node in wf.get('nodes', []):
    if node['name'] == 'IA: Gerar Keywords':
        node['parameters']['jsonBody'] = perfect_json_body

with open('docs/n8n-backups/ZGC_pSEO_SaudePublica.json', 'w') as f:
    json.dump(wf, f, indent=2)

print("Fixed")
