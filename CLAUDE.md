# Instrucciones para Claude Code

Este repositorio genera Reels (1080×1920, 30 fps) con la voz grabada del usuario. Si el usuario te pasa **referencias** (videos o capturas), ayúdale a convertirlas en su propio video.

## Flujo de trabajo

1. **Guion primero.** Antes de construir nada, escribe el guion (frases cortas, tono cercano, con *palabras clave* entre asteriscos) y muéstraselo. Guárdalo como `explicativos/<video>/GUION-para-leer.txt` para que lo lea al grabar.
2. **Audio.** Todos los audios van en una sola carpeta: `explicativos/audios/<video>.m4a`. El `guion.json` los referencia con `"voz_propia": "../audios/<video>.m4a"`. No crees carpetas de audio por video.
3. **Diseño.** Cada video debe tener un diseño distinto y dinámico. Si las referencias piden algo nuevo, crea un componente en `explicativos/remotion/`, regístralo en `Root.jsx`, añade su mapa de sonidos en `explicativos/tiempos-<nombre>.js` y conéctalo en `generar.js` (selección por `guion.diseno` / `guion.escenas`).
4. **Render.** `npm run video -- <carpeta>`. Usa `--solo-props` para revisar tiempos y `--cuadro f1,f2` para ver cuadros antes del render completo.
5. **Revisión.** Comprueba cuadros clave, que no haya solapes de texto y que el audio quede a ≈ −14 LUFS. Di con honestidad qué verificaste y qué no (por ejemplo, si no escuchaste el audio).

## Piezas clave

- `explicativos/generar.js`: lee `guion.json`, detecta silencios, transcribe cada frase con Whisper y calcula los tiempos. El texto del guion manda sobre lo que Whisper entienda.
- `explicativos/tiempos-*.js`: efectos de sonido sintetizados (`whoosh, pop, ding, hit, click, tick, swipe, impact, shimmer, reverse, drop, riser`) sincronizados con palabras.
- `explicativos/remotion/*.jsx`: un diseño por archivo. Las constantes de color van arriba; las escenas se agrupan con `grupos` en el guion.
- Zonas seguras de Reels: evita poner texto importante en los bordes superior e inferior, donde la interfaz de Instagram lo tapa.

## Reglas

- No subas `.env`, audios personales ni videos renderizados al repositorio (ya están en `.gitignore`).
- Los `build/` por video se pueden regenerar y se pueden borrar para ahorrar espacio.
