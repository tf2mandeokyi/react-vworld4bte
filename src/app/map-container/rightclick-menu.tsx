import { BTE_PROJECTION } from "bte-projection";
import { JSX, useCallback, useEffect, useRef, useState } from "react";

export function textToClipboard(text: string) {
    if(!navigator.clipboard) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        document.body.appendChild(textArea);
        textArea.focus(); textArea.select();

        try { document.execCommand('copy') } catch {}

        document.body.removeChild(textArea);
    }
    else {
        navigator.clipboard.writeText(text);
    }
}

/*
.rightclickmenu {
    visibility: hidden;
    background-color: white;
    position: absolute;
    top: 0; left: 0;
    font-size: 16px;
    padding: 4px 0;
    border-radius: 3px;
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.5);
}

.rightclickmenu td {
    padding: 5px 7px;
    background-color: transparent;
    white-space: nowrap;
}

.rightclickmenu td:first-child {
    text-align: right;
    font-weight: 600;
    border-right: 1px solid #bbb;
}

.rightclickmenu tr:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
}

.rightclickmenu tr.bordered {
    border-bottom: 2px solid #bbb;
}
*/

function TableRow(props: {
    onClick: () => void,
    label: string,
    value: string | number,
    bordered: boolean
}): JSX.Element {
    let trClassName = 'hover:bg-black/10 cursor-pointer';
    if(props.bordered) trClassName += ' border-b-2 border-[#bbb]';
    return (
        <tr
            onClick={ props.onClick }
            className={ trClassName }
        >
            <td className="px-[7px] py-[5px] whitespace-nowrap text-right font-semibold border-r-2 border-[#bbb]">
                { props.label }
            </td>
            <td className="px-[7px] py-[5px] whitespace-nowrap">
                { props.value }
            </td>
        </tr>
    )
}

export default function RightClickMenu(props: {
    cursorCoordinate?: ws3d.common.Cartographic,
    terrainHeight: number,
    closeRef: React.RefObject<(() => void) | undefined>
}): JSX.Element {

    const [ coordinate, setCoordinate ] = useState(new ws3d.common.Cartographic());
    const [ terrainHeight, setTerrainHeight ] = useState<number>(0);
    const [ buildingHeight, setBuildingHeight ] = useState<number>(0);
    const [ modifiedHeight, setModifiedHeight ] = useState<number>(0);
    const [ distortionRate, setDistortionRate ] = useState<number>(1);
    const [ anchorPoint, setAnchorPoint ] = useState<vw.Pixel>({ x: 0, y: 0 });
    const [ show, setShow ] = useState<boolean>(false);

    const menuRef = useRef<HTMLTableElement>(null);
    const mouseDownPosRef = useRef<vw.Pixel>(undefined);

    props.closeRef.current = () => {
        setShow(false);
    };

    const clipboard = useCallback((text: string | number) => {
        if(typeof text === 'number') text = `${text}`
        textToClipboard(text);
        setShow(false);
    }, []);

    const getDistortion = useCallback((coord: ws3d.common.Cartographic) => {
        const { longitudeDD: lon, latitudeDD: lat } = coord;
        const distortion = BTE_PROJECTION.getDistortion({ lon, lat });
        
        return distortion.value;
    }, []);

    const handleMouseMove = useCallback(({ x, y }: MouseEvent) => {
        mouseDownPosRef.current = { x, y };
    }, []);

    const updatePosition = useCallback(({ x, y }: { x: number, y: number }) => {
        if(!menuRef.current) return;
        const { clientWidth, clientHeight } = menuRef.current;

        const anchorX = Math.min(x + clientWidth,  window.innerWidth)  - clientWidth;
        const anchorY = Math.min(y + clientHeight, window.innerHeight) - clientHeight;

        setAnchorPoint({ x: anchorX, y: anchorY })
    }, [])

    const handleContextMenu = useCallback((event: MouseEvent) => {
        event.preventDefault();
        if(!props.cursorCoordinate) return;

        const downPos = mouseDownPosRef.current;
        if(!downPos || downPos.x !== event.pageX || downPos.y !== event.pageY) return;
        updatePosition(downPos);

        const { terrainHeight, cursorCoordinate: coordinate } = props;
        const { height } = coordinate;
        const buildingHeight = Math.max(height - terrainHeight, 0);
        const distortion = getDistortion(coordinate);

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
            className="bg-white text-[16px] p-[4px] rounded-[3px] shadow-[0px_0px_7px_rgba(0,0,0,0.5)] absolute"
            ref={ menuRef }
            style={{
                top: anchorPoint.y,
                left: anchorPoint.x,
                visibility: show ? 'visible' : 'hidden'
            }}
        >
            <table><thead></thead><tbody>
                <TableRow
                    onClick={ () => clipboard(`${coordinate?.latitudeDD}, ${coordinate?.longitudeDD}`) }
                    label="좌표"
                    value={ `${coordinate?.latitudeDD?.toFixed(5)}, ${coordinate?.longitudeDD?.toFixed(5)}` }
                    bordered={ false }
                />
                <TableRow
                    onClick={ () => clipboard(`${coordinate?.latitudeDD}, ${coordinate?.longitudeDD} ${modifiedHeight}`) }
                    label="Y좌표"
                    value={ `${modifiedHeight.toFixed(2)} m` }
                    bordered={ true }
                />
                <TableRow
                    onClick={ () => clipboard(terrainHeight) }
                    label="지형고도"
                    value={ `${terrainHeight.toFixed(2)} m` }
                    bordered={ false }
                />
                { buildingHeight !== 0 ? <>
                    <TableRow
                        onClick={ () => clipboard(buildingHeight) }
                        label="건물고도"
                        value={ `${buildingHeight.toFixed(2)} m` }
                        bordered={ false }
                    />
                </> : <></> }
                <TableRow
                    onClick={ () => clipboard(distortionRate) }
                    label="왜곡률"
                    value={ `x${distortionRate.toFixed(5)}` }
                    bordered={ false }
                />
            </tbody></table>
        </div>
    )
}