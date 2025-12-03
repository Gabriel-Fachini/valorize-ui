import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/Button'
import { Play, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import * as THREE from 'three'

export const Hero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const isHoveringRef = useRef(isHovering)

  useEffect(() => {
    isHoveringRef.current = isHovering
  }, [isHovering])

  useEffect(() => {
    if (!mountRef.current) return

    // Get container dimensions
    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    // Scene Setup
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 6

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mountRef.current.appendChild(renderer.domElement)

    // Geometry (Cylinder for Coin)
    const geometry = new THREE.CylinderGeometry(2.2, 2.2, 0.25, 128, 1)

    // Create Textures for faces
    const createTexture = (
      text: string,
      color: string,
      bgColor: string,
      isBack: boolean = false
    ) => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Background
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, 512, 512)

        // If back face, flip context
        if (isBack) {
          ctx.translate(512, 0)
          ctx.scale(-1, 1)
        }

        // Outer Ring
        ctx.strokeStyle = color
        ctx.lineWidth = 20
        ctx.beginPath()
        ctx.arc(256, 256, 230, 0, Math.PI * 2)
        ctx.stroke()

        // Inner decoration
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.arc(256, 256, 210, 0, Math.PI * 2)
        ctx.stroke()

        // Text/Symbol
        ctx.fillStyle = color
        ctx.font = 'bold 240px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, 256, 276)

        // Add some noise/texture for gold effect
        const imageData = ctx.getImageData(0, 0, 512, 512)
        const data = imageData.data
        for (let i = 0; i < data.length; i += 4) {
          if (Math.random() > 0.95) {
            const noise = (Math.random() - 0.5) * 20
            data[i] = Math.min(255, Math.max(0, data[i] + noise))
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
          }
        }
        ctx.putImageData(imageData, 0, 0)
      }
      const texture = new THREE.CanvasTexture(canvas)
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      return texture
    }

    // Gold / Yellow Palette
    const coinBaseColor = '#D97706' // Amber 600 (Dark Gold for sides)
    const coinFaceBg = '#FCD34D' // Amber 300 (Bright Gold for face)
    const coinInk = '#92400E' // Amber 800 (Darker for engravings)

    const frontTexture = createTexture('$', coinInk, coinFaceBg, false)
    const backTexture = createTexture('V', coinInk, coinFaceBg, true)

    // Materials
    const materials = [
      // Side
      new THREE.MeshStandardMaterial({
        color: coinBaseColor,
        metalness: 0.8,
        roughness: 0.3,
      }),
      // Front
      new THREE.MeshStandardMaterial({
        map: frontTexture,
        metalness: 0.6,
        roughness: 0.4,
        color: 0xffffff,
      }),
      // Back
      new THREE.MeshStandardMaterial({
        map: backTexture,
        metalness: 0.6,
        roughness: 0.4,
        color: 0xffffff,
      }),
    ]

    const coin = new THREE.Mesh(geometry, materials)

    // Initial rotation
    coin.rotation.x = Math.PI / 2
    coin.rotation.z = Math.PI / 2

    scene.add(coin)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5)
    dirLight.position.set(5, 5, 10)
    scene.add(dirLight)

    const rimLight = new THREE.PointLight(0xfbbf24, 2) // Gold/Amber rim light
    rimLight.position.set(-5, -5, -5)
    scene.add(rimLight)

    // Interaction State
    const mouse = new THREE.Vector2()

    const onMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      if (!innerWidth || !innerHeight) return
      mouse.x = (event.clientX / innerWidth) * 2 - 1
      mouse.y = -(event.clientY / innerHeight) * 2 + 1
      if (!isHoveringRef.current) {
        setIsHovering(true)
      }
    }

    const onMouseLeave = (event: MouseEvent) => {
      if (event.relatedTarget === null) {
        setIsHovering(false)
        mouse.x = 0
        mouse.y = 0
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseout', onMouseLeave)

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate)

      if (isHoveringRef.current) {
        // Interactive rotation
        const targetX = Math.PI / 2 + mouse.y * 0.6
        coin.rotation.x += (targetX - coin.rotation.x) * 0.1

        const targetZ = Math.PI / 2 + mouse.x * 1.0
        coin.rotation.z += (targetZ - coin.rotation.z) * 0.1

        coin.rotation.y = mouse.x * 0.3
      } else {
        // Idle animation
        const time = Date.now() * 0.001
        coin.position.y = Math.sin(time * 1.5) * 0.15
        coin.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.1
        coin.rotation.z += 0.01
        coin.rotation.y = 0
      }

      renderer.render(scene, camera)
    }

    animate()

    const currentMount = mountRef.current

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout', onMouseLeave)
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      materials.forEach((m) => m.dispose())
      frontTexture.dispose()
      backTexture.dispose()
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-valorize-500/10 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-valorize-400 mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-valorize-500 animate-pulse" />
            Plataforma em Beta
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
            Transforme{' '}
            <span
              style={{
                background: 'linear-gradient(to right, #33E680, #00AD47)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              elogios
            </span>{' '}
            em cultura.
          </h1>

          <p className="text-xl text-zinc-200 mb-8 leading-relaxed max-w-lg">
            Valorize é a plataforma de reconhecimento que transforma sua cultura
            organizacional. Colaboradores trocam elogios por recompensas reais.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="group">
              Agendar Demonstração
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="group">
              <Play className="w-4 h-4 mr-2 fill-current" />
              Ver vídeo
            </Button>
          </div>

        </motion.div>

        {/* Right Content - 3D Interaction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center lg:justify-end relative"
        >
          {/* Container increased to 500x500 for better interaction area */}
          <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
            {/* Three.js Mount Point */}
            <div
              ref={mountRef}
              className="absolute inset-0 cursor-move active:cursor-grabbing z-10"
              title="Mova o mouse para girar a moeda"
            />

            {/* Floating Particles Behind */}
            <div className="absolute inset-0 pointer-events-none -z-10">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-yellow-500/20 blur-md"
                  style={{
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-zinc-300 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-zinc-500 flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-valorize-500" />
        </motion.div>
      </motion.div>
    </section>
  )
}
