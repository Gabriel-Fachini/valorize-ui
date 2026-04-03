import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Color, ShaderMaterial } from 'three'
import type { IUniform } from 'three'

interface SilkUniforms {
  uSpeed: { value: number }
  uScale: { value: number }
  uNoiseIntensity: { value: number }
  uColor: { value: Color }
  uRotation: { value: number }
  uTime: { value: number }
  [uniform: string]: IUniform
}

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;

uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  vec2 r = e * sin(e * texCoord);
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c) * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
    0.4 * sin(
      5.0 * (
        tex.x +
        tex.y +
        cos(3.0 * tex.x + 5.0 * tex.y) +
        0.02 * tOffset
      ) +
      sin(20.0 * (tex.x + tex.y - 0.1 * tOffset))
    );

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`

export interface SilkProps {
  speed?: number
  scale?: number
  color?: string
  noiseIntensity?: number
  rotation?: number
}

interface SilkSceneProps extends Required<SilkProps> {}

const SilkScene = ({ speed, scale, color, noiseIntensity, rotation }: SilkSceneProps) => {
  const materialRef = useRef<ShaderMaterial | null>(null)
  const { viewport } = useThree()

  const uniforms = useMemo<SilkUniforms>(() => ({
    uSpeed: { value: speed },
    uScale: { value: scale },
    uNoiseIntensity: { value: noiseIntensity },
    uColor: { value: new Color(color) },
    uRotation: { value: rotation },
    uTime: { value: 0 },
  }), [color, noiseIntensity, rotation, scale, speed])

  useFrame((state) => {
    if (!materialRef.current) return

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

const Silk = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
}: SilkProps) => {
  return (
    <Canvas
      dpr={1}
      frameloop="always"
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      camera={{ position: [0, 0, 1] }}
    >
      <SilkScene
        speed={speed}
        scale={scale}
        color={color}
        noiseIntensity={noiseIntensity}
        rotation={rotation}
      />
    </Canvas>
  )
}

export default Silk
