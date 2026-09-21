"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneMotion } from "@/lib/scene-motion";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollDirector({ ready, detail, enabled }: { ready: boolean; detail: boolean; enabled: boolean }) {
  useGSAP(() => {
    document.body.classList.toggle("motion-enabled", enabled);
    if (!ready || detail || !enabled) return;
    document.body.classList.add("hero-transition");
    const media = gsap.matchMedia();
    media.add("all", () => {
      const hero = document.querySelector(".hero");
      if (hero) {
        const timeline = gsap.timeline({ scrollTrigger: { id: "hero-journey", trigger: hero, start: "top top", end: () => `+=${innerHeight * 1.2}`, pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 } });
        timeline.to(".hero-line-first", { xPercent: -85, rotation: -7, opacity: 0, duration: .65, ease: "power2.in" }, 0)
          .to(".hero-line-second", { xPercent: 85, rotation: 7, opacity: 0, duration: .65, ease: "power2.in" }, 0)
          .to(".hero-content>p, .hero-actions, .hero-bottom", { y: -25, autoAlpha: 0, duration: .25 }, 0)
          .to(sceneMotion, { tunnel: 1, duration: .5, ease: "power2.inOut" }, .1)
          .fromTo(".products-section", { scale: .65, autoAlpha: 0, y: () => -innerHeight * .2 }, { scale: 1, autoAlpha: 1, y: 0, duration: .6, ease: "power2.out" }, .4)
          .to(sceneMotion, { tunnel: 0, duration: .4, ease: "power2.inOut" }, .8);
      }
      const panels = gsap.utils.toArray<HTMLElement>(".why-panel");
      if (panels.length) {
        gsap.set(panels.slice(1), { yPercent: 115, rotate: 4 });
        const stack = gsap.timeline({ scrollTrigger: { id: "why-story", trigger: ".why-section", start: "top top", end: () => `+=${innerHeight * 2}`, pin: true, scrub: .6, invalidateOnRefresh: true, anticipatePin: 1 } });
        panels.slice(1).forEach((panel, index) => {
          stack.to(panels[index], { scale: .93, opacity: .15, y: -25, duration: 1 }, index)
            .to(panel, { yPercent: 0, rotate: 0, duration: 1, ease: "power2.inOut" }, index);
        });
      }
      gsap.utils.toArray<HTMLElement>(".scroll-word").forEach((word,index) => {
        gsap.fromTo(word,{opacity:.15},{opacity:1,scrollTrigger:{trigger:word,start:`top ${80-index*3}%`,end:`top ${50-index*3}%`,scrub:true}});
      });
      ScrollTrigger.refresh();
    });
    return () => { media.revert(); sceneMotion.tunnel = 0; document.body.classList.remove("hero-transition"); };
  }, { dependencies: [ready, detail, enabled], revertOnUpdate: true });
  return null;
}
