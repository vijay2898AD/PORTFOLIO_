import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Html, Stars } from '@react-three/drei'
import * as THREE from 'three'

// --- Data for our portfolio sections ---
const portfolioSections = {
  projects: {
    title: 'Projects',
    content: "Here I would list my best work, with links to live demos and source code. Each project would have a short, impactful description.",
  },
  skills: {
    title: 'Skills',
    content: "A showcase of my technical abilities: JavaScript (ES6+), React, Three.js, Node.js, GLSL, and more. I love solving complex problems.",
  },
  contact: {
    title: 'Contact',
    content: "Let's connect! You can reach me via email at vijayvipparthi8030@email.com or on LinkedIn. I'm always open to new opportunities.",
  },
};

// --- Main 3D Model (Generative Art Core) ---
function GenerativeCore({ onClick, isPaused }) {
  const pointsRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (!isPaused) {
      pointsRef.current.rotation.y += delta * 0.1
      pointsRef.current.rotation.x += delta * 0.05
    }
    const targetSize = hovered ? 1.8 : 1.5
    pointsRef.current.material.size = THREE.MathUtils.lerp(pointsRef.current.material.size, targetSize, 0.1)
  })

  return (
    <points 
      ref={pointsRef} 
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <torusKnotGeometry args={[2, 0.6, 256, 32]} />
      <pointsMaterial color="#87ceeb" size={1.5} sizeAttenuation={false} />
    </points>
  )
}

// --- Satellite Objects with Corrected Label Animation ---
function Satellite({ position, color, text, onClick, isActive, isPaused }) {
  const groupRef = useRef()
  const htmlRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const homePosition = new THREE.Vector3(...position)

    if (!isPaused) {
      const t = state.clock.getElapsedTime() * 0.5
      groupRef.current.position.x = position[0] * Math.cos(t)
      groupRef.current.position.z = position[0] * Math.sin(t)
    } 
    else if (isActive) {
      groupRef.current.position.lerp(homePosition, 0.1)
    }

    const targetScale = isActive ? 1.8 : 1.0
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

    if (htmlRef.current) {
      const targetFontSize = isActive ? 32 : 14
      const targetY = isActive ? -400 : -50

      const currentFontSize = parseFloat(htmlRef.current.style.fontSize) || 14
      const currentTransform = htmlRef.current.style.transform || 'translate(-50%, -50%)'
      const currentY = parseFloat(currentTransform.split(',')[1]) || -50

      const newFontSize = THREE.MathUtils.lerp(currentFontSize, targetFontSize, 0.1)
      const newY = THREE.MathUtils.lerp(currentY, targetY, 0.1)

      htmlRef.current.style.fontSize = `${newFontSize}px`
      htmlRef.current.style.transform = `translate(-50%, ${newY}%)`
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <Sphere
        args={[0.8, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial color={color} emissive={hovered ? color : 'black'} roughness={0.2} />
      </Sphere>
      <Html distanceFactor={12}>
        <div ref={htmlRef} className="satellite-label" style={{ color: 'white', pointerEvents: 'none', transform: `translate(-50%, -50%)`, whiteSpace: 'nowrap', fontSize: '14px' }}>{text}</div>
      </Html>
    </group>
  )
}

// --- Animated Camera Controller ---
function AnimatedCamera({ activeSection }) {
  useFrame((state) => {
    const targetPosition = new THREE.Vector3()
    const lookAtTarget = new THREE.Vector3()
    const orbitRadius = 8;

    if (activeSection === 'projects') {
      targetPosition.set(orbitRadius, 1, 8)
      lookAtTarget.set(orbitRadius, 0, 0)
    } else if (activeSection === 'skills') {
      targetPosition.set(-orbitRadius, 1, 8)
      lookAtTarget.set(-orbitRadius, 0, 0)
    } else if (activeSection === 'contact') {
      targetPosition.set(0, 0, 8)
      lookAtTarget.set(0, 0, 0)
    } else {
      targetPosition.set(0, 2, 18)
      lookAtTarget.set(0, 0, 0)
    }
    
    state.camera.position.lerp(targetPosition, 0.02)
    state.camera.lookAt(lookAtTarget)
    state.camera.updateProjectionMatrix()
  })
  return null
}

// --- Main App Component ---
export default function App() {
  const [activeSection, setActiveSection] = useState(null)
  const data = activeSection ? portfolioSections[activeSection] : null;
  const isScenePaused = activeSection === 'projects' || activeSection === 'skills';

  return (
    <>
      <div className="text-overlay">
        <div className="header">
          <h1>Vijay Vipparthi</h1>
          <p>Creative Web Developer</p>
          
          {/* --- THIS IS THE NEW SECTION WITH THE ICON BUTTONS --- */}
          <div className="social-links">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.75c0-1.4-1.1-2.5-2.5-2.5S11 12.85 11 14.25V19h-3v-9h2.9v1.3a3.11 3.11 0 012.6-1.4c2.5 0 4.5 2 4.5 4.5V19z"></path></svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
            </a>
            <a href="/resume.pdf" download className="icon-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"></path></svg>
            </a>
          </div>

        </div>
        {data && (
          <div className="content">
            <h2>{data.title}</h2>
            <p>{data.content}</p>
          </div>
        )}
      </div>
      <div className="nav-overlay">
        <button onClick={() => setActiveSection('projects')}>Projects</button>
        <button onClick={() => setActiveSection('skills')}>Skills</button>
        <button onClick={() => setActiveSection('contact')}>Contact</button>
        {activeSection && <button onClick={() => setActiveSection(null)}>Back to Center</button>}
      </div>
      <Canvas camera={{ position: [0, 2, 18], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        
        <Stars radius={200} depth={50} count={5000} factor={6} saturation={0} fade speed={1} />

        <Suspense fallback={null}>
          <GenerativeCore 
            onClick={() => setActiveSection('contact')} 
            isPaused={isScenePaused}
          />
          <Satellite 
            position={[8, 0, 0]} 
            color="orange" 
            text="Projects" 
            onClick={() => setActiveSection('projects')} 
            isActive={activeSection === 'projects'}
            isPaused={isScenePaused}
          />
          <Satellite 
            position={[-8, 0, 0]} 
            color="dodgerblue" 
            text="Skills" 
            onClick={() => setActiveSection('skills')}
            isActive={activeSection === 'skills'}
            isPaused={isScenePaused}
          />
        </Suspense>
        
        <AnimatedCamera activeSection={activeSection} />
      </Canvas>
    </>
  )
}