namespace vw {
    
    /** 
     * 2차원 좌표 
     * */
    class Coord {
        x: number; y: number;
        constructor(x: number, y: number);
        clone(): Coord;
    }


    /** 
     * 2차원 측정(Measure) 좌표 
     * */
    class CoordM {
        x: number; y: number; m: number;
        constructor(x: number, y: number, m: number);
    }


    /** 
     * 3차원 좌표 
     * */
    class CoordZ { 
        x: number; y: number; z: number;
        constructor(x: number, y: number, z: number);
        toLonLat(): { lat: number; lon: number; height: number; };
    }


    /** 
     * 3차원 측정(Measure) 좌표 
     * */
    class CoordZM {
        x: number; y: number; z: number; m: number;
        constructor(x: number, y: number, z: number, m: number);
    }


    /** 
     * 실세계 좌표와 화면 좌표가 Pair로 처리될 때 사용 
     */
    class CoordPixel {

        /** 실세계 좌표 */ coord: Coord;
        /** 화면 좌표 */ pixel: vw.Pixel;

        constructor(coord: Coord, pixel: vw.Pixel);
    }


    /**
     * 사각형 영역을 표현하는 클래스.
     */
    class Extent extends Object {

        /** x 최대값 */ maxx: number;
        /** y 최대값 */ maxy: number;
        /** x 최소값 */ minx: number;
        /** y 최소값 */ miny: number;

        /**
         * Extent 클래스의 생성자
         * @param minx x 최소값
         * @param miny y 최소값
         * @param maxx x 최대값
         * @param maxy y 최대값
         */
        constructor(minx: number, miny: number, maxx: number, maxy: number);

        /**
         * Extent의 Size를 반환한다.
         */
        getSize(): Size;

        /**
         * 두개의 좌표를 이용하여 Extent를 생성하여 반환한다.
         * @param start 시작 좌표
         * @param end 끝 좌표
         */
        static fromCoord(start: Coord, end: Coord): Extent;

        /**
         * 두개의 좌표를 이용하여 Extent를 생성하여 반환한다.
         * @param start 시작 좌표
         * @param end 끝 좌표
         */
        static fromPixel(start: vw.Pixel, end: vw.Pixel): Extent;
    }



    class Pixel {
        /** x 좌표 */ x: number;
        /** y 좌표 */ y: number;
        constructor(x: number, y: number);
    }



    /**
     * 컨트롤의 위치를 지정하는 상수.
     */
    enum SiteAlignType {
        TOP_LEFT, TOP_CENTER, TOP_RIGHT,
        CENTER_LEFT, CENTER_CENTER, CENTER_RIGHT,
        BOTTOM_LEFT, BOTTOM_CENTER, BOTTOM_RIGHT,
        NONE
    }


    class Size {

        /** 넓이 */ width: number;
        /** 폭 */ height: number;

        /**
         * Size 클래스의 생성자
         * @param width 폭
         * @param height 넓이
         */
        constructor(width: number, height: number);

        /**
         * 두개의 좌표를 이용하여 Size를 생성하여 반환한다.
         * @param start 시작 좌표
         * @param end 끝 좌표
         */
        static fromCoord(start: Coord, end: Coord): Size;

        /**
         * 두개의 좌표를 이용하여 Size를 생성하여 반환한다.
         * @param start 시작 좌표
         * @param end 끝 좌표
         */
        static fromPixel(start: vw.Pixel, end: vw.Pixel): vw.Pixel;
    }
}