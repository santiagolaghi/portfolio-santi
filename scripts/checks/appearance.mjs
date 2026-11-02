import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
import {colorModeKey,colorModeEvent,colorModeBootstrap,getColorMode,setColorMode,subscribeColorMode} from '../../lib/color-mode.ts';

const dom=new JSDOM('<html data-color-mode="dark"><body></body></html>',{url:'https://portfolio.test',runScripts:'outside-only'});
const w=dom.window;
const previous=Object.fromEntries(['window','document','Event'].map(key=>[key,globalThis[key]]));
try{
  Object.assign(globalThis,{window:w,document:w.document,Event:w.Event});
  w.eval(colorModeBootstrap);assert.equal(getColorMode(),'dark');
  w.localStorage.setItem(colorModeKey,'light');w.eval(colorModeBootstrap);assert.equal(getColorMode(),'light','Saved light preference is restored before hydration');
  let updates=0;const unsubscribe=subscribeColorMode(()=>updates++);
  setColorMode('dark');assert.equal(getColorMode(),'dark');assert.equal(w.localStorage.getItem(colorModeKey),'dark');assert.equal(updates,1);
  setColorMode('light');assert.equal(w.localStorage.getItem(colorModeKey),'light');assert.equal(updates,2);
  const reload=new JSDOM('<html data-color-mode="dark"></html>',{url:'https://portfolio.test',runScripts:'outside-only'});
  reload.window.localStorage.setItem(colorModeKey,w.localStorage.getItem(colorModeKey));reload.window.eval(colorModeBootstrap);
  assert.equal(reload.window.document.documentElement.dataset.colorMode,'light','Preference survives a page reload');reload.window.close();
  w.dispatchEvent(new w.StorageEvent('storage',{key:colorModeKey,newValue:'dark'}));assert.equal(getColorMode(),'dark');assert.equal(updates,3,'Another tab updates all appearance controls');
  unsubscribe();w.dispatchEvent(new w.Event(colorModeEvent));assert.equal(updates,3);
  Object.defineProperty(w,'localStorage',{configurable:true,get(){throw Error('Storage is blocked');}});
  w.eval(colorModeBootstrap);assert.equal(getColorMode(),'dark');
  assert.doesNotThrow(()=>setColorMode('light'));assert.equal(getColorMode(),'light','Toggle works with blocked storage');
  console.log('PASS appearance: dark default, saved light mode, toggling, reload, tab sync and blocked storage');
  const css=await readFile('app/appearance.css','utf8');
  const luminance=hex=>hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
  const light=css.split(':root[data-color-mode="light"]')[1];
  const colors=new Set([...light.matchAll(/(?<![-\w])color:(#[a-f0-9]{6})(?![a-f0-9])/g)].map(m=>m[1]));
  for(const foreground of colors)assert(contrast(foreground,'#f6f7fc')>=4.5,`Light text ${foreground} keeps readable contrast`);
  const accents=[...light.matchAll(/--accent:(#[a-f0-9]{6})/g)].map(m=>m[1]);assert.equal(accents.length,5);
  for(const accent of accents)assert(contrast(accent,'#f6f7fc')>=4.5,`Accent ${accent} remains readable on light surfaces`);
  console.log('PASS appearance: five readable accent palettes and light text contrast');
}finally{Object.assign(globalThis,previous);dom.window.close();}
