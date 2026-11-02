"use client";
import { useId, lazy, Suspense } from "react";
import { ArrowUpRight, Link2 } from "lucide-react";
import type { Project } from "@/lib/portfolio";
import { realDemoFor } from "@/lib/real-demos";
const RealPreview = lazy(() => import("./RealPreview"));

export function ProductGlyph({ type }: { type: Project["demoType"] }) {
  const id = useId().replace(/:/g, "");
  const tone = type === "tnt" ? ["#ffb04e", "#ee492c"] : type === "bible" ? ["#c675ff", "#7430da"]
    : type === "finance" ? ["#d8ff92", "#7bb62e"] : ["#ffe079", "#d89e20"];
  return <span className={"product-glyph glyph-" + type} aria-hidden="true">
    <svg viewBox="0 0 40 40" fill="none">
      <defs><linearGradient id={id} x1="4" y1="3" x2="33" y2="37" gradientUnits="userSpaceOnUse"><stop stopColor={tone[0]} /><stop offset="1" stopColor={tone[1]} /></linearGradient></defs>
      {type === "tnt" ? <>
        <path d="M12 18C14 11 22 6 35 3C36 16 31 27 24 29L12 18Z" fill={"url(#" + id + ")"} />
        <path d="M14 16L5 20L4 30L16 25M22 27L20 37L29 33L31 22" fill="#fa6738" />
        <circle cx="26" cy="13" r="4.2" fill="#a63320" /><circle cx="27" cy="12" r="2.6" fill="#f8be63" />
        <path d="M11 23C1 25 3 36 3 37C11 36 16 30 16 27Z" fill="#ffa345" /><path d="M11 27L7 33L14 29" fill="#ffdf79" />
      </> : type === "bible" ? <>
        <path d="M3 8C10 5 15 7 20 10V35C15 32 10 31 3 33V8Z" fill={"url(#" + id + ")"} />
        <path d="M20 10C25 6 30 5 37 8V33C30 31 25 32 20 35V10Z" fill="#a958f0" />
        <path d="M20 10V35M7 6V29M33 6V29" stroke="#d196ff" strokeWidth="1.5" />
      </> : type === "finance" ? <>
        <rect x="4" y="24" width="7" height="13" rx="1" fill={"url(#" + id + ")"} />
        <rect x="16" y="15" width="7" height="22" rx="1" fill={"url(#" + id + ")"} />
        <rect x="28" y="4" width="7" height="33" rx="1" fill={"url(#" + id + ")"} />
      </> : type === "notes" ? <>
        <rect x="6" y="3" width="28" height="34" rx="6" fill={"url(#" + id + ")"} />
        <path d="M13 13H27M13 20H27M13 27H23" stroke="#8b641a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M9 6H30" stroke="#fff0ac" strokeOpacity=".65" strokeWidth="1.5" />
      </> : type === "day" ? <>
        <circle cx="20" cy="20" r="8" fill={"url(#" + id + ")"} />
        <path d="M20 2V7M20 33V38M2 20H7M33 20H38M7 7L10 10M30 30L33 33M33 7L30 10M10 30L7 33" stroke="#f4c750" strokeWidth="2.5" strokeLinecap="round" />
      </> : <><rect x="4" y="4" width="32" height="32" rx="8" fill={"url(#" + id + ")"} /><path d="M13 20H27M20 13V27" stroke="#fff0b5" strokeWidth="2.5" strokeLinecap="round" /></>}
    </svg>
  </span>;
}

export default function ReferenceArtwork({ project }: { project: Project }) {
  const cover = project.coverUrl || project.gallery[0];
  if (cover) return <div className="reference-artwork cover-preview"><img src={cover} alt="" loading="lazy" referrerPolicy="no-referrer" /></div>;
  const app = realDemoFor(project);
  return <div className={"reference-artwork original-artwork preview-" + project.demoType} aria-hidden="true">
    <div className="preview-window">
      <div className="preview-top"><span /><span /><span /><i /><span className="preview-maximize"><ArrowUpRight size={10} /></span></div>
      {app ? <Suspense fallback={<div className="artwork-pending"><ProductGlyph type={project.demoType}/></div>}><RealPreview app={app} miniature /></Suspense>
        : <div className="artwork-pending"><ProductGlyph type={project.demoType}/><b>{project.name}</b><span><Link2 size={12}/>Vista previa por conectar</span></div>}
    </div>
  </div>;
}

export function WorldMap() {
  const id = useId().replace(/:/g, "");
  return <svg className="world-map" viewBox="0 0 260 150" aria-hidden="true">
    <defs>
      <pattern id={id + "-dots"} width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#6c7594" /></pattern>
      <clipPath id={id + "-land"}>
        <path d="M17 39L31 20L54 12L75 15L81 26L98 30L103 39L87 46L76 61L67 62L59 75L50 70L44 59L31 55L23 49ZM69 79L83 77L99 91L100 109L88 123L82 143L74 137L73 119L63 102L61 87ZM110 32L121 23L137 24L142 32L138 45L126 49L117 45L113 39ZM123 52L141 48L160 61L158 82L149 99L137 104L126 87L120 72ZM144 24L163 14L182 15L193 24L219 25L240 42L231 55L214 57L208 71L198 75L188 59L174 55L159 43L142 44ZM212 101L231 95L247 109L241 124L221 124L209 115ZM103 8L114 2L121 6L116 16L107 19Z" />
      </clipPath>
    </defs>
    <rect width="260" height="150" fill={"url(#" + id + "-dots)"} clipPath={"url(#" + id + "-land)"} />
    <circle cx="79" cy="121" r="9" fill="#caff6914" /><circle cx="79" cy="121" r="4" fill="#caff6933" /><circle cx="79" cy="121" r="2" fill="#caff69" />
  </svg>;
}
