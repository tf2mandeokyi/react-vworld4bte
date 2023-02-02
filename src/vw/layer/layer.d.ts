namespace vw.layer {

    class Base extends Object {
        /** 레이어 alias명, 지정되지 않으면 레이어 이름과 같음 */
        alias: string;
        /** layer가 위치한 높이 */
        elevation: number;
        /** (D)TERRAIN, 높이의 기준면 종류 */
        elevationBase: ElevationBaseType;
        /** (D)15, 레이어의 최대 줌레벨 */
        maxZoom: number;
        /** (D)0, 레이어의 최소 줌레벨 */
        minZoom: number;
        /** 레이어 이름 */
        name: string;
        /** (D)1, 레이어의 불투명도(0 ~ 1) */
        opacity: number;
        /** (D)false, 레이어가 선택가능한 지를 설정 */
        selectable: boolean;
        /** (D)true, 레이어의 visibility */
        visible: boolean;
    }

    class SourcedLayer extends Base {
        /** 레이어의 소스 */
        source: vw.source.Source;
    }

    class TerrainLayer extends SourcedLayer {

        constructor(id: string);

        /** (D)BLACK, 배경지도가 보이지 않을 경우에 적용되는 색 */
        backgroundColor: Color;
        /** 브이월드에서 제공하는 terrain id(여러 해상도의 terrain이 준비되어 있을 경우사용). 생략하면 디폴트가 생성된다. */
        id: string;
        /** (D)false, 와이어 프레임 표시여부 */
        wireframe: boolean;
        /** (D)WHITE, 와이어 프레임 색 */
        wireframeColor: Color;
    }

}