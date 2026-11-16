import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const DIR = resolve(import.meta.dirname, '..', 'assets', 'sfx')

// Sonidos sintetizados con FFmpeg: sin descargas ni problemas de licencia.
const SONIDOS = {
  whoosh: { dur: 0.7, fx: 'anoisesrc=d=0.7:c=pink:a=0.9,highpass=f=400,lowpass=f=5000,afade=t=in:d=0.3,afade=t=out:st=0.3:d=0.4,volume=0.8' },
  pop: { dur: 0.15, fx: 'sine=f=720:d=0.15,afade=t=out:st=0.02:d=0.13,volume=0.9' },
  ding: { dur: 0.9, fx: 'sine=f=1568:d=0.9,afade=t=out:st=0.02:d=0.88,volume=0.45' },
  hit: { dur: 0.5, fx: 'sine=f=55:d=0.5,afade=t=out:st=0.03:d=0.47,volume=1.6' },
  click: { dur: 0.05, fx: "aevalsrc='(random(0)*2-1)*exp(-140*t)*0.7+0.4*sin(2*PI*1800*t)*exp(-160*t)':d=0.05:s=44100" },
  tick: { dur: 0.05, fx: "aevalsrc='0.55*sin(2*PI*2600*t)*exp(-170*t)':d=0.05:s=44100" },
  swipe: { dur: 0.4, fx: 'anoisesrc=d=0.4:c=pink:a=0.8,highpass=f=1200,lowpass=f=7500,afade=t=in:d=0.14,afade=t=out:st=0.14:d=0.26,volume=0.7' },
  impact: { dur: 0.8, fx: "aevalsrc='0.9*sin(2*PI*(45+70*exp(-20*t))*t)*exp(-5*t)+0.25*(random(0)*2-1)*exp(-45*t)':d=0.8:s=44100" },
  shimmer: { dur: 1.3, fx: "aevalsrc='0.22*(sin(2*PI*2093*t)+0.6*sin(2*PI*3136*t)+0.4*sin(2*PI*4186*t))*exp(-3.6*t)*min(1,t*40)':d=1.3:s=44100" },
  reverse: { dur: 0.6, fx: 'anoisesrc=d=0.6:c=pink:a=0.9,highpass=f=500,lowpass=f=6500,afade=t=in:d=0.1,afade=t=out:st=0.1:d=0.5,areverse,volume=0.8' },
  drop: { dur: 1.1, fx: "aevalsrc='sin(2*PI*(32+90*exp(-4.5*t))*t)*exp(-2.4*t)':d=1.1:s=44100" },
  riser: { dur: 1.2, fx: 'anoisesrc=d=1.2:c=white:a=0.5,highpass=f=1500,afade=t=in:d=1.1,afade=t=out:st=1.1:d=0.1' },
}

export const TIPOS_SFX = Object.keys(SONIDOS)

const correr = (args, captura = false) =>
  new Promise((ok, fail) => {
    const p = spawn('ffmpeg', args)
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (c) => (c === 0 ? ok(err) : fail(new Error(err.slice(-200)))))
  })

// Cada sonido se normaliza a un pico de -3 dB: así el "vol" del plan (0.1-0.5) significa lo mismo para todos.
async function generar(nombre, { fx }, ruta) {
  const crudo = ruta.replace(/\.wav$/, '.crudo.wav')
  try {
    await correr(['-y', '-f', 'lavfi', '-i', fx, '-ar', '44100', '-ac', '2', crudo])
    const info = await correr(['-hide_banner', '-i', crudo, '-af', 'volumedetect', '-f', 'null', '-'])
    const pico = Number(/max_volume: (-?[\d.]+) dB/.exec(info)?.[1] ?? -3)
    await correr(['-y', '-i', crudo, '-af', `volume=${(-3 - pico).toFixed(2)}dB`, '-ar', '44100', '-ac', '2', ruta])
  } catch (e) {
    throw new Error(`no pude generar el sonido ${nombre}: ${e.message}`)
  } finally {
    rmSync(crudo, { force: true })
  }
}

export async function rutaSfx(tipo) {
  mkdirSync(DIR, { recursive: true })
  const ruta = resolve(DIR, `${tipo}.wav`)
  if (!existsSync(ruta)) await generar(tipo, SONIDOS[tipo], ruta)
  return ruta
}
