"use client";
import React, { useId, useEffect, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "motion/react";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore: React.FC<ParticlesProps> = ({
  id,
  className,
  background = "#0d47a1",
  minSize = 1,
  maxSize = 3,
  speed = 4,
  particleColor = "#ffffff",
  particleDensity = 120,
}) => {
  const [engineReady, setEngineReady] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  // load slim bundle once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  // only recreate when `controls` changes
  const particlesLoaded = useCallback(
    async (container?: Container) => {
      if (!container) return;
      await controls.start({ opacity: 1, transition: { duration: 1 } });
    },
    [controls],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      className={cn(className)}
    >
      {engineReady && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: false, mode: "repulse" },
                resize: { enable: true, delay: 0 },
              },
              modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 },
              },
            },
            particles: {
              color: { value: particleColor },
              move: {
                enable: true,
                speed: { min: 0.1, max: 1 },
                direction: "top",
              },
              number: {
                value: particleDensity,
                density: { enable: true, width: 400, height: 400 },
              },
              opacity: {
                value: { min: 0.1, max: 1 },
                animation: { enable: true, speed, startValue: "random" },
              },
              size: { value: { min: minSize, max: maxSize } },
              shape: { type: "circle" },
              detectRetina: true,
            },
          }}
        />
      )}
    </motion.div>
  );
};
