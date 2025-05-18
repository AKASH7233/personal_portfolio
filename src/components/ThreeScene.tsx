
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// This is a fallback component in case the 3D model fails to load
const DeveloperFallback = () => (
  <div className="flex flex-col items-center justify-center h-full w-full">
    <div className="w-60 h-60 rounded-full bg-aqua/20 flex items-center justify-center animate-float">
      <span className="text-5xl">👨‍💻</span>
    </div>
    <p className="mt-4 text-sm text-muted-foreground">3D Model Loading Failed</p>
  </div>
);

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Set up scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    
    const camera = new THREE.PerspectiveCamera(
      50, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 3;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true // Enable transparency
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    
    // Directional light (simulates sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2);
    scene.add(directionalLight);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    // Initially try to load a developer model from online
    // Note: In a real scenario, this would be a local model asset
    const loader = new GLTFLoader();
    
    // Try to load a placeholder human model
    const modelUrl = 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/LittlestTokyo.glb';
    
    loader.load(
      modelUrl,
      (gltf) => {
        // Scale and position model
        const model = gltf.scene;
        model.scale.set(0.01, 0.01, 0.01);
        model.position.y = -1;
        model.rotation.y = Math.PI / 8;
        
        scene.add(model);
        setModelLoaded(true);
      },
      // Progress callback
      undefined,
      // Error callback
      (error) => {
        console.error('Error loading 3D model:', error);
        setLoadError(true);
        
        // Create a fallback geometric shape (a simple torus)
        const geometry = new THREE.TorusKnotGeometry(0.7, 0.3, 100, 16);
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x33C3F0, 
          shininess: 100 
        });
        const fallbackObject = new THREE.Mesh(geometry, material);
        scene.add(fallbackObject);
      }
    );
    
    // Responsive handling
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Mouse interaction for non-touch devices
    const mousePosition = new THREE.Vector2();
    
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate mouse position
      mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Subtly rotate camera based on mouse position
      if (!controls.enabled) {
        camera.position.x += (mousePosition.x - camera.position.x) * 0.05;
        camera.position.y += (mousePosition.y - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Clean up
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div 
        ref={mountRef} 
        className="webgl-container h-[400px] md:h-[500px] w-full"
        data-load-error={loadError}
      />
      {loadError && <DeveloperFallback />}
    </>
  );
}

// Add import for useState
import { useState } from 'react';
