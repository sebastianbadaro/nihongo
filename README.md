# 日本語 Quiz — Dekiru Nihongo

Quiz interactivo modular para estudiar japonés, basado en el material del curso **Dekiru Nihongo**.

## 📁 Estructura del proyecto

```
.
├── index.html          # App principal (no tocar, es genérica)
├── manifest.json       # Lista de unidades disponibles
├── unidades/           # Preguntas en JSON, una por unidad
│   ├── u1a.json
│   ├── u1b.json
│   ├── u1c.json
│   ├── u2a.json
│   ├── u2b.json
│   ├── u2c.json
│   ├── u3a.json
│   ├── u3b.json
│   ├── u3c.json
│   ├── u4a.json
│   └── u4b.json
└── README.md
```

## ✨ Cómo funciona

- El `index.html` lee `manifest.json` al cargar y muestra un selector de unidades.
- Al elegir una unidad, descarga el JSON correspondiente desde `unidades/`.
- 30 preguntas al azar por sesión, opciones barajadas cada vez.
- Modo **🎲 Mezcla de todas las unidades** para repaso general.
- Al final muestra puntaje + repaso de errores.

## ➕ Cómo agregar una nueva unidad

### 1. Creá el archivo JSON en `unidades/`

Por ejemplo, `unidades/u5a.json`. El formato es un array de preguntas:

```json
[
  {
    "cat": "Kanji→Español",
    "q": "¿Qué significa 北?",
    "correct": "Norte",
    "opts": ["Norte", "Sur", "Este", "Oeste"]
  },
  {
    "cat": "Partícula",
    "q": "私___学生です。",
    "correct": "は",
    "opts": ["は", "が", "を", "の"]
  }
]
```

**Reglas del formato:**
- `cat`: categoría que se muestra como etiqueta arriba de la pregunta (string corto).
- `q`: texto de la pregunta.
- `correct`: la respuesta correcta (debe coincidir exactamente con una de las `opts`).
- `opts`: exactamente 4 opciones, sin duplicados.

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

Si querés cambiar cantidad de preguntas por sesión, abrí `index.html` y modificá la constante:

```javascript
const QUIZ_SIZE = 30;  // Cambiar a 20, 50, etc.
```

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
