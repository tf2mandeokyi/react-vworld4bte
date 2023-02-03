import { useCallback, useEffect, useRef, useState } from "react";
import { getCameraPositionFromStorage } from "../../lib/local-storage";
import MapBottom from "../map-bottom";
import MapNotice from "../map-notice";
import RightClickMenu from "../rightclick-menu";

import './index.css'


type DMIL = vw.DetailedMouseInteractionListener;


const MapContainer : React.FC = () => {
    
    const [ cameraCartographic, setCameraCartographic ] = useState<ws3d.common.Cartographic>(new ws3d.common.Cartographic());
    const [ cursorCartographic, setCursorCartographic ] = useState<ws3d.common.Cartographic>(new ws3d.common.Cartographic());
    const [ cursorPixel, setCursorPixel ] = useState<ws3d.common.Cartesian2>(new ws3d.common.Cartesian2());
    const [ terrainHeight, setTerrainHeight ] = useState<number>(0);

    const mapObjectRef = useRef<vw.Map>();
    const closeRef = useRef<() => void>();
    const requestAnimationRef = useRef<number>(0);


    const closeRightClickMenu = useCallback(() => {
        closeRef.current?.();
    }, [])


    const updateCursorPosition = useCallback((cart2: ws3d.common.Cartesian2) => {
        let cart3 = ws3d.viewer.scene.pickPosition(cart2);
        if(!cart3) return;

        let coord = ws3d.common.Cartographic.fromCartesian(cart3);
        setCursorCartographic(coord);

        let terrainHeight = ws3d.viewer.scene.globe.getHeight(coord);
        setTerrainHeight(terrainHeight);
    }, []);


    const handleMouseMove : DMIL = useCallback(({ x, y }, _, __) => {
        let cart2 = new ws3d.common.Cartesian2(x, y);
        setCursorPixel(cart2);
        updateCursorPosition(cart2);
    }, [ updateCursorPosition ])


    const loop = useCallback(() => {
        // Update camera position
        let newCoordinate = ws3d.viewer.scene.camera.positionCartographic;
        if(!cameraCartographic.equals(newCoordinate)) {
            updateCursorPosition(cursorPixel);
            closeRightClickMenu();
            setCameraCartographic(newCoordinate.clone());
        }

        requestAnimationRef.current = requestAnimationFrame(loop);
    }, [ updateCursorPosition, cursorPixel, cameraCartographic ]);


    useEffect(() => {
        if(mapObjectRef.current) return;

        let cameraPosition = getCameraPositionFromStorage();
        let map = new vw.Map("vwmap", new vw.MapOptions(
            vw.BasemapType.GRAPHIC, "", vw.DensityType.FULL, vw.DensityType.BASIC, false,
            cameraPosition, cameraPosition
        ));

        map.onMouseLeftDown.addEventListener(closeRightClickMenu)
        map.onMouseMove.addEventListener(handleMouseMove)

        mapObjectRef.current = map;
    })
    useEffect(() => {
        requestAnimationRef.current = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(requestAnimationRef.current);
        }
    })


    return <div className="vwmap-container">
        <div id="vwmap" />
        <MapBottom 
            cameraCoord={ cameraCartographic }
            cursorCoord={ cursorCartographic }
        />
        <MapNotice />
        <RightClickMenu cursorCoordinate={ cursorCartographic } terrainHeight={ terrainHeight } closeRef={ closeRef }/>
    </div>
}

export default MapContainer;