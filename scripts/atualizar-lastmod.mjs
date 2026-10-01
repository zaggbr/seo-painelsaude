#!/usr/bin/env node
/**
 * Atualiza src/data/lastmod.json para as 200 operadoras do sitemap.
 * Rode localmente antes de commitar: npm run lastmod
 *
 * Nunca roda no build do Cloudflare Pages — o build só lê o arquivo.
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

const operadoras = JSON.parse(readFileSync(join(root, 'src/data/operadoras.json'), 'utf-8'));
const lastmodPath = join(root, 'src/data/lastmod.json');

let saved = {};
try {
  saved = JSON.parse(readFileSync(lastmodPath, 'utf-8'));
} catch {
  // arquivo ainda não existe — começa vazio
}

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD local não é correto; ISO date UTC é aceitável

/**
 * Serializa deterministicamente os mesmos dados que o template renderiza.
 * Campos ausentes → null (estável, não undefined).
 */
function serializeForHash(op) {
  const planos = (op.planos ?? []).slice(0, 10).map((p) => ({
    nome: p.nome ?? null,
    segmentacao: p.segmentacao ?? null,
    contratacao: p.contratacao ?? null,
    abrangencia: p.abrangencia ?? null,
    acomodacao: p.acomodacao ?? null,
  }));

  const payload = {
    nome: op.nome ?? null,
    registro_ans: op.registro_ans ?? null,
    modalidade: op.modalidade ?? null,
    total_planos: op.total_planos ?? null,
    segmentacoes: op.segmentacoes ?? null,
    contratacoes: op.contratacoes ?? null,
    abrangencias: op.abrangencias ?? null,
    descricao: op.descricao ?? null,
    beneficiarios: op.beneficiarios ?? null,
    uf: op.uf ?? null,
    planos,
  };

  // JSON.stringify com chaves ordenadas → determinístico
  return JSON.stringify(payload, Object.keys(payload).sort());
}

function sha256(str) {
  return createHash('sha256').update(str, 'utf-8').digest('hex');
}

const slice200 = operadoras.slice(0, 200);
const currentSlugs = new Set(slice200.map((op) => op.slug));

let unchanged = 0;
let updated = 0;
let added = 0;
let removed = 0;

const next = {};

for (const op of slice200) {
  const hash = sha256(serializeForHash(op));
  const prev = saved[op.slug];

  if (!prev) {
    next[op.slug] = { hash, date: today };
    added++;
  } else if (prev.hash === hash) {
    next[op.slug] = prev; // mantém hash e date originais
    unchanged++;
  } else {
    next[op.slug] = { hash, date: today };
    updated++;
  }
}

// slugs que saíram do slice
for (const slug of Object.keys(saved)) {
  if (!currentSlugs.has(slug)) removed++;
}

// escreve com chaves ordenadas (diff legível no git)
const sorted = Object.fromEntries(
  Object.entries(next).sort(([a], [b]) => a.localeCompare(b))
);
writeFileSync(lastmodPath, JSON.stringify(sorted, null, 2) + '\n', 'utf-8');

console.log(`lastmod atualizado: ${unchanged} sem mudança, ${updated} atualizados, ${added} novos, ${removed} removidos`);
