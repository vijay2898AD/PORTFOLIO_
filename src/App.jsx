import { Suspense, useRef, useState, useEffect, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Html, Stars, Trail, OrbitControls, useProgress } from '@react-three/drei';
import * as THREE from 'three';

// --- Data for our portfolio sections (UPDATED with full details) ---
const portfolioSections = {
  about: {
    title: 'About Me',
    content: "I am a detail-oriented Front-End Developer passionate about building pixel-perfect, responsive web applications with modern technologies. I love bringing complex ideas to life in the browser.",
    details: {
      intro: "Hello! I'm Vijay, a developer driven by the intersection of technology and art. My journey into web development began with a fascination for bringing static designs to life. Today, I specialize in creating immersive and interactive web experiences.",
      bio: "I thrive on challenges and am constantly exploring new ways to push the boundaries of what's possible in the browser. Whether it's engineering a complex user interface with React, managing application state, or integrating an API, I am dedicated to delivering polished, high-quality work and am eager to learn from experienced developers. My goal is to contribute to projects that make a difference while continuing to grow my skills in frontend development and 3D graphics.",
    }
  },
  projects: {
    title: 'Projects',
    content: "Here I would list my best work, with links to live demos and source code. Each project would have a short, impactful description of my projects demonstrating my skills in web development, responsive UI design, and creating practical tools for developers.",
    details: {
      intro: "Below is a selection of projects that showcase my skills in frontend development, API integration, and user experience design. Each project includes a brief description, the technologies used, and links to live demos and source code repositories.",
      projectList: [
        {
          title: "README Generator",
          description: "A user-friendly, single-page application that helps developers quickly create professional and well-structured README files for their projects through an interactive form. Engineered an interactive form-based interface using React.js and React Hooks to dynamically generate Markdown content based on user input. Styled the entire application with Tailwind CSS, creating a clean, responsive, and intuitive user experience for seamless content creation. Implemented robust client-side validation to ensure all necessary fields are completed, enhancing the quality of the generated README files. Enabled users to easily copy the generated Markdown content to their clipboard with a single click, streamlining the process of integrating it into their projects.",
          tech: ["React.js", "Tailwind CSS", "JavaScript (ES6+)", "Git & GitHub", "Vercel"],
          liveUrl: "https://readme-generator-smoky.vercel.app/",
          codeUrl: "https://github.com/vijay2898AD/readme-generator"
        },
        {
          title: "PX to REM Converter",
          description: "A fast and intuitive web tool that allows developers to instantly convert pixel (PX) values to relative REM units, streamlining the process of creating scalable designs. Implemented real-time conversion logic using React.js and React Hooks (useState and useEffect) to ensure the output updates instantly as the user types. Wrote custom CSS3 from scratch to create a clean and minimalist design, using Flexbox and media queries to ensure the application is fully responsive across all device sizes. Added a user-friendly feature that allows users to copy the converted REM value to their clipboard with a single click, enhancing usability and efficiency.",
          tech: ["React.js", "CSS3", "JavaScript (ES6+)", "Git & GitHub", "Vercel"],
          liveUrl: "https://px-to-rem-converter-gilt.vercel.app/",
          codeUrl: "https://github.com/vijay2898AD/PX-to-REM-converter"
        },
        {
          title: "Hospital Management System",
          description: "A full-stack web application developed from scratch to manage patient data, doctor records, and appointment scheduling with role-based dashboards for Admins and Users.Front-End: Engineered a responsive and interactive user interface using React.js, solving the challenge of creating a dynamic doctor availability calendar and role-based dashboards (Admin/User). Back-End: Created a secure RESTful API using Node.js and Express.js to handle user authentication (for both patients and admins), appointment scheduling, and management of doctor records. Database: Designed and managed the application's database schema in MongoDB for efficiently storing and retrieving patient, doctor, and appointment data. Implemented Mongoose for schema validation and data modeling.",
          tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JavaScript (ES6+)", "Git & GitHub", "Netlify", ],
          liveUrl: "https://hospital-management-peach-xi.vercel.app/",
          codeUrl: "https://github.com/vijay2898AD/hospital-management"
        }
      ]
    }
  },
  skills: {
    title: 'Skills',
    content: "A showcase of my technical abilities in frontend technologies, component-based architecture, full-stack development and more. I love solving complex problems.",
    details: {
      intro: "With a strong foundation in modern web technologies, I specialize in creating performant and visually engaging user experiences.",
      categories: [
        { title: 'Frontend', skills: ['React.js', 'JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS'] },
        { title: 'Backend & Database', skills: ['Node.js', 'Express.js', 'MongoDB', 'API Integration'] },
        { title: 'Tools & Concepts', skills: ['Git', 'GitHub', 'npm', 'VS Code', 'vite', 'vercel'] },
        { title: 'Design & Concept', skills: ['GLSL Shaders', 'UI/UX Principles', 'Figma (Prototyping)', 'Blender (Basic Modeling)', 'Component-Based Architecture', 'State Management'] }
      ]
    }
  },
  contact: {
    title: 'Contact',
    content: "Let's connect! You can reach me via email at <a href='mailto:vijayvipparthi8030@email.com' style='color: white;'>vijayvipparthi8030@email.com</a> or on <a href='https://www.linkedin.com/in/vijay-vipparthi-dev/' target='_blank' rel='noopener noreferrer' style='color: white;'>LinkedIn</a>. I'm always open to new opportunities.",
    details: {
      intro: "Have a project in mind or just want to say hello? I'd love to hear from you. You can reach me via email, connect with me on social media, or check out my work below.",
    email: "vijayvipparthi8030@gmail.com",
    location: "Visakhapatnam, India",
    socials: [
      { name: "LinkedIn", url: "https://www.linkedin.com/in/vijay-vipparthi-dev/" },
      { name: "GitHub", url: "https://github.com/vijay2898AD" }
    ]
    } // Can be expanded later
  },
};

// --- Loading Screen Component ---
function LoadingScreen({ onLoaded }) {
  const { active } = useProgress();
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!active && minTimePassed) {
      onLoaded();
    }
  }, [active, minTimePassed, onLoaded]);

  return (
    <div className={`loading-screen ${(!active && minTimePassed) ? "loading-screen--hidden" : ""}`}>
      <div className="loading-screen__container">
        <h1 className="loading-screen__title">VIJAY VIPPARTHI</h1>
        <p className="loading-screen__progress">{animatedProgress}%</p>
      </div>
    </div>
  );
}

// --- Main 3D Model (Generative Art Core) ---
const GenerativeCore = forwardRef(({ onClick, isPaused }, ref) => {
  const [hovered, setHovered] = useState(false);
  useFrame((state, delta) => {
    if (!ref.current) return;
    if (!isPaused) {
      ref.current.rotation.y += delta * 0.1;
      ref.current.rotation.x += delta * 0.05;
    }
    const targetSize = hovered ? 1.8 : 1.5;
    ref.current.material.size = THREE.MathUtils.lerp(ref.current.material.size, targetSize, 0.1);
  });
  return (
    <points ref={ref} onClick={onClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <torusKnotGeometry args={[2, 0.6, 256, 32]} />
      <pointsMaterial color="#87ceeb" size={1.5} sizeAttenuation={false} />
    </points>
  );
});

// --- Satellite Objects with Trails ---
function Satellite({ occluderRef, position, color, text, onClick, isActive, isPaused, orbitRadius = 8, orbitOffset = 0 }) {
    const groupRef = useRef();
    const htmlRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!groupRef.current) return;
        const homePosition = new THREE.Vector3(...position);
        if (!isPaused) {
            const t = state.clock.getElapsedTime() * 0.5;
            groupRef.current.position.x = orbitRadius * Math.cos(t + orbitOffset);
            groupRef.current.position.y = position[1];
            groupRef.current.position.z = orbitRadius * Math.sin(t + orbitOffset);
        } else if (isActive) {
            groupRef.current.position.lerp(homePosition, 0.1);
        }
        const targetScale = isActive ? 1.2 : 1.0;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        if (htmlRef.current) {
            const targetFontSize = isActive ? 48 : 18;
            const currentFontSize = parseFloat(htmlRef.current.style.fontSize) || 18;
            const newFontSize = THREE.MathUtils.lerp(currentFontSize, targetFontSize, 0.18);
            htmlRef.current.style.fontSize = `${newFontSize}px`;
            htmlRef.current.style.fontWeight = isActive ? "bold" : "normal";
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <Trail
                width={2.5}
                length={6}
                color={color}
                attenuation={(t) => t * t}
            >
                <Sphere
                    args={[0.8, 32, 32]}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    onClick={onClick}
                >
                    <meshStandardMaterial color={color} emissive={hovered ? color : 'black'} roughness={0.2} />
                </Sphere>
            </Trail>
            <Html position={[0, 1.1, 0]} distanceFactor={10} occlude={[occluderRef]}>
                <div
                    ref={htmlRef}
                    className="satellite-label"
                    style={{ color: "white", pointerEvents: "none", transform: "translate(-50%, -50%)", whiteSpace: "nowrap", fontSize: "18px" }}
                >
                    {text}
                </div>
            </Html>
        </group>
    );
}

// --- Animated Camera Controller ---
function AnimatedCamera({ activeSection }) {
    useFrame((state) => {
        if (activeSection) {
            const targetPosition = new THREE.Vector3();
            const lookAtTarget = new THREE.Vector3();
            const orbitRadius = 8;
            if (activeSection === 'about') {
                targetPosition.set(0, 3, 12);
                lookAtTarget.set(0, 3, 0);
            } else if (activeSection === 'projects') {
                targetPosition.set(orbitRadius, 1, 8);
                lookAtTarget.set(orbitRadius, 0, 0);
            } else if (activeSection === 'skills') {
                targetPosition.set(-orbitRadius, 1, 8);
                lookAtTarget.set(-orbitRadius, 0, 0);
            } else if (activeSection === 'contact') {
                targetPosition.set(0, 0, 8);
                lookAtTarget.set(0, 0, 0);
            }
            state.camera.position.lerp(targetPosition, 0.02);
            state.camera.lookAt(lookAtTarget);
            state.camera.updateProjectionMatrix();
        }
    });
    return null;
}

// --- Mouse-Reactive Background Stars ---
function MouseReactiveStars() {
    const starsRef = useRef();
    useFrame((state) => {
        if (starsRef.current) {
            starsRef.current.rotation.x = THREE.MathUtils.lerp(starsRef.current.rotation.x, state.mouse.y * 0.1, 0.02);
            starsRef.current.rotation.y = THREE.MathUtils.lerp(starsRef.current.rotation.y, state.mouse.x * 0.1, 0.02);
        }
    });
    return (
        <group ref={starsRef}>
            <Stars radius={200} depth={50} count={5000} factor={6} saturation={0} fade speed={1} />
        </group>
    );
}

// --- NEW: Universal 2D Detail Page Component ---
function DetailPage({ section, onScrollUp }) {
    const scrollRef = useRef();

    useEffect(() => {
        const handleWheel = (e) => {
            if (scrollRef.current && scrollRef.current.scrollTop === 0 && e.deltaY < 0) {
                onScrollUp();
            }
        };
        const ref = scrollRef.current;
        if (ref) ref.addEventListener('wheel', handleWheel);
        return () => {
            if (ref) ref.removeEventListener('wheel', handleWheel);
        };
    }, [onScrollUp]);
    
    // Return null if there's no active section or no details for it
    if (!section || !section.details) return null;

    const { title, details } = section;

    return (
        <div ref={scrollRef} className="detail-page">
            <div className="detail-page-content">
                <h1 className="detail-title">{title}</h1>
                <p className="detail-intro">{details.intro}</p>

                {/* Conditional Rendering based on Section */}
                
                {title === 'About Me' && (
                    <div className="about-content">
                        <p className="about-text">{details.bio}</p>
                    </div>
                )}

                {title === 'Projects' && (
                    <div className="projects-list">
                        {details.projectList.map(project => (
                            <div key={project.title} className="project-card">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="project-tech">
                                    {project.tech.map(t => <span key={t}>{t}</span>)}
                                </div>
                                <div className="project-links">
                                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo</a>
                                    <a href={project.codeUrl} target="_blank" rel="noopener noreferrer">Source Code</a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {title === 'Skills' && (
                    <div className="skills-grid">
                        {details.categories.map(category => (
                            <div key={category.title} className="skill-category">
                                <h2>{category.title}</h2>
                                <ul>{category.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
                            </div>
                        ))}
                    </div>
                )}

                {title === 'Contact' && (
                    <div className="contact-content">
                        <div className="contact-info">
                            <div className="contact-item">
                                <h3>Email</h3>
                                <a href={`mailto:${details.email}`}>{details.email}</a>
                            </div>
                            <div className="contact-item">
                                <h3>Location</h3>
                                <p>{details.location}</p>
                            </div>
                        </div>
                        <div className="contact-socials">
                            <h3>Follow Me</h3>
                            {details.socials.map(social => (
                                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">{social.name}</a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="scroll-indicator-top"><p>Scroll up to return to main page</p></div>
            </div>
        </div>
    );
}

// --- Main App Component ---
export default function App() {
    const [activeSection, setActiveSection] = useState(null);
    const data = activeSection ? portfolioSections[activeSection] : null;
    const [isLoaded, setIsLoaded] = useState(false);
    const [viewMode, setViewMode] = useState('3d');
    const coreRef = useRef();

    useEffect(() => {
        if (viewMode !== '3d' || !activeSection) return;
        let isTransitioning = false;
        const handleWheel = (e) => {
            if (e.deltaY > 5 && !isTransitioning) {
                isTransitioning = true;
                setViewMode('2d');
            }
        };
        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [activeSection, viewMode]);

    const isScenePaused = ['about', 'projects', 'skills'].includes(activeSection) || viewMode === '2d';

    return (
        <>
            <LoadingScreen onLoaded={() => setIsLoaded(true)} />
            
            <div className={`view-3d-container ${viewMode === '2d' ? 'hidden' : ''}`}>
                {isLoaded && (
                    <div className="app-content-visible">
                        <div className="text-overlay">
                            <div className="header">
                                <h1>VIJAY VIPPARTHI</h1>
                                <p>Creative Web Developer</p>
                                <div className="social-links">
                                    <a href="https://www.linkedin.com/in/vijay-vipparthi-dev/" target="_blank" rel="noopener noreferrer" className="icon-button" title="LinkedIn">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.75c0-1.4-1.1-2.5-2.5-2.5S11 12.85 11 14.25V19h-3v-9h2.9v1.3a3.11 3.11 0 012.6-1.4c2.5 0 4.5 2 4.5 4.5V19z"/>
                                    </svg>
                                    </a>
                                    <a href="https://github.com/vijay2898AD" target="_blank" rel="noopener noreferrer" className="icon-button" title="GitHub">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                                    </a>
                                    <a href="/Vijay_Vipparthi_Resume.pdf" download className="icon-button" title="Download Resume">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"></path></svg>
                                    </a>
                                </div>
                            </div>
                            {data && viewMode === '3d' && (
                                <div className="content"><p dangerouslySetInnerHTML={{ __html: data.content }} /></div>
                            )}
                        </div>
                        <div className="nav-overlay">
                            <button onClick={() => setActiveSection('about')}>About</button>
                            <button onClick={() => setActiveSection('projects')}>Projects</button>
                            <button onClick={() => setActiveSection('skills')}>Skills</button>
                            <button onClick={() => setActiveSection('contact')}>Contact</button>
                            {activeSection && <button onClick={() => { setActiveSection(null); setViewMode('3d'); }}>Back</button>}
                        </div>
                        <Canvas camera={{ position: [0, 2, 25], fov: 45 }}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={0.5} />
                            <MouseReactiveStars />
                            <Suspense fallback={null}>
                                <GenerativeCore ref={coreRef} onClick={() => setActiveSection('contact')} isPaused={isScenePaused} />
                                <Satellite occluderRef={coreRef} position={[0, 3, 6]} color="mediumpurple" text="About" onClick={() => setActiveSection('about')} isActive={activeSection === 'about'} isPaused={isScenePaused} orbitRadius={7} orbitOffset={Math.PI / 2} />
                                <Satellite occluderRef={coreRef} position={[8, -2, 0]} color="orange" text="Projects" onClick={() => setActiveSection('projects')} isActive={activeSection === 'projects'} isPaused={isScenePaused} orbitRadius={8} orbitOffset={0} />
                                <Satellite occluderRef={coreRef} position={[-8, -2, 0]} color="dodgerblue" text="Skills" onClick={() => setActiveSection('skills')} isActive={activeSection === 'skills'} isPaused={isScenePaused} orbitRadius={8} orbitOffset={Math.PI} />
                            </Suspense>
                            <AnimatedCamera activeSection={activeSection} />
                            <OrbitControls enableZoom={false} enablePan={false} enabled={activeSection === null} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
                        </Canvas>
                    </div>
                )}
            </div>
            
            <div className={`view-2d-container ${viewMode === '2d' ? 'visible' : ''}`}>
                {isLoaded && <DetailPage section={data} onScrollUp={() => setViewMode('3d')} />}
            </div>
        </>
    );
}