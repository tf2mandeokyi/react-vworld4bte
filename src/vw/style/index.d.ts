namespace vw.style {
    
    /**
     * 벡터 피쳐 렌더링 스타일을 위한 추상클래스.
     */
    declare class Style extends Object {}


    /** 
     * Polygon의 채우기 패턴을 결정하는 상수 
     */
    declare enum FillPattern {
        NOSOLID, SOLID
    }


    /** 
     * 선의 패턴을 결정하는 상수 
     */
    declare enum StrokePattern {
        NOSOLID, SOLID
    }


    /** 
     * 벡터 피쳐를 위한 fill 스타일 
     */
    declare class Fill extends Style {
        /** 채우기 색상 */
        color: Color;
        /** 채우기 패턴(NULL, SOLID만 지원) */
        pattern: FillPattern;
        /** Stroke 스타일 */
        stroke: StrokePattern;

        /** Fill 클래스의 생성자 */
        constructor(color: Color);
    }


    declare class Marker extends Style {

        anchor: SiteAlignType;
        multiplier: number;
        offset: any; // TODO

    }


    /**
     * 벡터 피쳐를 위한 아이콘 스타일.
     */
    declare class Icon extends Marker {
        /** 아이콘 크기(Pixel), 외부에서 입력하지 않으면 이미지의 size로 설정됨 */
        size: Size;
        /** 이미지 소스 URI */
        src: string;

        /** Icon 클래스의 생성자 */
        constructor();

        /** 아이콘 크기를 반환한다. */
        getSize() : Size;

        /** 이미지 소스 URI를 반환한다. */
        getSrc() : string;

        /** 아이콘 크기를 설정한다. */
        setSize(size: Size) : void;

        /** 이미지 소스 URI를 설정한다. */
        setSrc(src: string) : void;
    }


    /**
     * 벡터 피쳐를 위한 Stroke 스타일.
     */
    declare class Stroke extends Style {
        /** 선 색상 */
        color: Color;
        /** 선 패턴(NULL, SOLID만 지원) */
        pattern: StrokePattern;
        /** 선 굵기 */
        width: number;

        /**
         * Stroke 클래스의 생성자
         * @param color 선 색상
         */
        constructor(color: Color);

    }


    /**
     * 벡터 피쳐 렌더링 스타일을 위한 컨테이너이다. 스타일의 어떤 값의 변화도 피쳐, 레이어, 피쳐오버레이 등이 새로 그려질 때까지는 영향을 미치지 않는다
     */
    declare class StyleGroup extends Object {
        /** Fill 스타일 */
        fill: Fill;
        /** Marker 스타일 */
        marker: Marker;
        /** Stroke 스타일 */
        stroke: Stroke;
        /** Text 스타일 */
        text: Text;

        constructor();

        /** Fill 스타일을 반환한다. */    
        getFill() : Fill;

        /** Marker 스타일을 반환한다. */    
        getMarker() : Marker;

        /** Stroke 스타일을 반환한다. */
        getStroke() : Stroke;

        /** Text 스타일을 반환한다. */
        getText() : Text;

        /** Fill 스타일을 설정한다. */
        setFill(fill: Fill) : void;

        /** Marker 스타일을 설정한다. */
        setMarker(marker: Marker) : void;

        /** Stroke 스타일을 설정한다. */
        setStroke(stroke: Stroke) : void;

        /** Text 스타일을 설정한다. */
        setText(text: Text) : void;
    }
}