/* eslint-disable  @typescript-eslint/no-explicit-any */

namespace vw {
    
    class Feature extends Object {
        /** 속성정보 컥렉션. 피쳐의 속성을 개발자 정의 속성과 구분하기 위해서 별도의 객체로 관리한다. */
        attributes: Collection<any>;
        /** 필드의 컬렉션. Vector소스에서 vw.Feature를 생성한 경우에는 Vector소스의 fieldDefs컬렉션을 참조하고, 개발자가 생성한 경우에는 NULL이다. */
        fieldDefs: Collection<any>;
        /** 지오메트리 */
        geometry: Geometry;
        /** 아이디. NULL가능 */
        id: string | null;
        /** 피쳐의 스타일 */
        style: StyleGroup; // TODO change this to vw.style.StyleGroup

        constructor(geometry: Geometry, style: StyleGroup);

        /** attribute를 반환한다. */
        getAttributes() : Collection<any>;

        /** fieldDefs를 반환한다. */
        getFieldDefs() : Collection<any>; // TODO

        /** geometry를 반환한다. */
        getGeometry() : Geometry;

        /** 아이디를 반환한다. */
        getId() : string | null;

        /** 스타일을 반환한다. */
        getStyle(format: string) : StyleGroup;

        /** geometry를 설정한다. */
        setGeometry(geometry: Geometry) : void;

        /** 아이디를 설정한다. */
        setId(id: string) : void;

        /** 스타일을 설정한다. */
        setStyle(style: StyleGroup) : void;

    }
}