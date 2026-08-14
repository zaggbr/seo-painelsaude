# Relatório de Implementação — IndexNow & Bing Webmaster Tools

**Data da Implementação:** 28/07/2026  
**Prioridade:** ALTA  
**Domínios Cobertos:**
- `painelsaude.com.br` (WordPress raiz + Astro via Worker Proxy)
- `meu.painelsaude.com.br` (Astro puro, Cloudflare Pages)

---

## 1. Verificação de Propriedade (Bing Webmaster Tools)

Para provar a propriedade dos domínios e autorizar a indexação via Bing Webmaster Tools:

1. **meu.painelsaude.com.br (Astro)**:
   - Inserida a tag meta de validação fornecida no layout base das páginas do Astro.
   - Arquivo: [BaseLayout.astro](file:///Users/zagg/zgc-painelsaude/src/layouts/BaseLayout.astro)
   - Linha adicionada: `<meta name="msvalidate.01" content="6EF53C17599C3C4C3F8D95009F4F06CE" />`

2. **painelsaude.com.br (WordPress)**:
   - Configurado e ativado o RankMath Instant Indexing no painel administrativo do WordPress, que lida automaticamente com a verificação de propriedade deste domínio e publica a chave de verificação na rota `/bba7e55713b74004b7bcacfcac481431.txt`.

---

## 2. Configuração de Chaves IndexNow

Para submissão via API do IndexNow, as seguintes chaves e arquivos de validação foram estabelecidos:

1. **meu.painelsaude.com.br (Astro)**:
   - Chave gerada: `b2b3cb8ea3fddf3f05df21ca8cb758b2`
   - Arquivo de chave criado no diretório público para deploy em Cloudflare Pages:
     - Arquivo: [b2b3cb8ea3fddf3f05df21ca8cb758b2.txt](file:///Users/zagg/zgc-painelsaude/public/b2b3cb8ea3fddf3f05df21ca8cb758b2.txt)
     - Conteúdo do arquivo: `b2b3cb8ea3fddf3f05df21ca8cb758b2`
   - Rota pública esperada após deploy: `https://meu.painelsaude.com.br/b2b3cb8ea3fddf3f05df21ca8cb758b2.txt`

2. **painelsaude.com.br (WordPress)**:
   - Chave gerada pelo RankMath: `bba7e55713b74004b7bcacfcac481431`
   - Rota pública correspondente: `https://painelsaude.com.br/bba7e55713b74004b7bcacfcac481431.txt`

---

## 3. Automação de Workflows no n8n

Para notificar o Bing automaticamente toda vez que novas páginas forem geradas ou o feed for atualizado, inserimos os nós de envio do IndexNow nos workflows de backup locais:

1. **ZGC_Feed_Editorial_Output** (Atualização diária do feed):
   - Atualizados os arquivos [ZGC_Feed_Editorial_Output.json](file:///Users/zagg/seo-painelsaude/docs/n8n-backups/ZGC_Feed_Editorial_Output.json) e [n8n_feed_workflow.json](file:///Users/zagg/zgc-painelsaude/scripts/n8n_feed_workflow.json).
   - Inserido o nó de código `Preparar payload IndexNow` para agregar todas as URLs em um array único.
   - Conectado o nó de HTTP Request `IndexNow meu.painelsaude` para submeter a lista de URLs ao endpoint do IndexNow.

2. **ZGC_Gerar_Paginas_Satelite** (Geração semanal de páginas pSEO):
   - Atualizado o arquivo [ZGC_Gerar_Paginas_Satelite.json](file:///Users/zagg/seo-painelsaude/docs/n8n-backups/ZGC_Gerar_Paginas_Satelite.json).
   - Adicionados os nós de preparação de payload e a chamada HTTP Request para submissão das novas páginas ao IndexNow.

### Configuração do Nó de Envio (HTTP Request):
- **Método**: POST
- **URL**: `https://api.indexnow.org/indexnow`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "host": "meu.painelsaude.com.br",
    "key": "b2b3cb8ea3fddf3f05df21ca8cb758b2",
    "keyLocation": "https://meu.painelsaude.com.br/b2b3cb8ea3fddf3f05df21ca8cb758b2.txt",
    "urlList": {{ $json.urls }}
  }
  ```

---

## 4. Próximos Passos (Validação Manual)

Assim que o deploy for finalizado nas plataformas Cloudflare e WordPress, execute os seguintes passos de teste e validação:

1. **Acessibilidade dos arquivos de chaves**:
   ```bash
   curl -s https://painelsaude.com.br/bba7e55713b74004b7bcacfcac481431.txt
   curl -s https://meu.painelsaude.com.br/b2b3cb8ea3fddf3f05df21ca8cb758b2.txt
   ```
   *Ambos devem retornar somente a string da respectiva chave de API.*

2. **Submissão Manual de Teste**:
   Execute um POST de teste para o IndexNow usando o `curl`:
   ```bash
   curl -X POST "https://api.indexnow.org/indexnow" \
     -H "Content-Type: application/json" \
     -d '{
       "host": "meu.painelsaude.com.br",
       "key": "b2b3cb8ea3fddf3f05df21ca8cb758b2",
       "keyLocation": "https://meu.painelsaude.com.br/b2b3cb8ea3fddf3f05df21ca8cb758b2.txt",
       "urlList": ["https://meu.painelsaude.com.br/bula/"]
     }'
   ```
   *Resposta esperada: HTTP 200 ou 202.*
