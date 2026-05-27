# 日本語 Quiz — Dekiru Nihongo

Quiz interactivo modular para estudiar japonés, basado en el material del curso **Dekiru Nihongo**.

## 📁 Estructura del proyecto

```
.
├── index.html          # Página de inicio — descripción del proyecto y navegación
├── quiz.html           # Quiz de vocabulario (app principal)
├── listening.html      # App de listening con comprensión auditiva
├── revision.html       # Herramienta de revisión de preguntas
├── changelog.html      # Historial de cambios
├── config.html         # Configuración (modo oscuro, tamaño de quiz, etc.)
├── nav.js              # Navegación lateral compartida entre páginas
├── manifest.json       # Lista de unidades del quiz de vocabulario
├── unidades/           # Preguntas en JSON, una por unidad
│   ├── u1a.json … u5c.json
├── listening/          # Recursos del módulo de comprensión auditiva
│   ├── index.json      # Índice de niveles, unidades e historias
│   ├── data/           # Una historia por archivo JSON
│   │   ├── U1A-H01.json
│   │   ├── U2A-H01.json
│   │   ├── U2A-H03.json
│   │   ├── U3C-H01.json
│   │   ├── U5A-H02.json
│   │   └── U5A-H03.json
│   ├── audio/          # Archivos MP3, un archivo por variante
│   │   └── {HISTORIA_ID}-v{NN}.mp3
│   └── img/            # Imagen ilustrativa por historia (PNG)
│       └── {HISTORIA_ID}.png
└── README.md
```

## ✨ Cómo funciona

- `index.html` es la página de inicio: describe el proyecto y enlaza a todas las herramientas.
- `quiz.html` lee `manifest.json` al cargar y muestra un selector de unidades.
- Al elegir una unidad, descarga el JSON correspondiente desde `unidades/`.
- 30 preguntas al azar por sesión, opciones barajadas cada vez.
- El sistema prioriza errores anteriores y preguntas nuevas sobre las ya respondidas correctamente.
- Modo **🎲 Mezcla de todas las unidades** para repaso general.
- Al final muestra puntaje + repaso de errores.

## ➕ Cómo agregar una nueva unidad

### 1. Creá el archivo JSON en `unidades/`

Por ejemplo, `unidades/u5a.json`. El formato es un array de preguntas:

```json
[
  {
    "id": "U5A-001",
    "cat": "Kanji→Español",
    "q": "¿Qué significa 北?",
    "opts": [
      { "text": "Norte",  "correct": true,  "explanation": "Correcta. 北 (きた) = Norte. Es uno de los cuatro puntos cardinales básicos." },
      { "text": "Sur",    "correct": false, "explanation": "Sur es 南 (みなみ), no 北." },
      { "text": "Este",   "correct": false, "explanation": "Este es 東 (ひがし), no 北." },
      { "text": "Oeste",  "correct": false, "explanation": "Oeste es 西 (にし), no 北." }
    ]
  }
]
```

**Reglas del formato:**
- `id`: identificador único de la pregunta, formato `U{UNIDAD}-{NNN}` (ej. `U5A-001`). Se muestra en la herramienta de revisión para facilitar la identificación.
- `cat`: categoría que se muestra como etiqueta arriba de la pregunta (string corto).
- `q`: texto de la pregunta.
- `opts`: exactamente 4 opciones, cada una con:
  - `text`: texto de la opción.
  - `correct`: `true` para la respuesta correcta, `false` para las incorrectas.
  - `explanation`: justificación de por qué esa opción es correcta o incorrecta. Para la opción correcta conviene incluir también la explicación general del concepto.

### 2. Agregá la unidad al `manifest.json`

```json
{
  "unidades": [
    { "id": "u3a", "nombre": "Unidad 3A", "subtitle": "...", "file": "unidades/u3a.json", "total": 134 },
    { "id": "u5a", "nombre": "Unidad 5A", "subtitle": "Tu nueva unidad", "file": "unidades/u5a.json", "total": 90 }
  ]
}
```

### 3. Pusheá a GitHub

---

## 🎧 Módulo de Listening

### Cómo agregar una nueva historia

1. **Creá el archivo de datos** en `listening/data/{ID}.json` siguiendo el schema `dekiru-listening/historia-v1`.
2. **Agregá los audios** en `listening/audio/` con el formato `{ID}-v01.mp3` … `{ID}-v06.mp3`.
3. **Agregá la imagen** en `listening/img/{ID}.png`.
4. **Registrá la historia** en `listening/index.json` bajo el nivel y unidad correctos:

```json
{
  "historia_id": "U1A-H01",
  "titulo": "自己紹介",
  "titulo_es": "Autopresentación",
  "imagen": "img/U1A-H01.png",
  "archivo": "data/U1A-H01.json",
  "variantes": 6,
  "preguntas": 5
}
```

> **Nota:** la imagen debe estar en `.png` (no `.webp`). El campo `imagen` en el JSON de datos también debe coincidir.

### Historias actuales

| ID       | Unidad | Historia                    | Variantes | Preguntas | Audio |
|----------|--------|-----------------------------|-----------|-----------|-------|
| U1A-H01  | U1A    | 自己紹介 — Autopresentación  | 6         | 5         | ⏳ pendiente |
| U2A-H01  | U2A    | サカイ電器で — En la tienda de electrónica | 6 | 5   | ✅ |
| U2A-H03  | U2A    | レストラン — En el restaurante | 6        | 5         | ✅ |
| U3C-H01  | U3C    | 私の１週間 — Mi semana        | 6         | 5         | ✅ |
| U5A-H02  | U5A    | 週末の話 — Una salida de fin de semana | 6 | 5      | ✅ |
| U5A-H03  | U5A    | 楽しい一日 — Un día divertido | 6        | 5         | ✅ |

---

Listo, aparece automáticamente en el selector del quiz.

## 🚀 Deploy

### GitHub Pages

1. Creá un repo en GitHub y subí estos archivos.
2. En el repo: **Settings → Pages → Source** → elegí la rama (`main`) y carpeta (`/` root).
3. Tu quiz estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

### Netlify (drag & drop)

1. Entrá a [app.netlify.com](https://app.netlify.com).
2. Arrastrá la carpeta del proyecto a la ventana.
3. Te da una URL tipo `tu-quiz.netlify.app` en 5 segundos.

### Cloudflare Pages

1. Conectá el repo de GitHub a [pages.cloudflare.com](https://pages.cloudflare.com).
2. Build command: dejá vacío. Output directory: `/`.
3. Deploy automático en cada push.

## 🖥 Probar localmente

No se puede abrir con doble click porque los navegadores bloquean `fetch()` en `file://`. Tenés dos opciones:

### Con Python (lo más simple)

```bash
cd carpeta-del-proyecto
python3 -m http.server 8000
```

Abrí `http://localhost:8000` en el navegador.

### Con Node.js

```bash
npx serve .
```

## 🎨 Personalización

La cantidad de preguntas por sesión, la velocidad de audio predeterminada y otras opciones se configuran desde `config.html`.

## 📋 Changelog

### 2026-05-27 — Rediseño UI, landing page y reorganización de navegación
- Rediseño visual completo estética "Ink & Paper": paleta cálida (crema/bermellón/dorado), tipografía Lora + Noto Serif JP + Noto Sans JP
- Nueva página de inicio `index.html`: descripción del proyecto, cards de navegación, sección "Acerca del proyecto" con historia personal, aviso legal y contacto
- Quiz movido de `index.html` a `quiz.html`
- Navegación lateral (`nav.js`) actualizada: entrada "Inicio" agregada, "Quiz" apunta a `quiz.html`
- Módulo de listening reorganizado: Nivel 1 (Unidades 1–3), Nivel 2 (Unidades 4–5)
- Todas las subunidades agregadas a `listening/index.json` con nombres alineados al `manifest.json`, incluyendo las que aún no tienen historias
- Guías de uso (flujo con íconos) agregadas en quiz y listening
- Footer unificado en todas las páginas: solo crédito "Desarrollado por Sebastián Badaró" con enlace a LinkedIn

### 2026-05-26 — Nuevas historias de Listening
- Nueva historia: U2A-H03 レストラン — En el restaurante (Unidad 2A, 6 variantes, audio ✅)
- Nueva historia: U3C-H01 私の１週間 — Mi semana (nueva subunidad U3C, 6 variantes, audio ✅)
- `listening/index.json`: nueva entrada Unidad 3 con subunidad U3C para alojar historias de rutina diaria

### 2026-05-25 — Módulo de Listening
- Nuevo módulo `listening/` con app independiente (`listening.html`)
- Menú acordeón N5 → Unidad → Historia, con tarjetas de imagen y overlay degradado
- Reproductor de audio con barra de progreso, control de velocidad y sticky scroll
- Quiz de comprensión auditiva: 5 preguntas por historia, variantes aleatorias (6 por historia), respuesta global con explicaciones y transcript colapsable
- Seguimiento de variantes vistas en localStorage para no repetir hasta completar el ciclo
- 3 historias disponibles: U1A-H01 (audio pendiente), U5A-H02, U5A-H03
- Link al listening desde el footer de `index.html`

### 2026-05-18 — Unidades 5B y 5C
- Nueva unidad: 形容詞の過去・から — Pasado de adjetivos y conector から (60 preguntas)
- Nueva unidad: 好き・ほしい・〜たい — Gustos, deseos y forma たい (60 preguntas)
- Ambas agregadas al manifest bajo Nivel 2, Unidad 5

### 2026-05-07 — Unidad 5A
- Nueva unidad: 週末・食事 — Fin de semana, comidas y conectores (126 preguntas)
- Cubre lectura de kanji de tiempo y comidas, vocabulario de それから/そして/それで, gramática de conectores y partículas
- Agregada al manifest bajo Nivel 2, Unidad 5

### 2026-05-04 — Simplificación del formato de unidades
- Nuevo formato: `explanation` por opción reemplaza a `reason` (por opción) + `explanation` (top-level)
- Se eliminan los campos `correct` y `explanation` del nivel superior de cada pregunta
- La justificación de la opción correcta integra la explicación general del concepto
- El quiz y la revisión derivan el texto correcto directamente de `opts.find(o => o.correct).text`
- La búsqueda en revisión indexa `opts[].explanation` en lugar de `opts[].reason`

### 2026-05-03 — Justificación de respuestas
- El formato de los archivos de unidades incluía `explanation` (explicación general) y `reason` por cada opción
- Al responder en el quiz se mostraba la justificación de la opción elegida y la explicación de la pregunta, tanto si se acertó como si no
- La página de revisión (`revision.html`) mostraba el `reason` debajo de cada opción y la `explanation` al final de cada tarjeta
- La búsqueda en revisión incluía el texto de `reason` y `explanation` como campo indexado

### 2026-04-29 — Memoria de resultados entre sesiones
- Las preguntas respondidas incorrectamente reaparecen en el siguiente quiz (prioridad máxima)
- Las respondidas correctamente se excluyen del siguiente quiz
- Los resultados persisten en localStorage: aplica aunque se recargue la página o se vuelva otro día
- El progreso de cada unidad es independiente: hacer un quiz de U2B no borra el historial de U1A
- Si el pool no tiene suficientes preguntas no repetidas, se rellena con las correctas para no dejar el quiz incompleto

### 2026-04-28 — Tags globales
- Recategorización de 260 tags específicos a 14 categorías globales (`Kanji → Lectura`, `Kanji → Significado`, `Katakana`, `Vocabulario`, `Partículas`, `Verbos`, `Adjetivos`, `Gramática`, `Contadores`, `Números y Tiempo`, `Traducción ES→JP`, `Traducción JP→ES`, `Diálogo`, `Distinción`)
- Revisión y corrección manual de tags post-migración en todas las unidades

### 2026-04-26 — UI, contenido y performance
- Rediseño UI: estética japonesa moderna (tipografía, colores, layout)
- Menú acordeón por Nivel → Unidad → Sub-unidad en `index.html`
- Unidad 4C: 季節・料理 — clima, estaciones, sabores e intensificadores (115 preguntas)
- Lazy loading y render paginado (50 por página) en `revision.html`

### 2026-04-25 — Herramientas de estudio
- `revision.html`: herramienta de revisión con búsqueda por texto y filtro por categoría
- IDs únicos por pregunta (`U1A-001`, etc.) en todos los JSON
- Dark mode en `revision.html` con persistencia localStorage

### 2026-04-24 — Base del proyecto
- Quiz interactivo con 30 preguntas al azar por sesión, opciones barajadas
- Unidades 1A, 1B, 1C, 2A, 2B, 2C, 3A, 3B, 3C (434+ preguntas)
- Dark mode en `index.html` con persistencia localStorage

---

## 📝 Unidades actuales

| ID  | Nombre     | Contenido                                              | Preguntas |
|-----|------------|--------------------------------------------------------|-----------|
| 1A  | Unidad 1A  | 私の名前・国・仕事 — Nombre, país, trabajo              | 74        |
| 1B  | Unidad 1B  | 私の誕生日 — Edad, cumpleaños, meses, días              | 70        |
| 1C  | Unidad 1C  | 私の趣味 — Hobbies, と, も, 何ですか                    | 66        |
| 2A  | Unidad 2A  | どこですか — Ubicación, pisos, demostrativos de lugar   | 70        |
| 2B  | Unidad 2B  | いくらですか — Precios, これ/それ/あれ, Nをください       | 73        |
| 2C  | Unidad 2C  | レストラン — Contadores ~つ, 何の/どこの/誰のN           | 81        |
| 3A  | Unidad 3A  | 何時までですか — Hora, días de la semana                | 134       |
| 3B  | Unidad 3B  | 私のスケジュール — Vます, planes, partículas             | 110       |
| 3C  | Unidad 3C  | 毎日の生活 — Partículas に・で・を y rutinas             | 119       |
| 4A  | Unidad 4A  | Puntos cardinales, distancias, transporte              | 143       |
| 4B  | Unidad 4B  | Adjetivos い/な, どんな, あります                        | 135       |
| 4C  | Unidad 4C  | 季節・料理 — Clima, estaciones, sabores e intensificadores | 115       |
| 5A  | Unidad 5A  | 週末・食事 — Fin de semana, comidas y conectores           | 126       |
| 5B  | Unidad 5B  | 形容詞の過去・から — Pasado de adjetivos y conector から   | 60        |
| 5C  | Unidad 5C  | 好き・ほしい・〜たい — Gustos, deseos y forma たい         | 60        |
