"use client";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { realDemoManifest, realApps, type RealApp } from "@/lib/real-demos";
import { demoDocument, validDemoRoute, validDemoState } from "@/lib/real-demo-document";

type Bundle = { app: RealApp; pages: Record<string,string>; files: Record<string,string>; resources: string[] };
const bundles = new Map<RealApp,Promise<Bundle>>();
const resources = new Map<string,Promise<string>>();
function loadBundle(app: RealApp) {
  if (!bundles.has(app)) bundles.set(app, fetch(realDemoManifest[app].url).then(async r => {
    if (!r.ok) throw new Error("No pudimos cargar la app. Volvé a intentar.");
    const result = await r.json() as Bundle;
    if (result.app !== app || !result.pages["/"]) throw new Error("La app no está disponible.");
    return result;
  }).catch(error => { bundles.delete(app); throw error; }));
  return bundles.get(app)!;
}

export default function RealPreview({app,miniature=false}:{app:RealApp;miniature?:boolean}) {
  const frame=useRef<HTMLIFrameElement>(null),container=useRef<HTMLDivElement>(null);
  const nonce=useRef("");
  const state=useRef<Record<string,unknown>>({});
  const bundle=useRef<Bundle|null>(null);
  const [html,setHtml]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(true),[attempt,setAttempt]=useState(0),[enabled,setEnabled]=useState(!miniature);
  useEffect(()=>{
    if(!miniature || !container.current)return;
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setEnabled(true);observer.disconnect();}},{rootMargin:"160px"});
    observer.observe(container.current);return()=>observer.disconnect();
  },[miniature]);
  useEffect(()=>{
    if(!enabled)return;
    let active=true;
    nonce.current=crypto.randomUUID();state.current={};setError("");setLoading(true);
    loadBundle(app).then(value=>{if(!active)return;bundle.current=value;setHtml(demoDocument(value,"/",nonce.current,{},miniature));}).catch(e=>{if(active){setError(e.message);setLoading(false);}});
    const timeout=setTimeout(()=>{if(active)setLoading(false);},20000);
    return()=>{active=false;clearTimeout(timeout);};
  },[app,attempt,miniature,enabled]);
  useEffect(()=>{
    const receive=async(event:MessageEvent)=>{
      if(event.source!==frame.current?.contentWindow || event.origin!=="null" || event.data?.nonce!==nonce.current || event.data?.app!==app)return;
      const message=event.data;
      if(message.type==="portfolio-demo:ready"){setLoading(false);return;}
      if(message.type==="portfolio-demo:navigate"&&!miniature){
        try{
          const route=message.route;
          if(!bundle.current||!validDemoRoute(bundle.current,route))throw new Error("Esa pantalla se abre en la app publicada.");
          if(!validDemoState(message.state))throw new Error("No pudimos conservar los cambios de la prueba.");
          state.current=message.state;setError("");setLoading(true);
          // Remount even when the same original route is requested again.
          nonce.current=crypto.randomUUID();setHtml(demoDocument(bundle.current!,route,nonce.current,state.current,false));
        }catch(e){setError(e instanceof Error?e.message:"No pudimos abrir esa pantalla.");}
      }
      if(message.type==="portfolio-demo:resource"){
        const requested=message.path;
        if(!["tnt","bible"].includes(app)||typeof requested!=="string"||!bundle.current?.resources.includes(requested)||typeof message.id!=="string"||message.id.length>12)return;
        const responseNonce=nonce.current,source=event.source as Window;
        try{
          const filename=requested.split("/").at(-1)!;
          if(!resources.has(app+":"+filename))resources.set(app+":"+filename,fetch("/real-demos/"+(app==="tnt"?"tnt-bible/":"bible-data/")+filename).then(async r=>{if(!r.ok)throw new Error("No pudimos cargar este libro.");return r.text();}).catch(e=>{resources.delete(app+":"+filename);throw e;}));
          const content=await resources.get(app+":"+filename)!;
          if(responseNonce===nonce.current)source.postMessage({type:"portfolio-demo:resource-result",nonce:responseNonce,id:message.id,content},"*");
        }catch(e){source.postMessage({type:"portfolio-demo:resource-result",nonce:responseNonce,id:message.id,error:e instanceof Error?e.message:"Error de carga"},"*");}
      }
    };
    window.addEventListener("message",receive);return()=>window.removeEventListener("message",receive);
  },[app,miniature]);
  return <div ref={container} inert={miniature||undefined} className={"real-preview "+(miniature?"real-preview-mini":"")}>
    {html&&<iframe key={nonce.current} ref={frame} srcDoc={html} title={"Demo de "+realApps[app].name} sandbox="allow-scripts allow-forms allow-modals allow-downloads" referrerPolicy="no-referrer" tabIndex={miniature?-1:0} aria-hidden={miniature||undefined} />}
    {loading&&<div className="real-preview-loading" role={miniature?undefined:"status"}><LoaderCircle size={miniature?20:27} className="spin"/><span>{miniature?"Cargando app…":"Abriendo la app original…"}</span></div>}
    {error&&!miniature&&<div className={"real-preview-error "+(html?"preview-inline-error":"")} role="alert"><p>{error}</p><button onClick={()=>html?setError(""):setAttempt(n=>n+1)}><RefreshCw size={14}/>{html?"Continuar":"Reintentar"}</button></div>}
  </div>;
}
