// scripts/migrate-tags.js
'use strict';
const fs   = require('fs');
const path = require('path');

const GLOBAL_TAGS = [
  'Kanji → Lectura',
  'Kanji → Significado',
  'Katakana',
  'Vocabulario',
  'Partículas',
  'Verbos',
  'Adjetivos',
  'Gramática',
  'Contadores',
  'Números y Tiempo',
  'Traducción ES→JP',
  'Traducción JP→ES',
  'Diálogo',
  'Distinción',
];

function mapTag(tag) {
  // Rule 1: Distinción — trampas, pares confusos, diferencias sutiles
  if (/trampa|sutil|distinci[oó]n| vs |confus|pares|matiz|cultural/i.test(tag)) {
    if (tag === 'Distinción adj.') return 'Adjetivos';
    return 'Distinción';
  }
  // Rule 12: Diálogo (antes de Números y Tiempo: "Reacción al precio" debe ser Diálogo, no Números y Tiempo)
  if (/Di[aá]logo|Situaci[oó]n|Reacci[oó]n|Respuesta|Rutina|Uso en contexto|Intercambio|Entrega del|Presentaci[oó]n completa|Orden presentaci[oó]n|Frase clave|F[oó]rmula|Contexto real|Desaf[ií]o|Saludo comercial/i.test(tag)) return 'Diálogo';
  // Rule 2: Números y Tiempo
  if (/d[ií]as?|mes(es)?|fecha|edad|n[uú]meros?|precio|lectura ～|\bhora\b|leer hora|cumpleaños/i.test(tag)) {
    return 'Números y Tiempo';
  }
  // Rule 3: Contadores
  if (/contador/i.test(tag)) return 'Contadores';
  // Rule 4: Katakana
  if (/katakana/i.test(tag)) return 'Katakana';
  // Rule 5: Partículas
  if (/part[íi]cula/i.test(tag)) return 'Partículas';
  // Rule 6: Traducción ES→JP
  if (/ES→JP|ES→JA|Español→Japonés|Español→Kanji/.test(tag)) return 'Traducción ES→JP';
  // Rule 7: Traducción JP→ES (abreviaturas; Japonés→Español es léxico → Rule 9)
  if (/JP→ES|JA→ES/.test(tag)) return 'Traducción JP→ES';
  // Rule 8: Kanji → Lectura
  if (/Kanji→Lectura|Lectura especial|Curiosidad kanji|Pista del kanji|Kanji complejo/.test(tag)) return 'Kanji → Lectura';
  // Rule 9: Kanji → Significado
  if (/Kanji→Español|Japonés→Español/.test(tag)) return 'Kanji → Significado';
  // Rule 10: Verbos
  if (/Forma V|Forma formal|Grupo verbal|あります|います/.test(tag)) return 'Verbos';
  // Rule 11: Adjetivos
  if (/^Adj[. +]|adjetivo|Intensificador|Tipo de adjetivo|Distinguir adj/i.test(tag)) return 'Adjetivos';
  // Rule 13: Gramática
  if (/Estructura|Patr[oó]n|Orden|Conector|Negaci[oó]n|Demostrativos|Sufijo|Prefijo|Gram[aá]tica|Uso de の|Regla|どんな|Uso de も|Extensi[oó]n|Restricci[oó]n/i.test(tag)) return 'Gramática';
  // Rule 14: Vocabulario (fallback)
  return 'Vocabulario';
}

module.exports = { mapTag, GLOBAL_TAGS };

function main() {
  const unidadesDir = path.join(__dirname, '..', 'unidades');
  const files = fs.readdirSync(unidadesDir).filter(f => f.endsWith('.json')).sort();
  const write = process.argv.includes('--write');

  // Construir mapa único oldTag → newTag y cargar preguntas
  const tagMap   = {};  // oldTag → newTag
  const fileData = [];  // { filePath, questions }

  for (const file of files) {
    const filePath  = path.join(unidadesDir, file);
    const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const q of questions) {
      if (!(q.cat in tagMap)) tagMap[q.cat] = mapTag(q.cat);
    }
    fileData.push({ filePath, questions });
  }

  // Agrupar por nuevo tag para el reporte
  const byNew = {};
  for (const [old, nw] of Object.entries(tagMap)) {
    if (!byNew[nw]) byNew[nw] = [];
    byNew[nw].push(old);
  }

  // Contar preguntas por nuevo tag
  const counts = {};
  for (const { questions } of fileData) {
    for (const q of questions) {
      const nw = tagMap[q.cat];
      counts[nw] = (counts[nw] || 0) + 1;
    }
  }

  // Imprimir reporte
  console.log('=== REPORTE DE MIGRACIÓN' + (write ? '' : ' (dry-run)') + ' ===\n');
  for (const nw of GLOBAL_TAGS) {
    const olds = byNew[nw];
    if (!olds) continue;
    console.log(`\n${nw} (${counts[nw] || 0} preguntas):`);
    for (const old of olds.sort()) console.log(`  "${old}"`);
  }

  // Tags que cayeron al fallback Vocabulario pero cuyo tag original NO era "Vocabulario"
  const fallbacks = (byNew['Vocabulario'] || []).filter(t => t !== 'Vocabulario');
  if (fallbacks.length) {
    console.log('\n⚠️  Cayeron a Vocabulario por fallback (revisar si corresponde):');
    for (const t of fallbacks.sort()) console.log(`  "${t}"`);
  }

  // Resumen
  console.log('\n=== RESUMEN ===');
  let total = 0;
  for (const nw of GLOBAL_TAGS) {
    const c = counts[nw] || 0;
    total += c;
    console.log(`  ${nw.padEnd(24)} ${c}`);
  }
  console.log(`  ${'TOTAL'.padEnd(24)} ${total}`);

  if (write) {
    for (const { filePath, questions } of fileData) {
      const updated = questions.map(q => ({ ...q, cat: tagMap[q.cat] }));
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2) + '\n', 'utf8');
    }
    console.log('\n✅ Migración aplicada a todos los archivos.');
  } else {
    console.log('\n(Dry-run — para aplicar: node scripts/migrate-tags.js --write)');
  }
}

if (require.main === module) main();
