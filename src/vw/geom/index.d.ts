/* eslint-disable  @typescript-eslint/no-explicit-any */

import { CartographicCoordinate, Collection, Color, Coord, CoordZ, Extent, Feature } from ".";
import { HorizontalOrigin, LabelStyle, VerticalOrigin } from "../ws3d/common";


type GeometryEventListener = (windowPosition: Coord, ecefPosition: CoordZ, cartographic: CartographicCoordinate, featureInfo: Feature) => void;

type TransformXY<T extends Coord | CoordZ> = (pos: T) => T;

namespace vw.geom {
    
    class Geometry extends Object {
        /** outline 표시 여부 */
        bDrawOutLine: boolean;
        /** 지면기준높이 */
        distanceFromTerrain: number;
        /** 지오메트리의 extent */
        extent: Extent;
        /** 지면높이 */
        extrudedHeight: number;
        /** FillColor 스타일 */
        fillColor: Color;
        /** 폰트 */
        font: string;
        /** 폰트 크기 */
        font_size: number;
        /** 수평높이 */
        horizontalOrigin: HorizontalOrigin;
        /** 아이콘 이미지 */
        image: string;
        /** geometry 이름 */
        name: string;
        /** outline 색상 */
        outlineColor: Color;
        /** outline 두께 */
        outlineWidth: number;
        /** 라벨 스타일 */
        style: LabelStyle;
        /** geometry text */
        text?: string;
        /** 수직높이 */
        verticalOrigin: VerticalOrigin;
        /** 폭 설정 */
        width: number;

        /** 지오메트리 이벤트리스너 추가 */
        addEventListener(func: GeometryEventListener) : void;

        /** 지오메트리와 지면과의 거리(미터) 반환 */
        getDistanceFromTerrain() : number;

        /** 지오메트리 이벤트리스너 반환 */
        getEventListener() : GeometryEventListener;

        /** 높이로부터 아래로 meter만큼 설정값 반환 (기둥 도형에서 사용) */
        getExtrudeHeight() : number;

        /** 지오메트리 Fill Color 반환 */
        getFillColor() : Color;

        /** 지오메트리 폰트 반환 */
        getFont() : string;

        /** 지오메트리 폰트 크기 반환 */
        getFontSize() : number;

        /** 지오메트리 ID 반환 */
        getId() : string;

        /** 지오메트리 이미지 URL 반환 (Point 계열에서만 사용) */
        getImage() : string;

        /**  지오메트리 아웃라인색상 반환 */
        getOutLineColor() : Color;

        /** 지오메트리를 지도에 표시값 반환 (true: 표시, false: 숨김) */
        getVisibility() : boolean;

        /** 지오메트리의 width값 반환 */
        getWidth() : number;

        /** 지오메트리 이벤트리스너 삭제 */
        removeEventListener() : void;

        /** 지오메트리와 지면과의 거리(meter) 설정 */
        setDistanceFromTerrain(distance: number) : void;

        /** 높이로부터 아래로 meter만큼 설정(기둥 도형에서 사용) */
        setExtrudeHeight(height: number) : void;

        /** 지오메트리 Fill Color 설정 */
        setFillColor(color: Color) : void;

        /** 지오메트리 폰트 설정 */
        setFont(font: string) : void;

        /** 지오메트리 폰트 크기 설정 */
        setFontSize(size: number) : void;

        /** 지오메트리 ID 설정(식별자 역할) */
        setId(id: string) : void;

        /** 지오메트리 이미지 URL 설정(Point 계열에서만 사용) */
        setImage(image: string) : void;

        /** 지오메트리 아웃라인색상 설정 */
        setOutLineColor(color: Color) : void;

        /** 지오메트리를 지도에 표시 설정(true: 표시, false: 숨김) */
        setVisibility(visibility: boolean) : void;

        /** 지오메트리 width값 설정 */
        setWidth(width: number) : void;
    }



    class GeometryXY extends Geometry {

        /**
         * 주어진 점과 가장 가까운 점의 좌표를 반환한다. 꼭지점을 의미하는 것이 아니고, 가장 가까운 위치의 점을 계산하여 반환한다.
         * @param point 좌표
         */
        getClosesetPointFromPoint(point: Coord): Coord;

        /**
         * 주어진 extent와 지오메트리가 교차하는지 테스트한다.
         * @param extent
         */
        isIntersectsByExtent(extent: Extent): boolean;

        /**
         * 지오메트리의 각 좌표값을 변환 함수를 적용하여 변환한다.
         * @param transformFunc 좌표 변환 Callback함수
         */
        transform(transformFunc: TransformXY<Coord>): void;

        /**
         * 지오메트리의 각 좌표값을 delta를 이용하여 변경한다. 지오메트리가 이동하는 효과가 있다.
         * @param deltaX
         * @param deltaY
         */
        translate(deltaX: number, deltaY: number): void;
    }



    abstract class GeometryZ extends Geometry {

        /**
         * 주어진 점과 가장 가까운 점의 좌표를 반환한다. 꼭지점을 의미하는 것이 아니고, 가장 가까운 위치의 점을 계산하여 반환한다.
         * @param point 좌표
         */
        getClosesetPointFromPoint(point: CoordZ): CoordZ;

        /**
         * 주어진 extent와 지오메트리가 교차하는지 테스트한다.
         * @param extent
         */
        isIntersectsByExtent(extent: Extent): boolean;

        /**
         * 지오메트리의 각 좌표값을 변환 함수를 적용하여 변환한다.
         * @param transformFunc 좌표 변환 Callback함수
         */
        transform(transformFunc: TransformXY<CoordZ>): void;

        /**
         * 지오메트리의 각 좌표값을 delta를 이용하여 변경한다. 지오메트리가 이동하는 효과가 있다.
         * @param deltaX
         * @param deltaY
         * @param deltaZ
         */
        translate(deltaX: number, deltaY: number, deltaZ: number): void;
    }



    abstract class PointGroup extends GeometryXY {}
    abstract class PointGroupZ extends GeometryZ {}



    /**
     * Point 지오메트리
     */
    class Point extends PointGroup {
        /** 좌표값 */
        coord: Coord;

        /**
         * Point 클래스의 생성자
         * @param coord 좌표값
         */
        constructor(coord: Coord);

        /**
         * coord값을 반환한다.
         */
        getCoord(): Coord;

        /**
         * 현재 point에서 to point까지의 거리를 구하여 반환한다.
         * @param point 좌표값
         */
        getDistanceToPoint(point: Coord): number;

        /**
         * coord값을 설정한다.
         * @param coord 좌표값
         */
        setCoord(coord: Coord): void;
    }



    /**
     * PointZ 지오메트리
     */
    class PointZ extends PointGroupZ {
        /** 좌표값 */
        coord: CoordZ;

        /**
         * Point 클래스의 생성자
         * @param coord 좌표값
         */
        constructor(coord: CoordZ);

        /**
         * 현재 point에서 to point까지의 거리를 구하여 반환한다.
         * @param point 좌표값
         */
        getDistanceToPoint(point: CoordZ): number;
    }



    /**
     * Line 지오메트리
     */
    class Line extends PointGroup {
        /** 시작점 */
        start: Coord;
        /** 끝점 */
        end: Coord;

        /**
         * LineXY 클래스의 생성자
         * @param start 시작좌표
         * @param end 끝좌표
         */
        constructor(start: Coord, end: Coord);

        /**
         * line의 길이를 반환한다.
         */
        getLength(): number;

        /**
         * 선형보간법을 사용하여 dist에 해당하는 위치의 좌표값을 반환한다.
         * @param distance 시작점부터의 거리
         * @param extrapolate
         */
        getPointByDistance(distance: number, extrapolate: boolean): Coord;
    }



    /**
     * Linestring 지오메트리
     */
    class LineString extends PointGroup {
        /** 좌표값 */
        points: Collection<any>; // TODO

        /**
         * LineString 클래스의 생성자
         * @param points Array배열에 담아서 vw.Collection 생성할때 전달.
         */
        constructor(points: Collection<any>);

        /** LineString 생성 */
        create() : void;

        /** LineString 좌표 배열 반환 */
        getPoint() : Collection<any>;

        /** 지도에 다시 표시. */
        redraw() : void;

        /**
         * LineString 좌표 배열 설정
         * @param collection 
         */
        setPoint(collection: Collection<any>) : void;
    }



    /**
     * Linestring 지오메트리
     */
    class LineStringZ extends PointGroupZ {
        /** 좌표값 */
        points: Collection<any>;

        /**
         * LineString 클래스의 생성자
         * @param points Array배열에 담아서 vw.Collection 생성할때 전달.
         */
        constructor(points: Collection<any>);

        /** LineString 생성 */
        create() : void;

        /** LineString 좌표 배열 반환 */
        getPoint() : Collection<any>;

        /** 지도에 다시 표시. */
        redraw() : void;

        /**
         * LineString 좌표 배열 설정
         * @param collection 
         */
        setPoint(collection: Collection<any>) : void;
    }



    /**
     * Polygon 지오메트리
     */
    class PolygonZ extends PointGroupZ {
        
    }
}