# Tag Taxonomy — Recategorización global de preguntas

**Fecha:** 2026-04-28  
**Estado:** Aprobado

## Contexto

Los archivos JSON de unidades (`unidades/u*.json`) tienen 1190 preguntas distribuidas en 260 tags distintos en el campo `cat`. Ese número hace que el dropdown de filtro en `revision.html` sea inutilizable y los badges en `index.html` sean inconsistentes.

El objetivo es consolidar esos 260 tags en 14 tags globales que sean útiles para filtrar por tipo de pregunta y para identificar de un vistazo qué habilidad evalúa cada pregunta.

## Los 14 tags globales

| Tag | Qué evalúa |
|-----|-----------|
| `Kanji → Lectura` | Leer kanji en voz alta (pronunciación/furigana) |
| `Kanji → Significado` | Saber el significado en español de un kanji o palabra kanji |
| `Katakana` | Lectura y significado de palabras en katakana |
| `Vocabulario` | Palabras, frases hechas, saludos, expresiones de cortesía |
| `Partículas` | Uso, elección y distinción de partículas gramaticales |
| `Verbos` | Formas verbales, conjugación, grupos verbales, あります/います |
| `Adjetivos` | Tipos い/な, formas negativas, intensificadores, concordancia |
| `Gramática` | Estructuras oracionales, patrones, orden, conectores, negación, sufijos/prefijos gramaticales, demostrativos |
| `Contadores` | Uso de contadores (~階, ~つ, ~本, etc.) |
| `Números y Tiempo` | Números, precios, horas, minutos, días, meses, fechas, edad |
| `Traducción ES→JP` | Construir una expresión en japonés a partir de español |
| `Traducción JP→ES` | Entender una oración/frase japonesa y producir su equivalente en español |
| `Diálogo` | Respuestas situacionales, contexto real, rutinas, reacciones, intercambios |
| `Distinción` | Trampas, pares confusos, diferencias sutiles, formal vs casual |

## Reglas de mapeo

Las reglas se aplican en orden; la primera que coincide gana.

### 1. Distinción (aplicar primero)
Si el tag actual contiene alguna de estas palabras → `Distinción`:
`trampa`, `sutil`, `distinción`, `distincion`, `confus`, `formal vs`, `pares`, `matiz`, `cultural`

Excepción: si el tag es `Distinción adj.` (sobre tipos de adjetivo) → `Adjetivos`.

### 2. Números y Tiempo
Tags que contengan: `hora`, `時`, `分`, `días`, `dias`, `día`, `meses`, `mes`, `fecha`, `edad`, `número`, `numero`, `precio`, `lectura ～`

También los tags explícitos: `Días: Kanji→Español`, `Días: Kanji→Lectura`, `Días: Español→Kanji`, `Días - irregular`, `Días - regla`, `Días - normal`, `Meses`, `Lectura ～時`, `Lectura ～分`, `Números`, `Números grandes`, `Números precios`, `Leer hora`.

> Aclaración: `Lectura ～時` y `Lectura ～分` → `Números y Tiempo` (no `Kanji → Lectura`), porque el contenido es tiempo.

### 3. Contadores
Tags que contengan: `contador`, `Contador`

### 4. Katakana
Tags que contengan: `katakana`, `Katakana`

### 5. Partículas
Tags que contengan: `partícula`, `particula`, `partículas`

### 6. Traducción ES→JP
Tags que contengan: `ES→JP`, `ES→JA`, `Español→Japonés`, `Español→Kanji`

### 7. Traducción JP→ES
Tags que contengan: `JP→ES`, `JA→ES`, `Japonés→Español`; también `Kanji→Español` cuando la pregunta pide traducir una oración completa.

> Nota para el script: `Kanji→Español` (una sola palabra) → `Kanji → Significado`; `Traducción JP→ES`, `Traducción JA→ES` → `Traducción JP→ES`.

### 8. Kanji → Lectura
Tags que contengan: `Kanji→Lectura`, `Kanji→lectura`; también `Verbo: Kanji→Lectura`, `Adj.い: Kanji→Lectura`, `Adj.な: Kanji→Lectura`, `Adj.: Kanji→Lectura`, `Lectura especial`, `Kanji→Lectura carne`.

### 9. Kanji → Significado
Tags que contengan: `Kanji→Español`, `Kanji→español`; también variantes de adjetivos (`Adj.い: Kanji→Español`, `Adj. clima: Kanji→Español`, etc.), `Japonés→Español` (palabra suelta), `Adj.な: Japonés→Español`, `Adj. sabor: Japonés→Español`.

### 10. Verbos
Tags: `Forma V`, `Grupo verbal`, `あります`, `います`, `Forma formal` (cuando refiere a verbo).

### 11. Adjetivos
Tags que contengan: `Adj.`, `Adj `, `adjetivo`, `Intensificador`, `Tipo de adjetivo`.

### 12. Gramática
Tags: `Estructura`, `Patrón`, `Orden`, `Conector`, `Negación`, `Demostrativos`, `Sufijo`, `Prefijo`, `Gramática`, `Uso de の`, `Patrón は～です`, `Patrón NやNなど`, `Patrón どこへもVません`, `Patrón 何もVません`, `Regla`, `どんな`, `Uso de も`, `Extensión`, `Estructura ~のN`, `Estructura N の N`.

### 13. Diálogo
Tags: `Diálogo`, `Dialogo`, `Situación`, `Situacion`, `Reacción`, `Respuesta`, `Rutina`, `Uso en contexto`, `Saludo comercial`, `Intercambio comercial`, `Entrega del producto`, `Presentación completa`, `Orden presentación`, `Frase clave`, `Fórmula cortesía`, `Matiz cultural` (si no cayó en Distinción), `Contexto real`, `Desafío integral`.

### 14. Vocabulario (fallback)
Todo lo que no haya caído en ninguna regla anterior.

## Implementación

- **Archivos afectados:** `unidades/u1a.json` … `unidades/u4c.json` (12 archivos, 1190 preguntas)
- **Campo:** `cat` (string) — se sobreescribe con el tag global; nombre del campo no cambia
- **Método:** script Node.js de migración que aplica las reglas en orden y sobreescribe los JSON
- **Sin cambios en HTML/JS:** el campo sigue siendo `cat`, el dropdown y el badge funcionan igual
- **Validación:** el script imprime un reporte de qué tag viejo → tag nuevo para revisión manual antes de guardar

## Criterio de éxito

- Todos los `cat` en los 12 JSON pertenecen exactamente a uno de los 14 tags globales
- El dropdown de `revision.html` muestra exactamente 14 opciones (más "Todas las categorías")
- Ninguna pregunta queda sin tag
