import { useCallback, useEffect, useRef, useState } from 'react'
import { BTE_PROJECTION } from 'bte-projection';
import { textToClipboard } from '../../lib/clipboard';
import './index.css'


interface RightClickMenuProps {
    cursorCoordinate?: ws3d.common.Cartographic,
    terrainHeight: number,
    closeRef: React.MutableRefObject<(() => void) | undefined>;
}


const RightClickMenu : React.FC<RightClickMenuProps> = (props) => {

    const [ coordinate, setCoordinate ] = useState(new ws3d.common.Cartographic());
    const [ terrainHeight, setTerrainHeight ] = useState<number>(0);
    const [ distortionRate, setDistortionRate ] = useState<number>(1);
    const [ anchorPoint, setAnchorPoint ] = useState<vw.Pixel>({ x: 0, y: 0 });
    const [ show, setShow ] = useState<boolean>(false);

    const menuRef = useRef<HTMLUListElement>(null);
    const mouseDownPosRef = useRef<vw.Pixel>();


    props.closeRef.current = () => {
        setShow(false);
    };


    const clipboard = useCallback((text: string) => {
        textToClipboard(text);
        setShow(false);
    }, []);


    const getDistortion = useCallback((coord: ws3d.common.Cartographic) => {
        let { longitudeDD: lon, latitudeDD: lat } = coord;
        let distortion = BTE_PROJECTION.getDistortion({ lon, lat });
        
        return distortion.value;
    }, []);


    const handleMouseMove = useCallback(({ x, y }: MouseEvent) => {
        mouseDownPosRef.current = { x, y };
    }, []);


    const handleContextMenu = useCallback((event: MouseEvent) => {
        event.preventDefault();
        if(!props.cursorCoordinate) return;

        const downPos = mouseDownPosRef.current;
        if(downPos && downPos.x !== event.pageX && downPos.y !== event.pageY) return;

        if(!menuRef.current) return;
        let { clientWidth, clientHeight } = menuRef.current;

        let x = Math.min(event.pageX + clientWidth,  window.innerWidth)  - clientWidth ;
        let y = Math.min(event.pageY + clientHeight, window.innerHeight) - clientHeight;

        setCoordinate(props.cursorCoordinate);
        setDistortionRate(getDistortion(props.cursorCoordinate));
        setTerrainHeight(props.terrainHeight);
        setAnchorPoint({ x, y })
        setShow(true);
    }, [ props, getDistortion ]);


    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('contextmenu', handleContextMenu);
        }
    });


    return (
        <ul 
            className="rightclickmenu"
            ref={ menuRef }
            style={{
                top: anchorPoint.y,
                left: anchorPoint.x,
                visibility: show ? 'visible' : 'hidden'
            }}
        >
            <li onClick={ () => clipboard(`${coordinate?.latitudeDD}, ${coordinate?.longitudeDD}`) }>
                { coordinate?.latitudeDD.toFixed(5) }, { coordinate?.longitudeDD.toFixed(5) }
            </li>
            <li onClick={ () => clipboard(`${coordinate?.latitudeDD}, ${coordinate?.longitudeDD} ${coordinate?.height}`) }>
                고도 = { coordinate?.height.toFixed(2) }m
            </li>
            <li>
                지형 고도 ≈ { terrainHeight.toFixed(5) }m
            </li>
            <li>
                왜곡 값 ≈ { distortionRate.toFixed(5) }m
            </li>
        </ul>
    )
}

export default RightClickMenu;