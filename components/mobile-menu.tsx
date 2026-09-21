"use client";
import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "@phosphor-icons/react";

export default function MobileMenu({open,close}:{open:boolean;close:()=>void}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    if(!open){ref.current?.close();return;}
    ref.current?.showModal();
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const breakpoint=matchMedia("(min-width: 768px)");
    const dismiss=()=>{if(breakpoint.matches)close();};
    breakpoint.addEventListener("change",dismiss);
    return ()=>{document.body.style.overflow=previous;ref.current?.close();breakpoint.removeEventListener("change",dismiss);};
  },[open,close]);
  return <dialog ref={ref} className="mobile-menu-dialog" aria-label="Explore Remorse" onCancel={close}>
    <div className="mobile-menu-top"><span>REMORSE / EXPLORE</span><button className="icon-button" aria-label="Close menu" onClick={close}><X size={22}/></button></div>
    <p className="mobile-menu-intro">Your next<br/><em>move starts here.</em></p>
    <nav aria-label="Mobile navigation">{[["Products","products"],["Why Remorse","why-remorse"],["Reviews","reviews"],["FAQ","faq"]].map(([label,id],i)=><a href={`/#${id}`} key={id} onClick={close}><small>0{i+1}</small><span>{label}</span><ArrowUpRight size={25}/></a>)}</nav>
    <div className="mobile-menu-bottom"><span>Your game. Your way.</span><span>REMORSE.DEV</span></div>
  </dialog>;
}
