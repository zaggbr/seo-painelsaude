#!/usr/bin/env python3
"""
Submete todas as URLs do sitemap-planos.xml ao IndexNow.
Usa a chave do RankMath já instalada em painelsaude.com.br.

Uso: python3 scripts/indexnow_submit.py
"""

import subprocess
import xml.etree.ElementTree as ET
import json
import sys

KEY = "bba7e55713b74004b7bcacfcac481431"
HOST = "painelsaude.com.br"
SITEMAP_URL = "https://painelsaude.com.br/sitemap-planos.xml"
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"

def curl(args):
    result = subprocess.run(["curl", "-s", "-A", "Mozilla/5.0", *args], capture_output=True)
    return result.stdout, result.returncode

def fetch_urls(sitemap_url):
    print(f"Buscando sitemap: {sitemap_url}")
    xml_bytes, rc = curl([sitemap_url])
    if rc != 0:
        print("Erro ao buscar sitemap"); sys.exit(1)
    tree = ET.fromstring(xml_bytes)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [loc.text.strip() for loc in tree.findall(".//sm:loc", ns) if loc.text]
    if not urls:
        urls = [loc.text.strip() for loc in tree.findall(".//loc") if loc.text]
    return urls

def submit(urls):
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": f"https://{HOST}/{KEY}.txt",
        "urlList": urls,
    }
    data = json.dumps(payload)
    out, _ = curl([
        "-X", "POST", INDEXNOW_ENDPOINT,
        "-H", "Content-Type: application/json; charset=utf-8",
        "--data", data,
        "-w", "\n%{http_code}",
    ])
    text = out.decode(errors="replace")
    lines = text.strip().rsplit("\n", 1)
    status = int(lines[-1]) if lines[-1].isdigit() else 0
    body = lines[0] if len(lines) > 1 else ""
    return status, body

def main():
    urls = fetch_urls(SITEMAP_URL)
    print(f"URLs encontradas: {len(urls)}")

    # IndexNow aceita até 10.000 por request; dividimos em lotes por precaução
    batch_size = 10000
    batches = [urls[i:i+batch_size] for i in range(0, len(urls), batch_size)]

    for i, batch in enumerate(batches, 1):
        print(f"Enviando lote {i}/{len(batches)} ({len(batch)} URLs)...")
        status, body = submit(batch)
        if status == 200:
            print(f"  OK 200 — URLs aceitas")
        elif status == 202:
            print(f"  OK 202 — URLs enfileiradas para processamento")
        else:
            print(f"  ERRO {status}: {body[:300]}")
            sys.exit(1)

    print("\nConcluído. Os buscadores devem rastrear as páginas em até 48h.")

if __name__ == "__main__":
    main()
