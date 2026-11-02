export type RealDemoBundle = {app:string;pages:Record<string,string>;files:Record<string,string>;resources:string[]};
export const demoCsp = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; frame-src 'none'; form-action 'none'; object-src 'none'; base-uri 'none'";
export function validDemoRoute(bundle: RealDemoBundle, route: unknown): route is string {
  if(typeof route!=="string"||route.length>2000||!route.startsWith("/")||route.startsWith("//"))return false;
  try{const parsed=new URL(route,"https://demo.invalid");return parsed.origin==="https://demo.invalid"&&Object.hasOwn(bundle.pages,parsed.pathname.replace(/\/+$/,"")||"/");}catch{return false;}
}
export function demoDocument(bundle: RealDemoBundle, route: string, nonce: string, state: Record<string,unknown>, miniature: boolean) {
  if(!validDemoRoute(bundle,route))throw new Error("Esta pantalla todavía no está incluida en la demo.");
  const path=new URL(route,"https://demo.invalid").pathname.replace(/\/+$/,"")||"/";
  let html=bundle.pages[path].replace(/\/\*__REAL_DEMO_FILE:([a-f0-9]{20})__\*\//g,(_,id:string)=>{
    const file=bundle.files[id];if(typeof file!=="string")throw new Error("Falta un recurso de la app.");
    return file.replace(/<\/script/gi,"<\\/script");
  });
  const config=JSON.stringify({app:bundle.app,route,nonce,state,miniature}).replace(/</g,"\\u003c");
  html=html.replace("__PORTFOLIO_DEMO_CONFIG__",()=>config);
  return html.replace(/<head>/i,`<head><meta http-equiv="Content-Security-Policy" content="${demoCsp}">`);
}
export function validDemoState(value: unknown): value is Record<string,unknown> {
  if(!value||typeof value!=="object"||Array.isArray(value))return false;
  try{
    if(JSON.stringify(value).length>=1_500_000)return false;
    const inspect=(item:unknown,depth=0):boolean=>{
      if(depth>40)return false;
      if(!item||typeof item!=="object")return true;
      return Object.entries(item).every(([key,child])=>!["__proto__","constructor","prototype"].includes(key)&&inspect(child,depth+1));
    };
    return inspect(value);
  }catch{return false;}
}
