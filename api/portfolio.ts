import {portfolioSchema,publicPortfolio} from '../lib/portfolio.js';

// Read only bridge: never forward caller headers, cookies, query strings or bodies.
const publishedUrl='https://santi-apps-portfolio.laghisantiagonicolas.chatgpt.site/api/portfolio';
export async function publishedPortfolio(request:Request,upstream:typeof fetch=fetch):Promise<Response>{
  if(request.method!=='GET'&&request.method!=='HEAD')return Response.json({error:'Este sitio es de solo lectura.'},{status:405,headers:{Allow:'GET, HEAD'}});
  try{
    const response=await upstream(publishedUrl,{headers:{Accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(15000),cache:'no-store'});
    if(!response.ok||!response.headers.get('Content-Type')?.includes('application/json'))throw Error('Public content unavailable');
    const result=await response.json();const data=publicPortfolio(portfolioSchema.parse(result.data));
    const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
    return new Response(request.method==='HEAD'?null:JSON.stringify({data}),{status:200,headers});
  }catch{return Response.json({error:'El contenido público no está disponible por el momento.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
export const GET=(request:Request)=>publishedPortfolio(request);
export const HEAD=GET;
export const POST=GET;
export const PUT=GET;
export const PATCH=GET;
export const DELETE=GET;
