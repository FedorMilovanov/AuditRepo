import {StrictMode,useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './artlab.css';
import {HouseArtLab} from './imena-boga-horeb-3d/ui/HouseArtLab';
import {NilePreludeCanvas} from './imena-boga-horeb-3d/ui/NilePreludeCanvas';
function ArtLab(){
 const guided=import.meta.env.DEV&&new URLSearchParams(location.search).get('study')==='w31f';
 const [nile,setNile]=useState(false);
 const heading=useRef<HTMLHeadingElement>(null);
 useEffect(()=>{if(nile)heading.current?.focus();},[nile]);
 if(guided&&nile)return <main className="wrap" data-testid="nile-art-lab">
  <header className="top"><div><p className="kicker">02 / THE NILE</p><h1 ref={heading} tabIndex={-1} className="brand">У берега Нила</h1></div><span className="status">LOOKDEV ONLY · ART HOLD</span></header>
  <div className="layout nile-lab-layout">
   <NilePreludeCanvas labShot moment="basket"/>
   <aside className="side">
    <div><p className="kicker">Исход 2:3–4</p><p>Мать положила младенца в осмолённую корзину и оставила её в тростнике у берега реки. Сестра наблюдала издали.</p></div>
    <div className="note"><p>Смена места и времени. Путь матери из дома здесь не разыгрывается; расположение берега условно.</p></div>
    <button type="button" className="switch" data-testid="nile-lab-return" onClick={()=>setNile(false)}>Вернуться к дому</button>
   </aside>
  </div>
 </main>;
 return <HouseArtLab onContinueToNile={guided?()=>setNile(true):undefined}/>;
}
createRoot(document.getElementById('artlab-root')!).render(<StrictMode><ArtLab/></StrictMode>);
