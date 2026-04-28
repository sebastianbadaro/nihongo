# Tag Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar los 260 tags distintos del campo `cat` en los 12 JSON de unidades por 14 tags globales definidos en el spec.

**Architecture:** Script Node.js (`scripts/migrate-tags.js`) que aplica reglas de mapeo en orden, imprime un reporte dry-run y —con `--write`— sobreescribe los JSON. No hay cambios en HTML/JS; el campo sigue llamándose `cat`.

**Tech Stack:** Node.js (built-in `fs`, `path`, `assert` — sin dependencias externas)

---

### Task 1: Escribir tests para `mapTag` (deben fallar)

**Files:**
- Create: `scripts/migrate-tags.test.js`

- [ ] **Step 1: Crear el archivo de tests**

```js
// scripts/migrate-tags.test.js
const assert = require('assert');
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
  ['Distinción adj.',                  'Adjetivos'],   // excepción explícita

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

  // Rule 12: Diálogo (antes de Gramática para que "Orden presentación" no quede en Gramática)
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
```

- [ ] **Step 2: Ejecutar tests — deben fallar con "Cannot find module"**

```bash
node scripts/migrate-tags.test.js
```

Salida esperada: `Error: Cannot find module './migrate-tags'`

---

### Task 2: Implementar `mapTag` y pasar los tests

**Files:**
- Create: `scripts/migrate-tags.js`

- [ ] **Step 1: Crear el archivo con la función**

```js
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
  // Rule 12: Diálogo (antes de Gramática: "Orden presentación" debe ser Diálogo, no Gramática)
  if (/Di[aá]logo|Situaci[oó]n|Reacci[oó]n|Respuesta|Rutina|Uso en contexto|Intercambio|Entrega del|Presentaci[oó]n completa|Orden presentaci[oó]n|Frase clave|F[oó]rmula|Contexto real|Desaf[ií]o|Saludo comercial/i.test(tag)) return 'Diálogo';
  // Rule 13: Gramática
  if (/Estructura|Patr[oó]n|Orden|Conector|Negaci[oó]n|Demostrativos|Sufijo|Prefijo|Gram[aá]tica|Uso de の|Regla|どんな|Uso de も|Extensi[oó]n|Restricci[oó]n/i.test(tag)) return 'Gramática';
  // Rule 14: Vocabulario (fallback)
  return 'Vocabulario';
}

module.exports = { mapTag, GLOBAL_TAGS };
```

- [ ] **Step 2: Ejecutar tests — deben pasar todos**

```bash
node scripts/migrate-tags.test.js
```

Salida esperada: `N passed, 0 failed` (N = número total de casos de test).  
Si alguno falla, ajustar la regex correspondiente hasta que todos pasen.

- [ ] **Step 3: Commit**

```bash
git add scripts/migrate-tags.js scripts/migrate-tags.test.js
git commit -m "feat: add mapTag function with tests for 14 global tag taxonomy"
```

---

### Task 3: Agregar runner de migración (dry-run + --write)

**Files:**
- Modify: `scripts/migrate-tags.js` — agregar función `main()` al final del archivo

- [ ] **Step 1: Agregar `main()` al final de `scripts/migrate-tags.js`**

Añadir después del `module.exports`:

```js
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
      for (const q of questions) q.cat = tagMap[q.cat];
      fs.writeFileSync(filePath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
    }
    console.log('\n✅ Migración aplicada a todos los archivos.');
  } else {
    console.log('\n(Dry-run — para aplicar: node scripts/migrate-tags.js --write)');
  }
}

if (require.main === module) main();
```

- [ ] **Step 2: Ejecutar dry-run y revisar la sección "Cayeron a Vocabulario"**

```bash
node scripts/migrate-tags.js
```

Revisar la sección `⚠️ Cayeron a Vocabulario por fallback`. Los siguientes tags son **esperados** en Vocabulario (no requieren acción):

```
"Etimología", "Idioma y traducción", "Objetos perdidos", "Palabra cortesía",
"Palabras listadas", "Pedido múltiple", "Pregunta cantidad", "Pregunta país",
"Pregunta hobby", "Pregunta nombre", "Pregunta sí/no", "Pregunta trabajo",
"Pregunta tipo comida", "Rechazo alternativo", "Saludo", "Significado palabra",
"Tipo de comida", "Traducción", "Traducción N の N", "Vocabulario bebidas",
"Vocabulario comida", "Vocabulario complementario", "Vocabulario extra",
"Vocabulario países", "Vocabulario restaurante", "Vocabulario sutil",
"Vocabulario trabajo", "そうですね"
```

Si aparece algún tag que **no** debería ser Vocabulario, ajustar la regex correspondiente en `mapTag` y volver a correr los tests y el dry-run.

---

### Task 4: Aplicar la migración y validar

- [ ] **Step 1: Aplicar con --write**

```bash
node scripts/migrate-tags.js --write
```

Salida esperada: `✅ Migración aplicada a todos los archivos.` + resumen con Total = 1190.

- [ ] **Step 2: Verificar que no quedan tags viejos en los JSON**

```bash
node -e "
const fs = require('fs'), path = require('path');
const { GLOBAL_TAGS } = require('./scripts/migrate-tags');
const valid = new Set(GLOBAL_TAGS);
const files = fs.readdirSync('unidades').filter(f => f.endsWith('.json'));
let ok = true;
for (const f of files) {
  const qs = JSON.parse(fs.readFileSync(path.join('unidades', f)));
  for (const q of qs) {
    if (!valid.has(q.cat)) { console.error('INVALID:', f, q.id, q.cat); ok = false; }
  }
}
if (ok) console.log('OK — todos los tags son válidos');
"
```

Salida esperada: `OK — todos los tags son válidos`

- [ ] **Step 3: Commit**

```bash
git add unidades/
git commit -m "migrate: recategorize all questions into 14 global tags"
```

---

### Task 5: Commit del script de migración

- [ ] **Step 1: Agregar el script al commit de herramientas**

```bash
git add scripts/
git commit -m "chore: add tag migration script (keep for future re-runs)"
```
