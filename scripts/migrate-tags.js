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
  if (/Kanji→Lectura|Lectura especial/.test(tag)) return 'Kanji → Lectura';
  // Rule 9: Kanji → Significado
  if (/Kanji→Español|Japonés→Español/.test(tag)) return 'Kanji → Significado';
  // Rule 10: Verbos
  if (/Forma V|Forma formal|Grupo verbal|あります|います/.test(tag)) return 'Verbos';
  // Rule 11: Adjetivos
  if (/^Adj[. +]|adjetivo|Intensificador|Tipo de adjetivo/i.test(tag)) return 'Adjetivos';
  // Rule 13: Gramática
  if (/Estructura|Patr[oó]n|Orden|Conector|Negaci[oó]n|Demostrativos|Sufijo|Prefijo|Gram[aá]tica|Uso de の|Regla|どんな|Uso de も|Extensi[oó]n|Restricci[oó]n/i.test(tag)) return 'Gramática';
  // Rule 14: Vocabulario (fallback)
  return 'Vocabulario';
}

module.exports = { mapTag, GLOBAL_TAGS };
