"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Link2 } from "lucide-react";
import type { Project } from "@/lib/portfolio";
import { previewKind, realDemoFor } from "@/lib/real-demos";
import { AppIcon } from "./Artwork";
import RealPreview from "./RealPreview";

function Gallery({project}:{project:Project}) {
  const images=[...new Set([project.coverUrl,...project.gallery].filter(Boolean))];
  const [index,setIndex]=useState(0);
  if(!images.length)return <Pending project={project}/>;
  return <div className="gallery-demo"><img src={images[index]} alt={`Captura real de ${project.name}, ${index+1} de ${images.length}`} referrerPolicy="no-referrer"/>
    {images.length>1&&<div className="gallery-controls"><button className="icon-button" onClick={()=>setIndex((index+images.length-1)%images.length)} aria-label="Captura anterior"><ChevronLeft size={18}/></button><span>{index+1} / {images.length}</span><button className="icon-button" onClick={()=>setIndex((index+1)%images.length)} aria-label="Captura siguiente"><ChevronRight size={18}/></button></div>}</div>;
}
function Pending({project}:{project:Project}) {
  return <div className="pending-real-app"><AppIcon type={project.demoType}/><span className="pending-symbol"><Link2 size={18}/></span><h3>Vista previa por conectar</h3><p>La demo de {project.name} estará disponible cuando se vincule su versión original.</p>{project.url&&<a className="button secondary" href={project.url} target="_blank" rel="noopener noreferrer">Abrir app<ExternalLink size={15}/></a>}</div>;
}
export default function Demo({project}:{project:Project}) {
  const kind=previewKind(project),app=realDemoFor(project);
  if(kind==="real"&&app)return <RealPreview app={app}/>;
  if(kind==="gallery")return <Gallery project={project}/>;
  if(kind==="embed")return <div className="embed-demo"><iframe src={project.embedUrl} title={`App original: ${project.name}`} sandbox="allow-scripts allow-forms allow-modals allow-downloads" referrerPolicy="no-referrer"/><p>Si esta app requiere ingresar o no permite una vista integrada, <a href={project.url||project.embedUrl} target="_blank" rel="noopener noreferrer">abrila en otra pestaña ↗</a>.</p></div>;
  return <Pending project={project}/>;
}
