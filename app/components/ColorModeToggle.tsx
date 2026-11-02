"use client";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { getColorMode, setColorMode, subscribeColorMode } from "@/lib/color-mode";

export default function ColorModeToggle({className=""}:{className?:string}) {
  const mode = useSyncExternalStore(subscribeColorMode, getColorMode, () => "dark");
  const light = mode === "light";
  const label = light ? "Activar modo oscuro" : "Activar modo claro";
  return <button className={"color-mode-toggle " + className} type="button" onClick={() => setColorMode(light ? "dark" : "light")}
    aria-label={label} aria-pressed={light} title={label}>
    {light ? <Moon size={17}/> : <Sun size={17}/>}<span>{light ? "Modo oscuro" : "Modo claro"}</span>
  </button>;
}
