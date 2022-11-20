namespace vw {
    /**
     * 색상 클래스.
     */
    class Color extends vw.Object {

        /** 아쿠아. (RGB: 0,255,255),(HX: #00ffff) */
        static readonly AQUA: Color;
        /** 블랙. (RGB: 0,0,0),(HX: #000000) */
        static readonly BLACK: Color;
        /** 블루. (RGB: 0,0,255),(HX: #0000ff) */
        static readonly BLUE: Color;
        /** 블루 비올렛. (RGB: 138,43,226),(HX: #8a2be2) */
        static readonly BLUEVIOLET: Color;
        /** 브라운. (RGB: 165,42,42),(HX: #a52a2a) */
        static readonly BROWN: Color;
        /** 초콜릿. (RGB: 210,105,30),(HX: #d2691e) */
        static readonly CHOCOLATE: Color;
        /** 코랄. (RGB: 255,127,80),(HX: #ff7f50) */
        static readonly CORAL: Color;
        /** 시안. (RGB: 0,255,255),(HX: #00ffff) */
        static readonly CYAN: Color;
        /** 골드. (RGB: 255,215,0),(HX: #ffd700) */
        static readonly GOLD: Color;
        /** 그래이. (RGB: 128,128,128),(HX: #808080) */
        static readonly GRAY: Color;
        /** 그린. (RGB: 0,128,0),(HX: #008000) */
        static readonly GREEN: Color;
        /** 그린 옐로우. (RGB: 173,255,47),(HX: #adff2f) */
        static readonly GREENYELLOW: Color;
        /** 핫핑크. (RGB: 255,105,180),(HX: #ff69b4) */
        static readonly HOTPINK: Color;
        /** 인디고. (RGB: 75,0,130),(HX: #4b0082) */
        static readonly INDIGO: Color;
        /** 카키. (RGB: 240,230,140),(HX: #f0e68c) */
        static readonly KHAKI: Color;
        /** 라벤더. (RGB: 230,230,250),(HX: #e6e6fa) */
        static readonly LAVENDER: Color;
        /** 라임. (RGB: 0,255,0),(HX: #00ff00) */
        static readonly LIME: Color;
        /** 마그네타. (RGB: 255,0,255),(HX: #ff00ff) */
        static readonly MAGENTA: Color;
        /** 네이비. (RGB: 0,0,128),(HX: #000080) */
        static readonly NAVY: Color;
        /** 올리브. (RGB: 128,128,0),(HX: #808000) */
        static readonly OLIVE: Color;
        /** 오렌지. (RGB: 255,165,0),(HX: #ffa500) */
        static readonly ORANGE: Color;
        /** 핑크. (RGB: 255,192,203),(HX: #ffc0cb) */
        static readonly PINK: Color;
        /** 퍼플. (RGB: 128,0,128),(HX: #800080) */
        static readonly PURPLE: Color;
        /** 레드. (RGB: 255,0,0),(HX: #ff0000) */
        static readonly RED: Color;
        /** 샐몬. (RGB: 250,128,114),(HX: #fa8072) */
        static readonly SALMON: Color;
        /** 실버. (RGB: 192,192,192),(HX: #c0c0c0) */
        static readonly SILVER: Color;
        /** 스카이블루. (RGB: 135,206,235),(HX: #87ceeb) */
        static readonly SKYBLUE: Color;
        /** 스노우. (RGB: 255,250,250),(HX: #fffafa) */
        static readonly SNOW: Color;
        /** 토마토. (RGB: 255,99,71),(HX: #ff6347) */
        static readonly TOMATO: Color;
        /** 바이올렛. (RGB: 238,130,238),(HX: #ee82ee) */
        static readonly VIOLET: Color;
        /** 화이트. (RGB: 255,255,255),(HX: #ffffff) */
        static readonly WHITE: Color;
        /** 옐로우. (RGB: 255, 255, 0),(HX: #ffff00) */
        static readonly YELLOW: Color;

        
        /** 빨간색 요소(0 ~ 255) */ r: number;
        /** 녹색 요소(0 ~ 255) */ g: number;
        /** 파란색 요소(0 ~ 255) */ b: number;
        /** 투명도 요소(0 ~ 255) */ a: number;

        /**
         * Color 클래스의 생성자
         * @param r 빨간색 요소(0 ~ 255)
         * @param g 녹색 요소(0 ~ 255)
         * @param b 파란색 요소(0 ~ 255)
         * @param a 투명도 요소(0 ~ 1)
         */
        constructor(r: number, g: number, b: number, a: number);

        /**
         * Color를 CSS 컬러 스트링으로 반환
         */
        getCssString(): string;

        /**
         * CSS 컬러 스트링에서 Color를 생성한다.
         * @param color CSS 컬러 스트링
         */
        static fromCssString(color: string): Color;

        /**
         * (0~1) 범위의 값으로부터 Color를 생성한다.
         * @param r 빨간색 요소(0 ~ 1)
         * @param g 녹색 요소(0 ~ 1)
         * @param b 파란색 요소(0 ~ 1)
         * @param a 투명도 요소(0 ~ 1)
         */
        static fromRations(r: number, g: number, b: number, a: number): Color;
    }


    interface ColorBreak {
        /** Color Break 위치 */
        position: Bound;
    }


    enum ColorRampType {
        AUTUMN, BONE, COOL, COPPER, GRAY, HOT, HSV, JET, LINES, NONE, PINK,
        SPRING, SUMMER, WINTER
    }


    /**
     * 컬러맵 클래스.
     */
    class ColorRamp {

        /** 폰트 색상 */
        color: Color;
        /** 비정형 컬러맵 타입 */
        type: ColorRampType;

        /**
         * 컬러램프 생성자
         * @param start 시작 색상
         * @param end 끝 색상
         * @param breaks 다중 Color Breaks를 사용할 때 지정
         */
        constructor(start: Color, end: Color, breaks?: Array<ColorBreak>);

        /**
         * 컬러램프 생성자
         * @param type 컬러맵 타입
         */
        constructor(type: ColorRampType);

    }
}