"use client";

import { useEffect, useRef } from "react";
import { sceneMotion } from "@/lib/scene-motion";

// A projected dot fabric, drawn at a capped resolution and 30fps. No React renders per frame.
export default function SilkBackground({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      time = 0;
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = width * ratio;
      canvas!.height = height * ratio;
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint(0);
    }
    function paint(t: number) {
      ctx!.clearRect(0, 0, width, height);
      const cols = width < 768 ? 65 : 112;
      const rows = width < 768 ? 34 : 55;
      for (let row = 0; row < rows; row++) {
        const v = row / (rows - 1);
        for (let col = 0; col < cols; col++) {
          const u = col / (cols - 1);
          const wave = Math.sin(u * 8.4 + v * 3.2 + t * 0.85);
          const fold = Math.cos(u * 5.4 - v * 5.2 - t * 0.65);
          let x = (u * 1.35 - 0.12) * width + Math.sin(v * 4 + t * 0.18) * 32;
          let y =
            height * (0.18 + v * 0.68) + wave * (85 + v * 75) + fold * 62;
          const edge = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
          const morph = sceneMotion.tunnel;
          const depth = (v + t * .045) % 1;
          const radius = .07 + Math.pow(depth, 2.1) * .95;
          const angle = u * Math.PI * 2 + depth * .9 + t * .12;
          const tunnelX = width * .5 + Math.cos(angle) * radius * width;
          const tunnelY = height * .47 + Math.sin(angle) * radius * height;
          x += (tunnelX - x) * morph;
          y += (tunnelY - y) * morph;
          const alpha = Math.max(0, edge * (0.18 + (wave + 1) * 0.2)) * (1-morph) + morph * Math.sin(depth*Math.PI) * .8;
          ctx!.fillStyle = `rgba(255,0,153,${alpha})`;
          ctx!.beginPath();
          ctx!.arc(x, y, 0.55 + (fold + 1) * 0.37, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }
    function animate(now: number) {
      if (now - last > 33) {
        time += Math.min(now - last, 60) / 1000;
        last = now;
        paint(time);
      }
      frame = requestAnimationFrame(animate);
    }
    function start() {
      cancelAnimationFrame(frame);
      if (enabled && !document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(animate);
      } else paint(0);
    }
    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", start);
    reduced.addEventListener("change", start);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", start);
      reduced.removeEventListener("change", start);
    };
  }, [enabled]);
  return <canvas ref={ref} className="silk-canvas" aria-hidden="true" />;
}
