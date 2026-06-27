import json

with open('docs/n8n-backups/ZGC_pSEO_SaudePublica.json', 'r') as f:
    wf = json.load(f)

for node in wf.get('nodes', []):
    if node['name'] == 'IA: Gerar Keywords':
        body = node['parameters']['jsonBody']
        
        # The body is a string starting with =. 
        # We can strip the = and parse it as JSON to edit safely!
        is_expression = body.startswith('=')
        if is_expression:
            raw_json_str = body[1:]
        else:
            raw_json_str = body
            
        # Parse it
        try:
            parsed_body = json.loads(raw_json_str)
            # Find the system message
            for msg in parsed_body.get('messages', []):
                if msg.get('role') == 'system':
                    msg['content'] = "Você é um especialista em SEO brasileiro. Gere 20 palavras-chave para o nicho informado. Retorne SOMENTE JSON: {\"keywords\": [\"keyword 1\", \"keyword 2\"]}. REGRAS: cada keyword deve ter 2-4 palavras (não mais). Seja EXTREMAMENTE criativo, focado em termos de cauda longa, explorando dores e buscas menos óbvias do nicho. EVITE focar sempre nos mesmos temas repetitivos (como apenas 'fila' ou 'marcação'). Busque novos ângulos, direitos do paciente, gratuidades e dúvidas raras. Evite frases completas."
            
            parsed_body['temperature'] = 0.85
            
            # Serialize back to string
            new_body = json.dumps(parsed_body, indent=2, ensure_ascii=False)
            if is_expression:
                new_body = '=' + new_body
                
            node['parameters']['jsonBody'] = new_body
            print("Successfully parsed and modified jsonBody")
        except Exception as e:
            print("Failed to parse jsonBody as JSON. Fixing manually...", e)
            # Manual fix if it contains {{ $json.nicho_label }} which breaks json.loads
            # We'll just read the original backup and do replace
            pass

with open('docs/n8n-backups/ZGC_pSEO_SaudePublica.json', 'w') as f:
    json.dump(wf, f, indent=2)

