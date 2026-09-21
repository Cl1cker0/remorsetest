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
      const fabricRows = width < 768 ? 34 : 55;
      const rows = fabricRows * 2;
      const morph = sceneMotion.tunnel;
      const travel = sceneMotion.travel;
      const cameraDepth = travel * 22;
      const center = (depth: number) => ({
        x: Math.sin(depth * .12) * 2.4,
        y: Math.sin(depth * .09 + .4) * 1.8,
      });
      const camera = center(cameraDepth);
      const target = center(cameraDepth + 6);
      const yaw = Math.atan2(target.x - camera.x, 6);
      const pitch = Math.atan2(target.y - camera.y, Math.hypot(6, target.x - camera.x));
      const focal = Math.min(width, height) * .9;
      for (let row = 0; row < rows; row++) {
        const v = Math.floor(row / 2) / (fabricRows - 1);
        const ringDepth = .7 + row * .55;
        const ringCenter = center(ringDepth);
        for (let col = 0; col < cols; col++) {
          const u = col / (cols - 1);
          const wave = Math.sin(u * 8.4 + v * 3.2 + t * 0.85);
          const fold = Math.cos(u * 5.4 - v * 5.2 - t * 0.65);
          let x = (u * 1.35 - 0.12) * width + Math.sin(v * 4 + t * 0.18) * 32;
          let y =
            height * (0.18 + v * 0.68) + wave * (85 + v * 75) + fold * 62;
          const edge = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
          // Use a half-open circle so the first and last columns never overlap.
          const tunnelU = col / cols;
          const angle = tunnelU * Math.PI * 2 + ringDepth * .045 + t * .07;
          const radius = 2.3 + Math.sin(angle * 3 + ringDepth * .28 + t * .3) * .13;
          // A long curved tube, viewed from a camera travelling along its centerline.
          // Keep walls ahead of the camera until the product reveal: never zoom
          // the final ring into a flat, empty circle.
          const worldX = ringCenter.x + Math.cos(angle) * radius - camera.x;
          const worldY = ringCenter.y + Math.sin(angle) * radius - camera.y;
          const worldZ = ringDepth - cameraDepth;
          const viewX = worldX * Math.cos(yaw) - worldZ * Math.sin(yaw);
          const yawZ = worldX * Math.sin(yaw) + worldZ * Math.cos(yaw);
          const viewY = worldY * Math.cos(pitch) - yawZ * Math.sin(pitch);
          const z = worldY * Math.sin(pitch) + yawZ * Math.cos(pitch);
          const projection = focal / Math.max(.15, z);
          const tunnelX = width * .5 + viewX * projection;
          const tunnelY = height * .47 + viewY * projection;
          x += (tunnelX - x) * morph;
          y += (tunnelY - y) * morph;
          const ringFade = z <= .15 ? 0 : Math.min(1, (z - .15) / .5) * Math.min(1, 18 / z);
          // Additional depth rows fade in only for the tunnel, preserving the
          // original silk background's spacing outside this scroll sequence.
          const fabricAlpha = row % 2 === 0 ? Math.max(0, edge * (0.18 + (wave + 1) * 0.2)) : 0;
          const alpha = fabricAlpha * (1-morph) + morph * ringFade * .72;
          ctx!.fillStyle = `rgba(255,0,153,${alpha})`;
          ctx!.beginPath();
          const fabricSize = .55 + (fold + 1) * .37;
          const tunnelSize = Math.min(6, .4 + projection * .012);
          ctx!.arc(x, y, fabricSize * (1-morph) + tunnelSize * morph, 0, Math.PI * 2);
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
