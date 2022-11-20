import { useCallback, useEffect, useRef, useState } from 'react'
import { textToClipboard } from '../../lib/clipboard';
import './index.css'


interface RightClickMenuProps {
    copyCoord?: vw.CartographicCoordinate,
    closeRef: React.MutableRefObject<(() => void) | undefined>;
}


const RightClickMenu : React.FC<RightClickMenuProps> = ({ copyCoord, closeRef }) => {

    const [ coordinate, setCoordinate ] = useState<vw.CartographicCoordinate>();
    const [ anchorPoint, setAnchorPoint ] = useState<vw.Pixel>({ x: 0, y: 0 });
    const [ show, setShow ] = useState<boolean>(false);

    const menuRef = useRef<HTMLUListElement>(null);
    const mouseDownPosRef = useRef<vw.Pixel>();

    closeRef.current = () => {
        setShow(false);
    };

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
        </ul>
    )
}

export default RightClickMenu;