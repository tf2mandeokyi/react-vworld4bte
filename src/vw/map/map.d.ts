namespace vw {
    /** 
     * vw.Map에서 사용하는 배경지도의 종류를 선언하는 열거형. 
     */
    enum BasemapType {
        /** 도로맵 */
        GRAPHIC,
        GRAPHIC_ARRAY,
        GRAPHIC_NIGHT,
        /** 항공사진 */
        PHOTO,
        /** 항공사진에 주기표시 */
        PHOTO_HYBRID
    }


    interface CartographicCoordinate {
        latitudeDD: number;
        longitudeDD: number;
        height: number;
    }


    /** 
     * Map 구성 요소인 control, interaction을 초기에 어느 정도 구성할지 설정 
     */
    enum DensityType {
        /** 맵을 생성할 때, Control, Interaction 을 많이 사용하는 표준적인 형태로 미리 생성한다. */
        BASIC,
        /** 맵을 생성할 때, Control, Interaction 을 하나도 생성하지 않는다. 개발자가 필요한 것을 직접 추가하여 사용하도록 한다. */
        EMPTY,
        /** 맵을 생성할 때, Control, Interaction 을 최대로 생성하여 설정한다. */
        FULL
    }


    /** 좌표 참조 체계. */
    type CRS = 'string' | { code: string; }


    declare class EventHandler<F extends (...args: any[]) => void> {
        addEventListener(listener: F): void; 
        removeEventListener(listener: F): void; 
    }


    type DetailedMouseInteractionListener = (
        /** 지도 안에서의 마우스 x, y 좌표. 우측 상단 0,0부터 시작 */ 
        windowPosition: Pixel, 
        /** 마우스의 ECEF 좌표계 */ 
        ecefPosition: CoordZ, 
        /** 마우스의 WGS84 좌표 */
        cartographic: CartographicCoordinate
    ) => void;


    /**
     * @param windowPosition 지도 안에서의 마우스 x, y 좌표
     */
    type SimpleMouseInteractionListener = (windowPosition: Pixel) => void;


    /**
     * 맵 클래스. 레이어, 컨트롤, 인터랙션 등을 포함하고 관리한다. 
     * 가장 기본적인 클래스로 오픈 API 진입점 역할을 하는 핵심클래스이다.
     */
    class Map extends Object {
        /** 맵을 조절하는 카메라 */
        camera: Camera;
        /** 브이월드의 좌표 참조 체계 */
        crs: CRS;
        /** 레이어 컬렉션 */
        layers: any[]; // TODO
        /** 왼쪽 마우스 클릭시 발생하는 이벤트 객체 */
        onClick: EventHandler<DetailedMouseInteractionListener>;
        /** 왼쪽 마우스 버튼을 눌렀을때 발생하는 이벤트 객체 */
        onMouseLeftDown: EventHandler<SimpleMouseInteractionListener>;
        /** 왼쪽 마우스 버튼을 땠을때 발생하는 이벤트 객체 */
        onMouseLeftUp: EventHandler<SimpleMouseInteractionListener>;
        /** 마우스를 움직일때 발생하는 이벤트 객체 */
        onMouseMove: EventHandler<DetailedMouseInteractionListener>;
        /** 오른쪽 마우스 버튼을 눌렀을때 발생하는 이벤트 객체 */
        onMouseRightDown: EventHandler<SimpleMouseInteractionListener>;
        /** 오른쪽 마우스 버튼을 땠을때 발생하는 이벤트 객체 */
        onMouseRightUp: EventHandler<SimpleMouseInteractionListener>;
        /** 마우스가 움직임을 멈출때 발생하는 이벤트 객체 */
        onMoveEnd: EventHandler<() => void>;
        /** 마우스가 움직임을 시작할때 발생하는 이벤트 객체 */ 
        onMoveStart: EventHandler<() => void>;
        overlays: any[];
        
        /**
         * Map 클래스의 생성자
         * @param container 맵 클래스가 위치한 컨테이너
         * @param opt 맵 클래스 생성 옵션
         */
        constructor(container: string, opt: MapOptions);

        /** 지도에 그려진 측정결과, 마커, 팝업 그래픽 객체를 모두 삭제한다. */
        clear() : void;
        
        /**
         * 주어진 좌표에 마커를 생성하고 마커 클릭시 팝업창에 텍스트를 출력한다.
         * @param title 팝업제목
         * @param x x좌표(EPSG:4326)
         * @param y y좌표(EPSG:4326)
         * @param text 팝업에 표시될 텍스트
         * @param imgpath 마커 경로
         * @param popwid 팝업 가로크기
         * @param pophgt 팝업 세로크기
         */
        createMarker(title: string, x: number, y: number, text: string, imgpath: string, popwid: number, pophgt: number) : void;

        /**
         * 주어진 맵의 좌표에 해당하는 화면 좌표를 반환한다.
         * @param point 변환할 맵 좌표
         */
        coordToPixel(point: Coord) : Pixel;

        /** 지도 센터 위치값을 반환한다.(EPSG:4326) */
        getCurrentPosition() : { direction: Direction, position: CoordZ };

        /** 3D 지도에 등록된 모든 레이어를 반환한다. */
        getLayerAllElement() : any[]; // TODO

        /**
         * 3D 지도에 아이디 또는 이름으로 등록된 레이어를 반환한다.
         * @param idOrName 3D 지도 레이어 아이디 혹은 이름
         */
        getLayerElement(idOrName: string) : any; // TODO

        /**
         * 주어진 좌표로 이동한다.
         * @param cameraPosition 카메라 좌표
         */
        moveTo(cameraPosition: CameraPosition) : void;

        /**
         * 주어진 화면 좌표에 해당하는 맵의 좌표를 반환한다.
         * @param point 변환할 화면 좌표
         */
        pixelToCoord(point: Pixel) : Coord;

        /**
         * 3D 지도에 아이디 또는 이름으로 등록된 레이어를 제거한다.
         * @param idOrName 3D 지도 레이어 아이디 혹은 이름
         */
        removeLayerElement(idOrName: string) : void;

        /** 맵의 뷰포트의 크기를 다시 계산한다. 컨테이너의 크기가 변경된 경우에 반드시 호출해야 한다. */
        updateSize() : void;

        /** 줌을 확대한다 */
        zoomIn() : void;

        /** 줌을 축소한다 */
        zoomOut() : void;
    }


    /**
     * vw.Map 클래스에서 사용하는 옵션
     */
    class MapOptions {
        /** (2D지도 전용, 3D에서는 적용안됨) */
        basemapType: BasemapType;
        /** (2D지도 전용, 3D에서는 적용안됨) 맵크기에 따라 배치와 visibility를 자동으로 조정 */
        controlAutoArrange: boolean;
        /** (2D지도 전용, 3D에서는 적용안됨) */
        controlsDensity: DensityType;
        /** 홈 카메라 위치 */
        homePosition: CameraPosition;
        /** (2D지도 전용, 3D에서는 적용안됨) 지도가 그려지는 엘리먼트ID */
        id: string;
        /** 초기 카메라 위치, 네비게이션 home버튼을 클릭하면 이동하는 위치. */
        initPosition: CameraPosition;
        /** (2D지도 전용, 3D에서는 적용안됨) */
        interactionsDensity: DensityType;


        /**
         * @param basemapType 2D 초기배경지도
         * @param layersArr 레이어목록 (3D에서 사용안함)
         * @param controlDensity 2D지도 전용
         * @param interactionDensity 2D지도 전용
         * @param controlAutoRange 2D지도 전용
         * @param homePosition 2D,3D 공통 사용
         * @param initPosition 2D,3D 공통 사용
         */
        constructor(
            basemapType: BasemapType,
            layersArr: string[] | string,
            controlDensity: DensityType,
            interactionDensity: DensityType,
            controlAutoRange: boolean,
            homePosition: CameraPosition,
            initPosition: CameraPosition
        );
    }
}