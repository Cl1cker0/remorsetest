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
    const media = gsap.matchMedia();
    media.add("all", () => {
      const hero = document.querySelector(".hero");
      if (hero) {
        gsap.set(".products-section", { marginTop: "-100svh", position: "relative", zIndex: 2, transformOrigin: "50% 0" });
        const products = document.querySelector<HTMLElement>(".products-section");
        const canvas = document.querySelector<HTMLElement>(".silk-canvas");
        const hold = { value: 0 };
        const timeline = gsap.timeline({ scrollTrigger: {
          id: "hero-journey", trigger: hero, start: "top top", end: () => `+=${innerHeight * 2.7}`,
          pin: true, scrub: .75, invalidateOnRefresh: true, anticipatePin: 1,
        }, onUpdate: function () {
            const progress = this.progress();
            const tunnel = progress < .18 ? progress / .18 : progress < .85 ? 1 : Math.max(0, (1 - progress) / .15);
            const travelProgress = Math.min(1, Math.max(0, (progress - .18) / .7));
            const travel = gsap.parseEase("power1.inOut")(travelProgress);
            const entrance = Math.min(1, Math.max(0, (progress - .8) / .2));
            const easedEntrance = gsap.parseEase("power2.out")(entrance);
            sceneMotion.tunnel = tunnel;
            sceneMotion.travel = travel;
            if (products) gsap.set(products, {
              scale: .48 + .52 * easedEntrance,
              autoAlpha: entrance,
              y: -innerHeight * .12 * (1 - easedEntrance),
            });
            if (canvas) gsap.set(canvas, {
              scale: 1,
              rotation: 0,
              opacity: 1,
            });
          }
        });
        timeline.to(".hero-line-first", { xPercent: -85, rotation: -7, opacity: 0, duration: .65, ease: "power2.in" }, 0)
          .to(".hero-line-second", { xPercent: 85, rotation: 7, opacity: 0, duration: .65, ease: "power2.in" }, 0)
          .to(".hero-content>p, .hero-actions, .hero-bottom", { y: -25, autoAlpha: 0, duration: .25 }, 0)
          .to(hold, { value: 1, duration: 2.35, ease: "none" }, .65);
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
      // Continuous, reversible scroll scenes through the end of the page.
      gsap.fromTo(".reviews-section", { scale: .86, y: 90 }, {
        scale: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: ".reviews-section", start: "top 95%", end: "top 20%", scrub: .7, invalidateOnRefresh: true }
      });
      gsap.fromTo(".reviews-section h2", { xPercent: -12, opacity: .25 }, {
        xPercent: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".reviews-section", start: "top 90%", end: "top 30%", scrub: .6 }
      });
      gsap.utils.toArray<HTMLElement>(".faq-list details").forEach((row,index) => {
        gsap.fromTo(row, { x: index % 2 ? 65 : -65, opacity: .2, scale: .96 }, {
          x: 0, opacity: 1, scale: 1, ease: "none",
          scrollTrigger: { trigger: row, start: "top 95%", end: "top 65%", scrub: .5, invalidateOnRefresh: true }
        });
      });
      gsap.fromTo(".final-cta h2", { scale: .6, y: 80, opacity: .15 }, {
        scale: 1, y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".final-cta", start: "top 95%", end: "top 25%", scrub: .8 }
      });
      gsap.fromTo(".final-cta .primary-button", { y: 45, opacity: .1 }, {
        y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".final-cta", start: "top 70%", end: "top 30%", scrub: .5 }
      });
      gsap.fromTo(".footer", { y: 90, opacity: .2 }, {
        y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".footer", start: "top bottom", end: "clamp(bottom bottom)", scrub: .5, invalidateOnRefresh: true }
      });
      gsap.fromTo(".silk-canvas", { rotation: 0, scale: 1 }, {
        rotation: 18, scale: 1.25, ease: "none",
        scrollTrigger: { trigger: ".reviews-section", start: "top bottom", endTrigger: ".footer", end: "bottom bottom", scrub: 1 }
      });
      const refresh = () => ScrollTrigger.refresh();
      document.querySelectorAll(".faq-list details").forEach(row => row.addEventListener("toggle", refresh));
      const observer = new ResizeObserver(refresh);
      const reviews = document.querySelector(".reviews-section");
      if (reviews) observer.observe(reviews);
      ScrollTrigger.refresh();
      return () => {
        observer.disconnect();
        document.querySelectorAll(".faq-list details").forEach(row => row.removeEventListener("toggle", refresh));
      };
    });
    return () => { media.revert(); sceneMotion.tunnel = 0; sceneMotion.travel = 0; };
  }, { dependencies: [ready, detail, enabled], revertOnUpdate: true });
  return null;
}
