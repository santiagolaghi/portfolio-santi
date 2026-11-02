import manifest from "./real-demo-manifest.json";
import type { Project } from "./portfolio";

export type RealApp = keyof typeof manifest;
export const realApps = {
  tnt: { name: "TNT", source: "Trastornadores · 6138c10", url: "https://github.com/santiagolaghi/Trastornadores" },
  finance: { name: "Finanzas Pro", source: "finanzas · 2a4a5ac", url: "https://github.com/santiagolaghi/finanzas" },
  day: { name: "Día a Día", source: "Versión original · 21/10/2026", url: "https://dia-a-dia-pareja.vercel.app/" },
} as const;
export function realDemoFor(project: Project): RealApp | null {
  if (!["auto", "real"].includes(project.previewMode)) return null;
  if (project.realApp && project.realApp in realApps) return project.realApp;
  if (project.previewMode === "real") return null;
  return ({tnt:"tnt",finanzas:"finance",dia:"day"} as Record<string, RealApp>)[project.id] || null;
}
export function previewKind(project: Project): "real" | "embed" | "gallery" | "none" {
  if (realDemoFor(project)) return "real";
  if (project.previewMode === "none" || project.previewMode === "real") return "none";
  if (project.previewMode === "embed" || project.previewMode === "auto" && project.demoType === "embed") return project.embedUrl ? "embed" : "none";
  if (project.previewMode === "gallery" || project.previewMode === "auto" && (project.coverUrl || project.gallery.length)) return "gallery";
  return "none";
}
export { manifest as realDemoManifest };
