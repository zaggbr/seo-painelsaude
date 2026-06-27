import json

with open('/Users/zagg/seo-painelsaude/docs/n8n-backups/ZGC_pSEO_SaudePublica.json', 'r') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Processar Métricas':
        code = node['parameters']['jsCode']
        code = code.replace(
            "const results = raw.results || [];\nif (results.length === 0) {\n  return [];\n}\n\nconst result = results[0];",
            "const results = raw.results || [];\nconst result = results.length > 0 ? results[0] : {};"
        )
        node['parameters']['jsCode'] = code
        print("Métricas code updated!")

with open('/Users/zagg/seo-painelsaude/docs/n8n-backups/ZGC_pSEO_SaudePublica.json', 'w') as f:
    json.dump(data, f, indent=2)

