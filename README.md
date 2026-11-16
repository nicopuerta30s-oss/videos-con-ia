# Videos con IA

Herramienta para crear **Reels animados (1080×1920)** con **tu propia voz** usando IA.
Grabas el audio con el celular y la herramienta hace el resto:

1. Transcribe tu voz (Whisper, local, gratis).
2. Corta los silencios y detecta cuándo dices cada palabra.
3. Sincroniza animaciones, subtítulos con palabras clave resaltadas y efectos de sonido.
4. Renderiza el MP4 final con el audio normalizado (−14 LUFS) listo para Instagram.

Incluye **11 diseños distintos** (explicativo, cinético, producto, mercado, Bauhaus, panel, perfume, estudio, balanza, mano…) hechos con [Remotion](https://www.remotion.dev) (React).

## ¿Quieres un video y no sabes por dónde empezar?

**Súbeme tus referencias** (videos o capturas de Reels que te gusten) y yo te ayudo a convertirlas en tu propio video: escríbeme por Instagram a **[@nicopuerta_30](https://instagram.com/nicopuerta_30)** o abre un *Issue* en este repositorio con tu referencia y tu idea.

La herramienta está pensada para trabajarse junto a un asistente de IA como [Claude Code](https://claude.com/claude-code): le pasas la referencia, le dices de qué trata tu video y él crea el guion, el diseño y el render. El archivo [`CLAUDE.md`](CLAUDE.md) le explica cómo funciona todo.

## Requisitos

- macOS (usa `say` para voces de prueba; en otros sistemas usa tu propia voz grabada)
- [Node.js](https://nodejs.org) 20 o superior
- [FFmpeg](https://ffmpeg.org) y [whisper.cpp](https://github.com/ggml-org/whisper.cpp)

```bash
brew install node ffmpeg whisper-cpp
```

## Instalación

```bash
git clone https://github.com/nicopuerta30s-oss/videos-con-ia.git
cd videos-con-ia
npm install

# Modelo de Whisper (≈ 470 MB)
curl -L -o models/ggml-small.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin
```

## Tu primer video

Cada video es una carpeta con un `guion.json`. Prueba el ejemplo (voz del sistema, sin grabar nada):

```bash
npm run video -- ejemplo
```

El MP4 queda dentro de `explicativos/ejemplo/`.

### Con tu propia voz

1. Graba tu audio leyendo el guion y guárdalo en `explicativos/audios/mi-video.m4a`.
2. Crea la carpeta `explicativos/mi-video/` con un `guion.json`:

```json
{
  "titulo": "Mi primer video",
  "diseno": "mano",
  "escenas": "mano",
  "marca": "TU MARCA",
  "voz_propia": "../audios/mi-video.m4a",
  "frases": [
    { "texto": "¿Sabías que puedes hacer *videos* con tu propia *voz*?" },
    { "texto": "Solo grabas el audio y la *IA* hace el resto." }
  ]
}
```

Las palabras entre `*asteriscos*` se resaltan en los subtítulos.

3. Renderiza:

```bash
npm run video -- mi-video
```

### Opciones útiles

| Opción | Qué hace |
|---|---|
| `--solo-props` | Calcula tiempos y guion sin renderizar (rápido, para revisar) |
| `--cuadro 30,120,300` | Exporta cuadros sueltos para revisar el diseño |
| `inicio`, `pausaEscena`, `cola`, `lufs`, `tempo` | Parámetros del `guion.json` para ajustar ritmo y volumen |
| `grupos` | Une varias frases en una misma escena, ej. `[[0],[1],[2,3]]` |

## Diseños disponibles

`explicativo`, `pro`, `cinetico`, `producto`, `mercado`, `bauhaus`, `panel`, `perfume`, `estudio`, `balanza`, `mano`.
Se eligen con `"diseno"` en el `guion.json`. Cada uno vive en `explicativos/remotion/` y puedes editarlos o crear el tuyo.

## Voz con ElevenLabs (opcional)

Si no quieres grabar tu voz, copia `.env.example` a `.env`, pon tu `ELEVENLABS_API_KEY` y crea `explicativos/voz.json`:

```json
{ "proveedor": "elevenlabs", "voice_id": "TU_VOICE_ID" }
```

## Estructura

```
explicativos/
  generar.js        # pipeline completo: voz → tiempos → render
  tiempos-*.js      # efectos de sonido sincronizados por diseño
  remotion/         # los diseños (React)
  ejemplo/          # guion de ejemplo
  audios/           # aquí van tus grabaciones
src/                # transcripción (Whisper) y efectos de sonido (FFmpeg)
```

## Licencia

MIT. Úsala, modifícala y compártela. Si te sirve, cuéntame en [@nicopuerta_30](https://instagram.com/nicopuerta_30).
