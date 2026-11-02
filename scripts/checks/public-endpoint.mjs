import assert from 'node:assert/strict';
import {publishedPortfolio} from '../../api/portfolio.ts';
import {initialPortfolio} from '../../lib/portfolio.ts';

let calls=0;
const upstream=async(url,options)=>{
  calls++;assert.equal(url,'https://santi-apps-portfolio.laghisantiagonicolas.chatgpt.site/api/portfolio');
  assert.deepEqual(options.headers,{Accept:'application/json'});assert(!options.body);assert.equal(options.redirect,'error');
  const data=structuredClone(initialPortfolio);data.projects[0].visible=false;
  return Response.json({data,draft:{private:'never copied'},ownerId:'never copied'});
};
const request=new Request('https://portfolio.test/api/portfolio?draft=1',{headers:{Cookie:'private-session','oai-authenticated-user-id':'forged'}});
const response=await publishedPortfolio(request,upstream);assert.equal(response.status,200);
const result=await response.json();assert.deepEqual(Object.keys(result),['data']);assert.equal(result.data.projects.length,4);assert.equal(response.headers.get('Cache-Control'),'no-store');
for(const method of ['POST','PUT','PATCH','DELETE'])assert.equal((await publishedPortfolio(new Request('https://portfolio.test/api/portfolio',{method}),upstream)).status,405);
assert.equal(calls,1,'Write requests cannot reach the content service');
const head=await publishedPortfolio(new Request('https://portfolio.test/api/portfolio',{method:'HEAD'}),upstream);assert.equal(head.status,200);assert.equal(await head.text(),'');
const unavailable=await publishedPortfolio(request,async()=>new Response('<html>Sign in</html>',{status:403}));assert.equal(unavailable.status,503);
const invalid=await publishedPortfolio(request,async()=>Response.json({data:{not:'a portfolio'}}));assert.equal(invalid.status,503);
console.log('PASS public endpoint: published content only, hidden apps filtered, no forwarded credentials/query, all writes rejected, service errors handled');
