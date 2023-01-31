import { useCallback, useEffect, useRef, useState } from 'react'
import { getDistortionAmount } from '../../lib/bte-projection/math';
import { textToClipboard } from '../../lib/clipboard';
import './index.css'


interface RightClickMenuProps {
    copyCoord?: vw.CartographicCoordinate,
    closeRef: React.MutableRefObject<(() => void) | undefined>;
}


const RightClickMenu : React.FC<RightClickMenuProps> = ({ copyCoord, closeRef }) => {

    const projection = window.bteProjection;
    const [ coordinate, setCoordinate ] = useState<vw.CartographicCoordinate>();
    const [ anchorPoint, setAnchorPoint ] = useState<vw.Pixel>({ x: 0, y: 0 });
    const [ show, setShow ] = useState<boolean>(false);

    const menuRef = useRef<HTMLUListElement>(null);
    const mouseDownPosRef = useRef<vw.Pixel>();

    closeRef.current = () => {
        setShow(false);
    };

    const getDistortion = useCallback(() => {
        if(!coordinate) return 0;

        let { longitudeDD: lon, latitudeDD: lat } = coordinate;
        let tissot = projection.tissot({ lon, lat });

        return getDistortionAmount(tissot).value;
    }, [ projection, coordinate ]);

    const handleMouseMove = useCallback(({ x, y }: MouseEvent) => {
        mouseDownPosRef.current = { x, y };
    }, []);

    const handleContextMenu = useCallback((event: MouseEvent) => {
        event.preventDefault();

        const downPos = mouseDownPosRef.current;
        if(downPos && downPos.x !== event.pageX && downPos.y !== event.pageY) return;

        if(!menuRef.current) return;
        let { clientWidth, clientHeight } = menuRef.current;

        let x = Math.min(event.pageX + clientWidth,  window.innerWidth)  - clientWidth ;
        let y = Math.min(event.pageY + clientHeight, window.innerHeight) - clientHeight;

        setCoordinate(copyCoord);
        setAnchorPoint({ x, y })
        setShow(true);
    }, [ copyCoord ]);


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
            <li onClick={ () => {
                textToClipboard(`${coordinate?.latitudeDD}, ${coordinate?.longitudeDD}`)
                setShow(false);
            } }>
                { coordinate?.latitudeDD.toFixed(5) }, { coordinate?.longitudeDD.toFixed(5) }
            </li>
            <li onClick={ () => {
                textToClipboard(`${coordinate?.latitudeDD}, ${coordinate?.longitudeDD} ${coordinate?.height}`)
                setShow(false);
            } }>
                고도 = { coordinate?.height.toFixed(2) }m
            </li>
            <li>
                왜곡 값 ≈ { getDistortion().toFixed(5) }m
            </li>
        </ul>
    )
}

export default RightClickMenu;