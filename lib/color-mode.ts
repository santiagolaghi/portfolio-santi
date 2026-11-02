export type ColorMode = "dark" | "light";
export const colorModeKey = "santi-portfolio-color-mode";
export const colorModeEvent = "portfolio:color-mode";
export const colorModeBootstrap = `try{document.documentElement.dataset.colorMode=localStorage.getItem(${JSON.stringify(colorModeKey)})==="light"?"light":"dark"}catch{document.documentElement.dataset.colorMode="dark"}`;

export function getColorMode(): ColorMode {
  return document.documentElement.dataset.colorMode === "light" ? "light" : "dark";
}
export function setColorMode(mode: ColorMode) {
  document.documentElement.dataset.colorMode = mode;
  try { window.localStorage.setItem(colorModeKey, mode); } catch { /* The toggle still works without storage. */ }
  window.dispatchEvent(new Event(colorModeEvent));
}
export function subscribeColorMode(callback: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key !== colorModeKey && event.key !== null) return;
    document.documentElement.dataset.colorMode = event.newValue === "light" ? "light" : "dark";
    callback();
  };
  window.addEventListener(colorModeEvent, callback);
  window.addEventListener("storage", storage);
  return () => { window.removeEventListener(colorModeEvent, callback); window.removeEventListener("storage", storage); };
}
