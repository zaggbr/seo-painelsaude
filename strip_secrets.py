import re
import json

def strip_file(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    # Replace GitHub PAT
    content = re.sub(r'github_pat_[a-zA-Z0-9_]+', '<REDACTED_GITHUB_PAT>', content)
    
    # Replace OpenAI API Key
    content = re.sub(r'sk-[a-zA-Z0-9]{48}', '<REDACTED_OPENAI_KEY>', content)
    content = re.sub(r'sk-proj-[a-zA-Z0-9_-]+', '<REDACTED_OPENAI_KEY>', content)

    with open(filename, 'w') as f:
        f.write(content)

strip_file('docs/n8n-backups/ZGC_Gerar_Paginas_Satelite.json')
strip_file('docs/n8n-backups/ZGC_pSEO_SaudePublica.json')
print("Secrets stripped")
