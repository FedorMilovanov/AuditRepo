import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './artlab.css';
import {MotherArtLab} from './imena-boga-horeb-3d/ui/MotherArtLab';
createRoot(document.getElementById('artlab-root')!).render(<StrictMode><MotherArtLab modelName="horeb_mother_lookdev_w19e.glb" phase="W19" /></StrictMode>);