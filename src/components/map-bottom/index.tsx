import React, { ReactNode, useEffect, useState } from 'react'
import { degreeToDMSString } from '../../lib/dms';
import { prettifyMeter } from '../../lib/meter';
import './index.css'


interface MapBottomElementProps {
    children: ReactNode
}
const MapBottomElement : React.FC<MapBottomElementProps> = ({ children }: MapBottomElementProps) => {
    return <div className="vwmap-bottom-right location-info">{ children }</div>
}


interface MapBottomProps {
    camera_coord: vw.CoordZ;
    cursor_coord: vw.CartographicCoordinate;
}
const MapBottom : React.FC<MapBottomProps> = (props) => {

    const [ cameraAltitudeString, setCameraAltitudeString ] = useState<string>("? m");
    const [ cursorAltitudeString, setCursorAltitudeString ] = useState<string>("? m");
    const [ cursorLatitudeString, setCursorLatitudeString ] = useState<string>();
    const [ cursorLongitudeString, setCursorLongitudeString ] = useState<string>();

    
    useEffect(() => {
        setCameraAltitudeString(prettifyMeter(props.camera_coord.z));
        setCursorAltitudeString(props.cursor_coord.height.toFixed(2) + " m");
        setCursorLatitudeString(degreeToDMSString(props.cursor_coord.latitudeDD, ['N', 'S']));
        setCursorLongitudeString(degreeToDMSString(props.cursor_coord.longitudeDD, ['E', 'W']));
    }, [ props ])


    return <div className="vwmap-bottom">
        <MapBottomElement>내려다보는 높이 { cameraAltitudeString }</MapBottomElement>
        <MapBottomElement>고도 { cursorAltitudeString }</MapBottomElement>
        <MapBottomElement>{ cursorLongitudeString }</MapBottomElement>
        <MapBottomElement>{ cursorLatitudeString }</MapBottomElement>
    </div>
}

export default MapBottom;