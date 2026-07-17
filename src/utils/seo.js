export function extractFromContent(content, maxLength = 160) {
  if (!content) return "";
  
  // Remove markdown syntax
  const plain = content
    .replace(/#{1,6}\s+/g, '')           // headers
    .replace(/\*\*|\*|__|_/g, '')        // bold/italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // images
    .replace(/`{1,3}[^`]*`{1,3}/g, '')   // code
    .replace(/\n+/g, ' ')                // newlines
    .trim();
  
  if (!plain) return "";

  const firstParagraph = plain.split('. ')[0] + '.';
  return firstParagraph.length > maxLength 
    ? firstParagraph.substring(0, maxLength).trim() + '...'
    : firstParagraph;
}
