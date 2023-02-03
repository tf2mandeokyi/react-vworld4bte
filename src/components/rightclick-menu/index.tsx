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
    const [ buildingHeight, setBuildingHeight ] = useState<number>(0);
    const [ modifiedHeight, setModifiedHeight ] = useState<number>(0);
    const [ distortionRate, setDistortionRate ] = useState<number>(1);
    const [ anchorPoint, setAnchorPoint ] = useState<vw.Pixel>({ x: 0, y: 0 });
    const [ show, setShow ] = useState<boolean>(false);

    const menuRef = useRef<HTMLUListElement>(null);
    const mouseDownPosRef = useRef<vw.Pixel>();


    props.closeRef.current = () => {
        setShow(false);
    };


    const clipboard = useCallback((text: string | number) => {
        if(typeof text === 'number') text = `${text}`
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


    const updatePosition = useCallback(({ x, y }: { x: number, y: number }) => {
        if(!menuRef.current) return;
        let { clientWidth, clientHeight } = menuRef.current;

        let anchorX = Math.min(x + clientWidth,  window.innerWidth)  - clientWidth;
        let anchorY = Math.min(y + clientHeight, window.innerHeight) - clientHeight;

        setAnchorPoint({ x: anchorX, y: anchorY })
    }, [])


    const handleContextMenu = useCallback((event: MouseEvent) => {
        event.preventDefault();
        if(!props.cursorCoordinate) return;

        const downPos = mouseDownPosRef.current;
        if(!downPos || downPos.x !== event.pageX || downPos.y !== event.pageY) return;
        updatePosition(downPos);

        let { terrainHeight, cursorCoordinate: coordinate } = props;
        let { height } = coordinate;
        let buildingHeight = Math.max(height - terrainHeight, 0);
        let distortion = getDistortion(coordinate);

        setCoordinate(coordinate);
        setDistortionRate(distortion);
        setTerrainHeight(terrainHeight);
        setBuildingHeight(buildingHeight);
        setModifiedHeight(terrainHeight + distortion * buildingHeight)
        setShow(true);
    }, [ props, getDistortion ]);


    const handleWindowResize = useCallback(() => {
        setShow(false);

        const downPos = mouseDownPosRef.current;
        if(downPos) updatePosition(downPos)
    }, [])


    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('resize', handleWindowResize);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('resize', handleWindowResize);
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
                { coordinate?.latitudeDD?.toFixed(5) }, { coordinate?.longitudeDD?.toFixed(5) }
            </li>
            <li onClick={ () => clipboard(`${coordinate?.latitudeDD}, ${coordinate?.longitudeDD}, ${modifiedHeight}`) }>
                왜곡 보정 고도 = { modifiedHeight.toFixed(2) }m
            </li>
            <hr/>
            <li onClick={ () => clipboard(terrainHeight) }>
                지형 고도 = { terrainHeight.toFixed(2) }m
            </li>
            {
                buildingHeight !== 0 ? <>
                    <li onClick={ () => clipboard(coordinate?.height) }>
                        측정 고도 = { coordinate?.height.toFixed(2) }m
                    </li>
                    <li onClick={ () => clipboard(buildingHeight) }>
                        건물 높이 = { buildingHeight.toFixed(2) }m
                    </li>
                </> : <></>
            }
            <li onClick={ () => clipboard(distortionRate) }>
                왜곡값 = x{ distortionRate.toFixed(5) }
            </li>
        </ul>
    )
}

export default RightClickMenu;