import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine, Container } from "tsparticles-engine";

export const ParticleBg = () => {
  const initParticles = useCallback(async (_engine: Engine) => {
    // Basic initialization without additional loaders
    console.log("Particles initialized");
  }, []);

  const particlesLoaded = useCallback(async (_container?: Container) => {
    // optional debug
  }, []);

  return (
    <Particles
      id="hero-particles"
      className="pointer-events-none absolute inset-0"
      init={initParticles}
      loaded={particlesLoaded}
      options={{
        fullScreen: { enable: false },
        background: { color: "transparent" },
        fpsLimit: 60,
        detectRetina: true,
        interactivity: {
          detectsOn: "window",
          events: {
            onHover: { enable: true, mode: ["repulse", "parallax"] },
            resize: true,
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            parallax: { enable: true, force: 60, smooth: 20 },
          },
        },
        particles: {
          number: { value: 120, density: { enable: true, area: 1000 } },
          color: { value: ["#ffffff", "#3BC9FF", "#5DD9FF", "#a0e7ff"] },
          shape: { type: "circle" },
          opacity: {
            value: { min: 0.2, max: 0.6 },
            random: true,
            animation: {
              enable: true,
              speed: 0.2,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 0.5, max: 2 },
            random: { enable: true, minimumValue: 0.5 },
          },
          links: { enable: false },
          move: {
            enable: true,
            speed: 0.15,
            direction: "none",
            random: true,
            straight: false,
            outModes: { default: "out" },
            attract: { enable: false },
            bounce: false,
          },
        },
      }}
    />
  );
};
