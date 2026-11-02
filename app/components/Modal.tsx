"use client";
import { useEffect, useRef, type ReactNode } from "react";
export default function Modal({open,onClose,label,children,className=""}:{open:boolean;onClose:()=>void;label:string;children:ReactNode;className?:string}) {
  const ref=useRef<HTMLDialogElement>(null);
  const callback=useRef(onClose);
  useEffect(()=>{callback.current=onClose;},[onClose]);
  useEffect(()=>{
    const dialog=ref.current;
    if(!dialog || !open) return;
    const previous=document.body.style.overflow;
    const previousFocus=document.activeElement;
    document.body.style.overflow="hidden";
    dialog.showModal();
    return ()=>{dialog.close();document.body.style.overflow=previous;if(previousFocus instanceof HTMLElement && previousFocus.isConnected)previousFocus.focus({preventScroll:true});};
  },[open]);
  if(!open) return null;
  return <dialog ref={ref} className={`modal ${className}`} aria-label={label} onCancel={e=>{e.preventDefault();callback.current();}} onClick={e=>{if(e.target===e.currentTarget) callback.current();}}>{children}</dialog>;
}
