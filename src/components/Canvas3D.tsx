import { useEffect, useRef } from 'react';
import { SceneManager } from '../webgl/SceneManager';

interface Canvas3DProps {
  scrollProgress: number;
  weightGrams: number;
  lightingMode?: 'atelier' | 'noir' | 'glint';
}

export function Canvas3D({ scrollProgress, weightGrams, lightingMode = 'atelier' }: Canvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<SceneManager | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const manager = new SceneManager(containerRef.current);
    managerRef.current = manager;

    return () => {
      manager.destroy();
      managerRef.current = null;
    };
  }, []);

  // Synchronize scroll progress without re-instantiating scene
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.setScrollProgress(scrollProgress);
    }
  }, [scrollProgress]);

  // Synchronize dynamic weight scale
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.setWeight(weightGrams);
    }
  }, [weightGrams]);

  // Synchronize lighting mode
  useEffect(() => {
    if (managerRef.current) {
      managerRef.current.setLightingMode(lightingMode);
    }
  }, [lightingMode]);

  return (
    <div
      ref={containerRef}
      id="webgl-canvas-container"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
