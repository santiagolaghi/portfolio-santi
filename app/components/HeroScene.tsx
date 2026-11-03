import { studioPortraitUrl, type PortfolioData } from "@/lib/portfolio";

export default function HeroScene({ profile }: { profile: PortfolioData["profile"] }) {
  const photoUrl = profile.photoUrl || studioPortraitUrl;
  const studioPortrait = photoUrl === studioPortraitUrl;
  return <div className={"hero-scene" + (studioPortrait ? " studio-portrait" : "")}>
    <img className={"scene-portrait own-portrait" + (studioPortrait ? " studio-cutout" : "")}
      src={photoUrl}
      alt={profile.name}
      fetchPriority="high" referrerPolicy="no-referrer" />
  </div>;
}
