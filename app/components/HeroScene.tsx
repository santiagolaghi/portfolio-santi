import type { PortfolioData } from "@/lib/portfolio";

export default function HeroScene({ profile }: { profile: PortfolioData["profile"] }) {
  return <div className="hero-scene">
    <img className={"scene-portrait " + (profile.photoUrl ? "own-portrait" : "")}
      src={profile.photoUrl || "/assets/portrait-reference.webp"}
      alt={profile.photoUrl ? profile.name : "Retrato ilustrativo de la propuesta; reemplazable por tu foto en el editor"}
      fetchPriority="high" referrerPolicy="no-referrer" />
    {!profile.photoUrl && <small className="scene-sample-note">Imagen de muestra</small>}
  </div>;
}
