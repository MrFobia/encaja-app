import { Component, Suspense, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import "./Hero3D.css";

const MODEL_URL = "/models/recipe-box.glb";

/** Caja primitiva de three.js — placeholder mientras no exista el GLB final,
 *  y red de seguridad si /models/recipe-box.glb falla al cargar. */
function PrimitiveBoxFallback() {
  return (
    <group>
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[1.7, 1, 1.15]} />
        <meshStandardMaterial color="#e8623d" roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.42, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.74, 0.14, 1.19]} />
        <meshStandardMaterial color="#4f7a5a" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Carga el GLB real. Si /models/recipe-box.glb no existe todavía, useGLTF
 *  lanza y el ModelErrorBoundary de más abajo cae al primitivo. */
function RecipeBoxModel() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} scale={5.8} position={[0, -0.5, 0]} />;
}

interface BoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <PrimitiveBoxFallback />;
    return this.props.children;
  }
}

function Scene({ hovered }: { hovered: boolean }) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 2]} intensity={1.8} color="#fff3ea" />
      <pointLight position={[-3, -1, -2]} intensity={0.5} color="#8fae8b" />
      <ModelErrorBoundary>
        <Suspense fallback={<PrimitiveBoxFallback />}>
          <RecipeBoxModel />
        </Suspense>
      </ModelErrorBoundary>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={hovered ? 2.6 : 0.6}
        minPolarAngle={Math.PI / 2 - 0.28}
        maxPolarAngle={Math.PI / 2 + 0.18}
      />
    </>
  );
}

/**
 * Hero 3D — bloque BEM `.hero-3d`. Muestra `/models/recipe-box.glb` con
 * rotación sutil autoplay que acelera on-hover. Sin zoom ni drag libre
 * (es una pieza de escena, no un visor 3D). Respeta
 * `prefers-reduced-motion`: en ese caso no monta el Canvas en absoluto y
 * cae a una imagen estática (con su propio fallback si la imagen tampoco
 * existe todavía).
 */
export function Hero3D() {
  const reducedMotion = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [staticImgFailed, setStaticImgFailed] = useState(false);

  if (reducedMotion) {
    return (
      <div className="hero-3d hero-3d--static" role="img" aria-label="Caja de recetas Encaja">
        {!staticImgFailed ? (
          <img
            className="hero-3d__static-image"
            src="/images/hero-recipe-box.jpg"
            alt=""
            onError={() => setStaticImgFailed(true)}
          />
        ) : (
          <div className="hero-3d__static-fallback" aria-hidden="true">
            <span className="hero-3d__static-lid" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="hero-3d"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img"
      aria-label="Caja de recetas Encaja girando lentamente"
    >
      <Canvas camera={{ position: [0, 0.6, 4.2], fov: 34 }} dpr={[1, 1.75]}>
        <Scene hovered={hovered} />
      </Canvas>
    </div>
  );
}
