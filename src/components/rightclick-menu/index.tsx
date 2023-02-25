import { useCallback, useEffect, useRef, useState } from 'react'
import { BTE_PROJECTION } from 'bte-projection';
import { textToClipboard } from '../../lib/clipboard';
import LocalizedStrings from 'react-localization';

import './index.css'


interface IStrings {
    coord: string;
    yCoord: string;
    terrain: string;
    height: string;
    distortion: string;
}
const strings = new LocalizedStrings<IStrings>({
    en: {
        coord: 'Coord.',
        yCoord: 'Y coord.',
        terrain: 'Terrain',
        height: 'Height',
        distortion: 'Distortion'
    },
    ko: {
        coord: '좌표',
        yCoord: 'Y 좌표',
        terrain: '지형',
        height: '높이',
        distortion: '왜곡값'
    }
})


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

    const menuRef = useRef<HTMLTableElement>(null);
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
    }, [ updatePosition, props, getDistortion ]);


    const handleWindowResize = useCallback(() => {
        setShow(false);

        const downPos = mouseDownPosRef.current;
        if(downPos) updatePosition(downPos)
    }, [ updatePosition ])


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
        <div 
            className="rightclickmenu"
            ref={ menuRef }
            style={{
                top: anchorPoint.y,
                left: anchorPoint.x,
                visibility: show ? 'visible' : 'hidden'
            }}
        >
            <table>
                <thead></thead>
                <tbody>
                    <tr onClick={ () => clipboard(`${coordinate?.latitudeDD}, ${coordinate?.longitudeDD}`) }>
                        <td>{ strings.formatString(strings.coord) }</td>
                        <td>{ coordinate?.latitudeDD?.toFixed(5) }, { coordinate?.longitudeDD?.toFixed(5) }</td>
                    </tr>
                    <tr
                        className='bordered'
                        onClick={ () => clipboard(`${coordinate?.latitudeDD}, ${coordinate?.longitudeDD} ${modifiedHeight}`) }
                    >
                        <td>{ strings.formatString(strings.yCoord) }</td>
                        <td>{ modifiedHeight.toFixed(2) }m</td>
                    </tr>
                    <tr onClick={ () => clipboard(terrainHeight) }>
                        <td>{ strings.formatString(strings.terrain) }</td>
                        <td>{ terrainHeight.toFixed(2) }m</td>
                    </tr>
                    { buildingHeight !== 0 ? <>
                        <tr onClick={ () => clipboard(buildingHeight) }>
                            <td>{ strings.formatString(strings.height) }</td>
                            <td>{ buildingHeight.toFixed(2) }m</td>
                        </tr>
                    </> : <></> }
                    <tr onClick={ () => clipboard(distortionRate) }>
                        <td>{ strings.formatString(strings.distortion) }</td>
                        <td>x{ distortionRate.toFixed(5) }</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default RightClickMenu;