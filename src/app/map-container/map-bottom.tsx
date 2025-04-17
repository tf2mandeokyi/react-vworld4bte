import { JSX, ReactNode, useEffect, useState } from "react"
import { degreeToDMSString, prettifyMeter } from "./units";

interface MapBottomElementProps {
    children: ReactNode
}

function MapBottomElement({ children }: MapBottomElementProps): JSX.Element {
    return <div className="float-right mx-[10px] h-[var(--vwmap-bottom-height)] leading-[var(--vwmap-bottom-height)]">
        { children }
    </div>
}

interface MapBottomProps {
    cameraCoord: ws3d.common.Cartographic;
    cursorCoord: ws3d.common.Cartographic;
}

export default function MapBottom({ cameraCoord, cursorCoord }: MapBottomProps): JSX.Element {

    const [ cameraAltitudeString, setCameraAltitudeString ] = useState<string>("? m");
    const [ cursorAltitudeString, setCursorAltitudeString ] = useState<string>("? m");
    const [ cursorLatitudeString, setCursorLatitudeString ] = useState<string>();
    const [ cursorLongitudeString, setCursorLongitudeString ] = useState<string>();
    
    useEffect(() => {
        setCameraAltitudeString(prettifyMeter(cameraCoord.height));
        setCursorAltitudeString(cursorCoord.height.toFixed(2) + " m");
        setCursorLatitudeString(degreeToDMSString(cursorCoord.latitudeDD, ['N', 'S']));
        setCursorLongitudeString(degreeToDMSString(cursorCoord.longitudeDD, ['E', 'W']));
    }, [ cameraCoord, cursorCoord ])

    return <div className="bottom-0 left-0 right-0 text-[16px] text-right px-[30px] text-white absolute bg-[rgba(0,0,0,0.6)] overflow-hidden h-[var(--vwmap-bottom-height)]">
        <MapBottomElement>내려다보는 높이 { cameraAltitudeString }</MapBottomElement>
        <MapBottomElement>고도 { cursorAltitudeString }</MapBottomElement>
        <MapBottomElement>{ cursorLongitudeString }</MapBottomElement>
        <MapBottomElement>{ cursorLatitudeString }</MapBottomElement>
    </div>
}