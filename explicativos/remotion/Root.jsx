import React from 'react'
import { Composition } from 'remotion'
import { Explicativo } from './Explicativo.jsx'
import { Pro } from './Pro.jsx'
import { Cinetico } from './Cinetico.jsx'
import { Producto } from './Producto.jsx'
import { Mercado } from './Mercado.jsx'
import { Bauhaus } from './Bauhaus.jsx'
import { Panel } from './Panel.jsx'
import { Perfume } from './Perfume.jsx'
import { Estudio } from './Estudio.jsx'
import { Balanza } from './Balanza.jsx'
import { Mano_ } from './Mano.jsx'

export const Root = () => (
  <>
  <Composition
    id="Explicativo"
    component={Explicativo}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  <Composition
    id="Pro"
    component={Pro}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', transiciones: [], escenas: 'mcp', paleta: null, ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  <Composition
    id="Cinetico"
    component={Cinetico}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', usuario: null, transiciones: [], ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  <Composition
    id="Producto"
    component={Producto}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', usuario: null, transiciones: [], ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  <Composition
    id="Mercado"
    component={Mercado}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', usuario: null, transiciones: [], ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  <Composition
    id="Bauhaus"
    component={Bauhaus}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', usuario: null, transiciones: [], ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  <Composition
    id="Panel"
    component={Panel}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', usuario: null, transiciones: [], ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  <Composition
    id="Perfume"
    component={Perfume}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', usuario: null, transiciones: [], ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  <Composition
    id="Estudio"
    component={Estudio}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', usuario: null, transiciones: [], ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  <Composition
    id="Balanza"
    component={Balanza}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', usuario: null, transiciones: [], ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  <Composition
    id="Mano"
    component={Mano_}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{ frases: [], grupos: [], fps: 30, frames: 30, marca: '', usuario: null, transiciones: [], ancho: 1080, alto: 1920 }}
    calculateMetadata={({ props }) => ({ width: props.ancho, height: props.alto, fps: props.fps, durationInFrames: props.frames })}
  />
  </>
)
