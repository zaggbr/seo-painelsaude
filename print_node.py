import json

with open('/Users/zagg/seo-painelsaude/docs/n8n-backups/ZGC_pSEO_SaudePublica.json', 'r') as f:
    data = json.load(f)

for node in data['nodes']:
    if node['name'] == 'Processar Métricas':
        print(node['parameters']['jsCode'])

