import React, { ReactNode, useEffect, useState } from 'react'
import LocalizedStrings from 'react-localization';
import { degreeToDMSString } from '../../lib/dms';
import { prettifyMeter } from '../../lib/meter';
import './index.css'


interface IStrings {
    cameraHeight: string;
    cursorHeight: string;
}
const strings = new LocalizedStrings<IStrings>({
    en: {
        cameraHeight: 'Camera:',
        cursorHeight: 'Elevation:'
    },
    ko: {
        cameraHeight: '내려다보는 높이',
        cursorHeight: '고도'
    }
})


interface MapBottomElementProps {
    children: ReactNode
}
const MapBottomElement : React.FC<MapBottomElementProps> = ({ children }: MapBottomElementProps) => {
    return <div className="vwmap-bottom-right location-info">{ children }</div>
}


interface MapBottomProps {
    cameraCoord: ws3d.common.Cartographic;
    cursorCoord: ws3d.common.Cartographic;
}
const MapBottom : React.FC<MapBottomProps> = (props) => {

    const [ cameraAltitudeString, setCameraAltitudeString ] = useState<string>("? m");
    const [ cursorAltitudeString, setCursorAltitudeString ] = useState<string>("? m");
    const [ cursorLatitudeString, setCursorLatitudeString ] = useState<string>();
    const [ cursorLongitudeString, setCursorLongitudeString ] = useState<string>();

    
    useEffect(() => {
        setCameraAltitudeString(prettifyMeter(props.cameraCoord.height));
        setCursorAltitudeString(props.cursorCoord.height.toFixed(2) + " m");
        setCursorLatitudeString(degreeToDMSString(props.cursorCoord.latitudeDD, ['N', 'S']));
        setCursorLongitudeString(degreeToDMSString(props.cursorCoord.longitudeDD, ['E', 'W']));
    }, [ props ])


    return <div className="vwmap-bottom">
        <MapBottomElement>{ strings.formatString(strings.cameraHeight) } { cameraAltitudeString }</MapBottomElement>
        <MapBottomElement>{ strings.formatString(strings.cursorHeight) } { cursorAltitudeString }</MapBottomElement>
        <MapBottomElement>{ cursorLongitudeString }</MapBottomElement>
        <MapBottomElement>{ cursorLatitudeString }</MapBottomElement>
    </div>
}

export default MapBottom;