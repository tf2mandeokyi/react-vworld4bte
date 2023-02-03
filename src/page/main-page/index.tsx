import React, { useEffect, useState } from 'react'
import MapContainer from '../../components/map-container';
import MapLoadingFailPage from '../loading-fail-page';

const MainPage : React.FC = () => {

    const [ scriptSuccess, setScriptSuccess ] = useState<boolean>(false);

    useEffect(() => {
        let scriptLoadingSuccessful: boolean = (window as any).scriptLoadingSuccessful;
        setScriptSuccess(scriptLoadingSuccessful);
        console.log(scriptLoadingSuccessful);
    }, []);
    
    return scriptSuccess ? <MapContainer /> : <MapLoadingFailPage />
}

export default MainPage