/**
 * Converte o subconjunto de markdown usado em op.descricao para HTML seguro.
 *
 * Ordem obrigatória:
 *   1. Escape HTML (&, <, >) — ANTES de qualquer conversão, para que apenas
 *      as tags geradas aqui sejam HTML vivo. op.descricao é texto de LLM e
 *      pode ser regenerado a qualquer momento.
 *   2. Remove heading inicial (duplicata do nome da operadora).
 *   3. **texto** → <strong>texto</strong>
 *   4. Normaliza quebras de linha; colapsa 3+ em exatamente 2.
 *   5. \n simples → espaço (continuação de parágrafo).
 *   6. Divide por \n\n, embrulha cada bloco em <p>, descarta vazios.
 */
export function descricaoToHtml(text) {
  if (!text) return '';

  // 1. Escape HTML
  let s = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Remove heading inicial (^#{1-6} <texto>\n*)
  s = s.replace(/^#{1,6}\s+[^\n]+\n*/m, '');

  // 3. **texto** → <strong>texto</strong>
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 4. Normaliza \r\n; colapsa 3+ quebras em 2
  s = s.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');

  // 5. \n simples → espaço
  s = s.replace(/([^\n])\n([^\n])/g, '$1 $2');

  // 6. Divide por \n\n, embrulha em <p>, descarta blocos vazios
  const paragraphs = s
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p) => `<p>${p}</p>`);

  return paragraphs.join('\n');
}
