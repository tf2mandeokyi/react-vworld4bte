import { useCallback, useEffect, useRef, useState } from "react";
import MapBottom from "../map-bottom";
import MapNotice from "../map-notice";
import RightClickMenu from "../rightclick-menu";
import { getCameraPositionFromStorage } from "../../lib/local-storage";

import './index.css'


type DMIL = vw.DetailedMouseInteractionListener;


const MapContainer : React.FC = () => {
    
    const [ cameraPosDisplay, setCameraPosDisplay ] = useState<vw.CoordZ>(new vw.CoordZ(0, 0, 0));
    const [ cursorPosDisplay, setCursorPosDisplay ] = useState<vw.CartographicCoordinate>({
        latitudeDD: 0, longitudeDD: 0, height: 0
    });
    const [ lastCursorCoordinate, setLastCursorCoordinate ] = useState<vw.CartographicCoordinate>();

    const mapObjectRef = useRef<vw.Map>();
    const closeRef = useRef<() => void>();


    const closeContextMenu : () => void = () => {
        if(closeRef.current) closeRef.current();
    }


    const handleMouseLeftClick : DMIL = useCallback((windowPosition, ecefPosition, cartographic) => {
        setLastCursorCoordinate(cartographic);
    }, []);


    const handleMouseMove : DMIL = (windowPos, ecefPos, cartographic) => {
        if(!cartographic) return;
        
        if(!mapObjectRef.current) return;
        let map = mapObjectRef.current;

        setLastCursorCoordinate(cartographic);
        setCameraPosDisplay(map.getCurrentPosition().position);
        setCursorPosDisplay(cartographic);
    }


    const handleWheel = useCallback(() => {
        if(closeRef.current) closeRef.current();

        if(!mapObjectRef.current) return;
        let map = mapObjectRef.current;
        
        setCameraPosDisplay(map.getCurrentPosition().position);

        if(!lastCursorCoordinate) return;
        setCursorPosDisplay(lastCursorCoordinate);
    }, [ lastCursorCoordinate ]);


    useEffect(() => {
        if(mapObjectRef.current) return;

        let cameraPosition = getCameraPositionFromStorage();
        let map = new vw.Map("vwmap", new vw.MapOptions(
            vw.BasemapType.GRAPHIC, "", vw.DensityType.FULL, vw.DensityType.BASIC, false,
            cameraPosition, cameraPosition
        ));

        map['onClick'].addEventListener(handleMouseLeftClick);
        map['onMouseMove'].addEventListener(handleMouseMove);

        map['onClick'].addEventListener(closeContextMenu);
        map['onMouseLeftDown'].addEventListener(closeContextMenu);
        map['onMouseRightDown'].addEventListener(closeContextMenu);

        document.onwheel = handleWheel;

        mapObjectRef.current = map;
    })


    return <div className="vwmap-container">
        <div id="vwmap" />
        <MapBottom 
            camera_coord={ cameraPosDisplay }
            cursor_coord={ cursorPosDisplay }
        />
        <MapNotice />
        <RightClickMenu copyCoord={ lastCursorCoordinate } closeRef={ closeRef }/>
    </div>
}

export default MapContainer;