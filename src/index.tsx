import ReactDOM from 'react-dom/client';
import MainPage from './page/main-page';

import './font/NotoSans/index.css';
import './index.css';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <MainPage/>
);