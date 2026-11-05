import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import ts from 'typescript';

// Exercise emitted ESM, including the extension that the production runtime resolves.
for(const path of ['lib/catalog','lib/portfolio','api/portfolio']){
  await mkdir('.checks/'+path.split('/')[0],{recursive:true});
  const source=await readFile(path+'.ts','utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  await writeFile('.checks/'+path+'.js',compiled);
}
const {publishedPortfolio}=await import('../../.checks/api/portfolio.js');
const {initialPortfolio}=await import('../../.checks/lib/portfolio.js');

let calls=0;
const upstream=async(url,options)=>{
  calls++;assert.equal(url,'https://santi-apps-portfolio.laghisantiagonicolas.chatgpt.site/api/portfolio');
  assert.deepEqual(options.headers,{Accept:'application/json'});assert(!options.body);assert.equal(options.redirect,'error');
  const data=structuredClone(initialPortfolio);data.projects[0].visible=false;
  return Response.json({data,draft:{private:'never copied'},ownerId:'never copied'});
};
const request=new Request('https://portfolio.test/api/portfolio?draft=1',{headers:{Cookie:'private-session','oai-authenticated-user-id':'forged'}});
const response=await publishedPortfolio(request,upstream);assert.equal(response.status,200);
const result=await response.json();assert.deepEqual(Object.keys(result),['data']);assert.equal(result.data.projects.length,initialPortfolio.projects.length-1);assert.equal(response.headers.get('Cache-Control'),'no-store');
for(const method of ['POST','PUT','PATCH','DELETE'])assert.equal((await publishedPortfolio(new Request('https://portfolio.test/api/portfolio',{method}),upstream)).status,405);
assert.equal(calls,1,'Write requests cannot reach the content service');
const head=await publishedPortfolio(new Request('https://portfolio.test/api/portfolio',{method:'HEAD'}),upstream);assert.equal(head.status,200);assert.equal(await head.text(),'');
const unavailable=await publishedPortfolio(request,async()=>new Response('<html>Sign in</html>',{status:403}));assert.equal(unavailable.status,503);
const invalid=await publishedPortfolio(request,async()=>Response.json({data:{not:'a portfolio'}}));assert.equal(invalid.status,503);
console.log('PASS public endpoint: published content only, hidden apps filtered, no forwarded credentials/query, all writes rejected, service errors handled');
