// scripts/migrate-tags.test.js
const { mapTag } = require('./migrate-tags');

const cases = [
  // Rule 1: Distinción
  ['Trampa sutil',                     'Distinción'],
  ['Vocabulario trampa',               'Distinción'],
  ['Distinción edad',                  'Distinción'],
  ['Formal vs casual',                 'Distinción'],
  ['Conector そして vs が',             'Distinción'],
  ['Distinguir kanji (clima vs objeto)','Distinción'],
  ['そうですね vs そうですか',           'Distinción'],
  ['Pares confusos',                   'Distinción'],
  ['Matiz cultural',                   'Distinción'],
  ['Distinción adj.',                  'Adjetivos'],

  // Rule 2: Números y Tiempo
  ['Lectura ～時',                     'Números y Tiempo'],
  ['Lectura ～分',                     'Números y Tiempo'],
  ['Días - irregular',                 'Números y Tiempo'],
  ['Días: Kanji→Español',              'Números y Tiempo'],
  ['Días: Kanji→Lectura',              'Números y Tiempo'],
  ['Meses',                            'Números y Tiempo'],
  ['Meses - regla',                    'Números y Tiempo'],
  ['Números',                          'Números y Tiempo'],
  ['Números precios',                  'Números y Tiempo'],
  ['Leer hora',                        'Números y Tiempo'],
  ['Edad irregular',                   'Números y Tiempo'],
  ['Pregunta cumpleaños',              'Números y Tiempo'],

  // Rule 3: Contadores
  ['Contador ~つ',                     'Contadores'],
  ['Contador ~階',                     'Contadores'],

  // Rule 4: Katakana
  ['Katakana→Español',                 'Katakana'],
  ['Vocabulario Katakana',             'Katakana'],

  // Rule 5: Partículas
  ['Partícula',                        'Partículas'],
  ['Partícula を (objeto)',             'Partículas'],
  ['Distinguir partículas',            'Partículas'],
  ['Partícula crítica',                'Partículas'],

  // Rule 6: Traducción ES→JP
  ['Traducción ES→JP',                 'Traducción ES→JP'],
  ['Español→Japonés',                  'Traducción ES→JP'],
  ['Traducción ES→JA',                 'Traducción ES→JP'],
  ['Español→Kanji',                    'Traducción ES→JP'],

  // Rule 7: Traducción JP→ES
  ['Traducción JP→ES',                 'Traducción JP→ES'],
  ['Traducción JA→ES',                 'Traducción JP→ES'],

  // Rule 8: Kanji → Lectura
  ['Kanji→Lectura',                    'Kanji → Lectura'],
  ['Verbo: Kanji→Lectura',             'Kanji → Lectura'],
  ['Adj.い: Kanji→Lectura',            'Kanji → Lectura'],
  ['Adj.: Kanji→Lectura',              'Kanji → Lectura'],
  ['Lectura especial',                 'Kanji → Lectura'],

  // Rule 9: Kanji → Significado
  ['Kanji→Español',                    'Kanji → Significado'],
  ['Verbo: Kanji→Español',             'Kanji → Significado'],
  ['Adj.い: Kanji→Español',            'Kanji → Significado'],
  ['Adj.な: Japonés→Español',          'Kanji → Significado'],
  ['Japonés→Español',                  'Kanji → Significado'],

  // Rule 10: Verbos
  ['Forma Vます/Vません',               'Verbos'],
  ['Forma Vます habitual',              'Verbos'],
  ['Grupo verbal',                     'Verbos'],
  ['あります',                          'Verbos'],
  ['Forma formal',                     'Verbos'],

  // Rule 11: Adjetivos
  ['Adj. negativo',                    'Adjetivos'],
  ['Adj + Sustantivo',                 'Adjetivos'],
  ['Adj. negativo IRREGULAR',          'Adjetivos'],
  ['Tipo de adjetivo',                 'Adjetivos'],
  ['Intensificador',                   'Adjetivos'],
  ['Intensificador: elegir',           'Adjetivos'],

  // Rule 12: Diálogo
  ['Diálogo',                          'Diálogo'],
  ['Diálogo completo',                 'Diálogo'],
  ['Situación formal',                 'Diálogo'],
  ['Reacción',                         'Diálogo'],
  ['Reacción al precio',               'Diálogo'],
  ['Respuesta cortesía',               'Diálogo'],
  ['Respuesta afirmativa',             'Diálogo'],
  ['Rutina',                           'Diálogo'],
  ['Uso en contexto',                  'Diálogo'],
  ['Intercambio comercial',            'Diálogo'],
  ['Presentación completa',            'Diálogo'],
  ['Orden presentación',               'Diálogo'],
  ['Frase clave',                      'Diálogo'],
  ['Fórmula cortesía',                 'Diálogo'],
  ['Contexto real',                    'Diálogo'],
  ['Desafío integral',                 'Diálogo'],
  ['Saludo comercial',                 'Diálogo'],

  // Rule 13: Gramática
  ['Gramática',                        'Gramática'],
  ['Gramática fina',                   'Gramática'],
  ['Estructura básica',                'Gramática'],
  ['Patrón は～です',                   'Gramática'],
  ['Orden de oración',                 'Gramática'],
  ['Conector',                         'Gramática'],
  ['Negación casual',                  'Gramática'],
  ['Negación formal',                  'Gramática'],
  ['Sufijo ~人',                       'Gramática'],
  ['Prefijo honorífico',               'Gramática'],
  ['Regla なに/なん',                   'Gramática'],
  ['どんな',                            'Gramática'],
  ['Uso de の',                         'Gramática'],
  ['Uso de も',                         'Gramática'],
  ['Demostrativos',                    'Gramática'],

  // Rule 14: Vocabulario (fallback)
  ['Vocabulario',                      'Vocabulario'],
  ['Vocabulario países',               'Vocabulario'],
  ['Saludo',                           'Vocabulario'],
  ['Nacionalidad',                     'Vocabulario'],
];

let passed = 0;
let failed = 0;
for (const [input, expected] of cases) {
  const result = mapTag(input);
  if (result === expected) {
    passed++;
  } else {
    console.error(`FAIL: "${input}"\n      expected "${expected}", got "${result}"`);
    failed++;
  }
}
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
