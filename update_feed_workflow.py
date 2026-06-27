import json

with open('docs/n8n-backups/ZGC_Feed_Editorial_Output.json', 'r') as f:
    wf = json.load(f)

for node in wf.get('nodes', []):
    if node['name'] == 'Validar e sanitizar JSON':
        code = node['parameters']['jsCode']
        
        # Replace the filter function
        old_filter = """feedData.blocos = feedData.blocos.filter(b => {
  if (!b.urlSateliteReal) {
    console.warn(`Bloco '${b.id}' sem urlSateliteReal — descartado`);
    return false;
  }
  return true;
});"""
        new_filter = """feedData.blocos = feedData.blocos.filter(b => {
  if (!b.urlSateliteReal) {
    console.warn(`Bloco '${b.id}' sem urlSateliteReal — descartado`);
    return false;
  }
  
  if (b.quiz && b.quiz.opcoes && b.quiz.opcoes.some(o => o.trim().length <= 1)) {
    delete b.quiz;
  }
  
  return true;
});"""
        code = code.replace(old_filter, new_filter)
        node['parameters']['jsCode'] = code

with open('docs/n8n-backups/ZGC_Feed_Editorial_Output.json', 'w') as f:
    json.dump(wf, f, indent=2)

print("Updated feed workflow")
