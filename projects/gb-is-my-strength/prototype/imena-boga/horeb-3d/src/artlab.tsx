import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './artlab.css';
import {HouseArtLab} from './imena-boga-horeb-3d/ui/HouseArtLab';
createRoot(document.getElementById('artlab-root')!).render(<StrictMode><HouseArtLab/></StrictMode>);
