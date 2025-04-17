"use client";

import { JSX, useCallback, useEffect, useRef, useState } from "react";
import { getCameraPositionFromStorage } from "./camera";
import MapBottom from "./map-bottom";
import MapNotice from "./map-notice";
import RightClickMenu from "./rightclick-menu";

type DMIL = vw.DetailedMouseInteractionListener;

export default function MapContainer(): JSX.Element {

    const [ cameraCartographic, setCameraCartographic ] = useState<ws3d.common.Cartographic>(new ws3d.common.Cartographic());
    const [ cursorCartographic, setCursorCartographic ] = useState<ws3d.common.Cartographic>(new ws3d.common.Cartographic());
    const [ cursorPixel, setCursorPixel ] = useState<ws3d.common.Cartesian2>(new ws3d.common.Cartesian2());
    const [ terrainHeight, setTerrainHeight ] = useState<number>(0);

    const mapObjectRef = useRef<vw.Map>(undefined);
    const closeRef = useRef<() => void>(undefined);
    const requestAnimationRef = useRef<number>(0);

    const closeRightClickMenu = useCallback(() => closeRef.current?.(), [])

    const updateCursorPosition = useCallback((cart2: ws3d.common.Cartesian2) => {
        const cart3 = ws3d.viewer.scene.pickPosition(cart2);
        if(!cart3) return;

        const coord = ws3d.common.Cartographic.fromCartesian(cart3);
        setCursorCartographic(coord);

        const terrainHeight = ws3d.viewer.scene.globe.getHeight(coord);
        setTerrainHeight(terrainHeight);
    }, []);

    const handleMouseMove : DMIL = useCallback(({ x, y }) => {
        const cart2 = new ws3d.common.Cartesian2(x, y);
        setCursorPixel(cart2);
        updateCursorPosition(cart2);
    }, [ updateCursorPosition ])

    const loop = useCallback(() => {
        // Update camera position
        const newCoordinate = ws3d.viewer.scene.camera.positionCartographic;
        if(!cameraCartographic.equals(newCoordinate)) {
            updateCursorPosition(cursorPixel);
            closeRightClickMenu();
            setCameraCartographic(newCoordinate.clone());
        }

        requestAnimationRef.current = requestAnimationFrame(loop);
    }, [ cursorPixel, cameraCartographic, closeRightClickMenu, updateCursorPosition ]);

    useEffect(() => {
        if(mapObjectRef.current) return;

        const cameraPosition = getCameraPositionFromStorage();
        const map = new vw.Map("vwmap", new vw.MapOptions(
            vw.BasemapType.GRAPHIC, "", vw.DensityType.FULL, vw.DensityType.BASIC, false,
            cameraPosition, cameraPosition
        ));

        map.onMouseLeftDown.addEventListener(closeRightClickMenu)
        map.onMouseMove.addEventListener(handleMouseMove)

        mapObjectRef.current = map;
    }, [ cursorPixel, terrainHeight, cameraCartographic, cursorCartographic, closeRightClickMenu, handleMouseMove ])

    useEffect(() => {
        requestAnimationRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(requestAnimationRef.current);
    }, [ cursorPixel, terrainHeight, cameraCartographic, cursorCartographic, loop ])

    return <div className="w-full h-full overflow-hidden relative">
        <div id="vwmap" className="w-full h-full" />
        <MapBottom
            cameraCoord={ cameraCartographic }
            cursorCoord={ cursorCartographic }
        />
        <MapNotice />
        <RightClickMenu cursorCoordinate={ cursorCartographic } terrainHeight={ terrainHeight } closeRef={ closeRef }/>
    </div>
}