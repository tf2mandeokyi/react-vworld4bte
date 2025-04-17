"use client";

import React, { useEffect, useState } from "react";
import MapContainer from "./map-container";
import MapLoadingFailPage from "./map-loading-fail";

const MapPage = () => {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const checkForWs3d = setInterval(() => {
            if (typeof window.vw !== "undefined") {
                setScriptLoaded(true);
                clearInterval(checkForWs3d);
            }
        }, 1000);

        return () => clearInterval(checkForWs3d);
    }, []);

    return scriptLoaded && typeof window.ws3d !== "undefined"
        ? (<MapContainer />)
        : (<MapLoadingFailPage />);
};

export default MapPage;
