import json

with open('docs/n8n-backups/ZGC_pSEO_SaudePublica.json', 'r') as f:
    wf = json.load(f)

for node in wf.get('nodes', []):
    if node['name'] == 'IA: Gerar Keywords':
        import re
        body = node['parameters']['jsonBody']
        # Replace the system content
        new_sys_content = "Você é um especialista em SEO brasileiro. Gere 20 palavras-chave para o nicho informado. Retorne SOMENTE JSON: {\\\"keywords\\\": [\\\"keyword 1\\\", \\\"keyword 2\\\"]}. REGRAS: cada keyword deve ter 2-4 palavras (não mais). Seja EXTREMAMENTE criativo, focado em termos de cauda longa, explorando dores e buscas menos óbvias do nicho. EVITE focar sempre nos mesmos temas repetitivos (como apenas 'fila' ou 'marcação'). Busque novos ângulos, direitos do paciente, gratuidades e dúvidas raras. Evite frases completas."
        # Use regex to replace the content string
        body = re.sub(r'("role":\s*"system",\s*"content":\s*")[^"]+(")', r'\g<1>' + new_sys_content + r'\g<2>', body)
        # Change temperature
        body = body.replace('"temperature": 0.4', '"temperature": 0.85')
        
        node['parameters']['jsonBody'] = body

with open('docs/n8n-backups/ZGC_pSEO_SaudePublica.json', 'w') as f:
    json.dump(wf, f, indent=2)

print("Updated prompt in JSON")
