import ReactDOM from 'react-dom/client';
import MapContainer from './components/map-container';

import './index.css';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <MapContainer />
);