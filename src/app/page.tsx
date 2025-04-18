"use client";

import React, { useEffect, useState } from "react";
import MapContainer from "./map-container";
import MapLoadingFailPage from "./map-loading-fail";
import VWorldScript from "./vworld-script";

const MapPage = () => {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const checkForWs3d = setInterval(() => {
            if (typeof window.vw !== "undefined") {
                setScriptLoaded(true);
                clearInterval(checkForWs3d);
            }
        }, 100);

        return () => clearInterval(checkForWs3d);
    }, []);

    return <>
        <VWorldScript
            onLoad={ () => setScriptLoaded(true) }
            onError={ () => setScriptLoaded(false) }
        />
        {scriptLoaded ? <MapContainer /> : <MapLoadingFailPage />}
    </>
};

export default MapPage;
