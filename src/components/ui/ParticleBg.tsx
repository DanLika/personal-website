import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';
import type { OGLRenderingContext } from 'ogl';

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
  className?: string;
  externalMouseRef?: React.MutableRefObject<{ x: number; y: number } | null>;
}

// Our neon color palette
const defaultColors: string[] = ['#ffffff', '#3BC9FF', '#5DD9FF', '#a0e7ff'];

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

/**
 * Particles - WebGL particle background using OGL (ReactBits style)
 * 
 * Features:
 * - Hardware-accelerated WebGL rendering
 * - 3D particle movement with subtle rotation
 * - Mouse interaction (particles follow cursor)
 * - Touch support for mobile devices
 * - Smooth alpha blending
 * - Customizable colors, size, and behavior
 */
export const Particles = ({
  particleCount = 100,
  particleSpread = 10,
  speed = 0.3,
  particleColors = defaultColors,
  moveParticlesOnHover = true,
  particleHoverFactor = 2,
  alphaParticles = true,
  particleBaseSize = 80,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  className = '',
  externalMouseRef
}: ParticlesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const programRef = useRef<Program | null>(null);
  const particlesRef = useRef<Mesh | null>(null);
  const speedRef = useRef(speed);
  const rendererRef = useRef<Renderer | null>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // State holding objects to prevent recreating
    const state = {
      renderer: null as Renderer | null,
      camera: null as Camera | null,
      gl: null as OGLRenderingContext | null,
      particles: null as Mesh | null,
      program: null as Program | null,
      animationFrameId: 0 as number,
      inputRafId: null as number | null,
      resize: () => {},
      updateCachedRect: () => {},
      handleMouseMove: (e: MouseEvent) => { void e; },
      handleMouseLeave: () => {},
      handleTouchMove: (e: TouchEvent) => { void e; },
      handleTouchEnd: () => {},
      handleVisibilityChange: () => {}
    };

    const initWebGL = () => {
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      const renderer = new Renderer({ dpr: pixelRatio, depth: false, alpha: true });
      const gl = renderer.gl;

      rendererRef.current = renderer;
      state.renderer = renderer;
      state.gl = gl;

      container.appendChild(gl.canvas);
      gl.clearColor(0, 0, 0, 0);

      const canvas = gl.canvas as HTMLCanvasElement;
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      const camera = new Camera(gl, { fov: 15 });
      camera.position.set(0, 0, cameraDistance);
      state.camera = camera;
    };

    const initParticles = () => {
      const { gl } = state;
      if (!gl) return;
      const count = particleCount;
      const positions = new Float32Array(count * 3);
      const randoms = new Float32Array(count * 4);
      const colors = new Float32Array(count * 3);
      const palette = particleColors.length > 0 ? particleColors : defaultColors;

      for (let i = 0; i < count; i++) {
        let x: number, y: number, z: number, len: number;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          z = Math.random() * 2 - 1;
          len = x * x + y * y + z * z;
        } while (len > 1 || len === 0);

        const r = Math.cbrt(Math.random());
        positions.set([x * r, y * r, z * r], i * 3);
        randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);

        const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
        colors.set(col, i * 3);
      }

      const geometry = new Geometry(gl, {
        position: { size: 3, data: positions },
        random: { size: 4, data: randoms },
        color: { size: 3, data: colors }
      });

      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          uTime: { value: 0 },
          uSpread: { value: particleSpread },
          uBaseSize: { value: particleBaseSize * pixelRatio },
          uSizeRandomness: { value: sizeRandomness },
          uAlphaParticles: { value: alphaParticles ? 1 : 0 }
        },
        transparent: true,
        depthTest: false
      });

      const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

      programRef.current = program;
      particlesRef.current = particles;
      speedRef.current = speed;

      state.program = program;
      state.particles = particles;
    };

    const setupEventListeners = () => {
      const { renderer, camera, gl } = state;

      state.resize = () => {
        if (!renderer || !camera || !gl) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
      };

      window.addEventListener('resize', state.resize, false);
      state.resize();

      let cachedRect = container.getBoundingClientRect();
      let lastInputX = 0;
      let lastInputY = 0;

      state.updateCachedRect = () => {
        cachedRect = container.getBoundingClientRect();
      };
      window.addEventListener('resize', state.updateCachedRect, { passive: true });

      const processInput = () => {
        state.inputRafId = null;
        const x = ((lastInputX - cachedRect.left) / cachedRect.width) * 2 - 1;
        const y = -(((lastInputY - cachedRect.top) / cachedRect.height) * 2 - 1);
        mouseRef.current = { x, y };
      };

      state.handleMouseMove = (e: MouseEvent) => {
        lastInputX = e.clientX;
        lastInputY = e.clientY;
        if (!state.inputRafId) {
          state.inputRafId = requestAnimationFrame(processInput);
        }
      };

      state.handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          lastInputX = touch.clientX;
          lastInputY = touch.clientY;
          if (!state.inputRafId) {
            state.inputRafId = requestAnimationFrame(processInput);
          }
        }
      };

      state.handleMouseLeave = () => {
        mouseRef.current = { x: 0, y: 0 };
      };

      state.handleTouchEnd = () => {
        mouseRef.current = { x: 0, y: 0 };
      };

      if (moveParticlesOnHover && !externalMouseRef) {
        container.addEventListener('mousemove', state.handleMouseMove, { passive: true });
        container.addEventListener('mouseleave', state.handleMouseLeave);
        container.addEventListener('touchmove', state.handleTouchMove, { passive: true });
        container.addEventListener('touchend', state.handleTouchEnd, { passive: true });
      }

      state.handleVisibilityChange = () => {
        const wasHidden = !isVisibleRef.current;
        isVisibleRef.current = !document.hidden;

        if (!document.hidden && wasHidden && state.gl) {
          if (state.gl.isContextLost()) {
            window.dispatchEvent(new CustomEvent('particles-context-lost'));
          }
        }
      };

      isVisibleRef.current = !document.hidden;
      document.addEventListener('visibilitychange', state.handleVisibilityChange);
    };

    const startAnimation = () => {
      const { renderer, camera, gl, particles, program } = state;
      if (!renderer || !camera || !gl || !particles || !program) return;

      let lastTime = performance.now();
      let elapsed = 0;
      let smoothMouseX = 0;
      let smoothMouseY = 0;
      let frameSkip = 0;
      const FRAME_SKIP_COUNT = 1;

      const update = (t: number) => {
        state.animationFrameId = requestAnimationFrame(update);

        if (!isVisibleRef.current) return;

        frameSkip++;
        if (frameSkip <= FRAME_SKIP_COUNT) return;
        frameSkip = 0;

        const delta = t - lastTime;
        lastTime = t;

        // Handle large jumps when tab becomes visible
        if (delta > 100) return;

        elapsed += delta * speedRef.current;

        if (gl.isContextLost()) {
          console.warn('WebGL context lost, will reinitialize on next visibility change');
          window.dispatchEvent(new CustomEvent('particles-context-lost'));
          return;
        }

        try {
          program.uniforms.uTime.value = elapsed * 0.001;

          if (moveParticlesOnHover) {
            const currentMouse = externalMouseRef?.current || mouseRef.current;

            if (currentMouse) {
              smoothMouseX += (currentMouse.x - smoothMouseX) * 0.1;
              smoothMouseY += (currentMouse.y - smoothMouseY) * 0.1;
            } else {
              smoothMouseX += (0 - smoothMouseX) * 0.05;
              smoothMouseY += (0 - smoothMouseY) * 0.05;
            }
            particles.position.x = -smoothMouseX * particleHoverFactor;
            particles.position.y = -smoothMouseY * particleHoverFactor;
          }

          if (!disableRotation) {
            particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
            particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
            particles.rotation.z += 0.003 * speedRef.current;
          }

          renderer.render({ scene: particles, camera });
        } catch (error) {
          console.warn('Error rendering particles:', error);
        }
      };

      state.animationFrameId = requestAnimationFrame(update);
    };

    // Execute setup
    initWebGL();
    initParticles();
    setupEventListeners();
    startAnimation();

    return () => {
      document.removeEventListener('visibilitychange', state.handleVisibilityChange);
      window.removeEventListener('resize', state.resize);
      window.removeEventListener('resize', state.updateCachedRect);

      if (moveParticlesOnHover && !externalMouseRef) {
        container.removeEventListener('mousemove', state.handleMouseMove);
        container.removeEventListener('mouseleave', state.handleMouseLeave);
        container.removeEventListener('touchmove', state.handleTouchMove);
        container.removeEventListener('touchend', state.handleTouchEnd);
      }

      if (state.inputRafId) cancelAnimationFrame(state.inputRafId);
      if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);

      if (state.gl && container.contains(state.gl.canvas as Node)) {
        container.removeChild(state.gl.canvas as Node);
      }

      programRef.current = null;
      particlesRef.current = null;
      rendererRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleCount, particleColors, moveParticlesOnHover, cameraDistance, disableRotation, externalMouseRef]);

  // Separate effect to update uniforms dynamically without recreating WebGL context
  useEffect(() => {
    if (programRef.current) {
      const pixelRatio = Math.min(window.devicePixelRatio, 2);
      programRef.current.uniforms.uSpread.value = particleSpread;
      programRef.current.uniforms.uBaseSize.value = particleBaseSize * pixelRatio;
      programRef.current.uniforms.uSizeRandomness.value = sizeRandomness;
      programRef.current.uniforms.uAlphaParticles.value = alphaParticles ? 1 : 0;
    }
    speedRef.current = speed;
  }, [particleSpread, particleBaseSize, sizeRandomness, alphaParticles, speed]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: moveParticlesOnHover && !externalMouseRef ? 'auto' : 'none' }}
      aria-hidden="true"
    />
  );
};

export default Particles;

