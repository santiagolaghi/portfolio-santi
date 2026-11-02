import {useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import Portfolio from '@/app/components/Portfolio';
import {portfolioSchema,type PortfolioData} from '@/lib/portfolio';
import '@/app/globals.css';
import '@/app/real-demos.css';
import '@/app/appearance.css';
import './public.css';

function App(){
  const [data,setData]=useState<PortfolioData|null>(null),[error,setError]=useState(''),[retry,setRetry]=useState(0);
  useEffect(()=>{
    const controller=new AbortController();setError('');
    fetch('/api/portfolio',{signal:controller.signal,credentials:'omit',cache:'no-store'})
      .then(async response=>{if(!response.ok)throw Error('No pudimos cargar el portfolio. Volvé a intentar en un momento.');return response.json();})
      .then(result=>{const published=portfolioSchema.parse(result.data);setData(published);document.title=`${published.profile.name} — ${published.profile.role}`;})
      .catch(error=>{if(!controller.signal.aborted)setError(error instanceof Error?error.message:'No pudimos abrir el portfolio.');});
    return()=>controller.abort();
  },[retry]);
  if(data)return <Portfolio initialData={data} canEdit={false}/>;
  return <main className="public-loading" aria-live="polite"><span className="public-loading-brand">Portfolio</span>{error?<><p>{error}</p><button onClick={()=>setRetry(value=>value+1)}>Volver a intentar</button></>:<p>Abriendo portfolio…</p>}</main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
