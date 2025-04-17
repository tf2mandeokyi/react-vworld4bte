/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-function-type */

namespace vw {

    /**
     * 브이월드 API에서 사용되는 대부분 클래스의 부모 클래스이며, 추상 클래스로 직접 인스턴스를 생성하지 않는다. 
     * 모든 객체에서 이벤트 리스너를 등록하고 해제할 수 있도록 관련 기능을 제공하고, 
     * 각 객체의 개발자가 임의 값을 저장하고 읽을 수 있도록 개발자 지정 프로퍼티를 설정하고 읽을 수 있도록 한다. 
     * 또한 모든 객체는 복제할 수 있다.
     */
    declare class Object {
        
        /** 
         * Object 클래스의 생성자 
         */
        constructor();
        
        /** 
         * 개발자 지정 P를 포함한 모든 내부 값을 동일하게 복제한 Object 객체를 반환한다.
         */
        clone() : Object;

        /**
         * 두 객체의 가지고 있는 속성의 값이 같은지를 비교한다. 객체 자체를 비교하는 것이 아니다.
         * @param object 비교할 객체
         */
        equals(object: Object) : boolean;

        /**
         * 개발자 지정 P 값을 얻는다.
         * @param name 이름
         */
        get(name: string) : any;

        /**
         * 객체의 개발자 지정 P의 이름 목록 배열을 얻는다.
         */
        getNames() : Array<string>;

        /**
         * 이벤트 타입에 리스너를 등록한다.
         * @param type 이벤트 타입
         * @param listener 리스너 함수
         */
        on(type: string, listener: Function) : object;

        /**
         * 이벤트 타입에 한번만 동작하는 리스너를 등록한다.
         * @param type 이벤트 타입
         * @param listener 리스너 함수
         */
        once(type: string, listener: Function) : object;

        /**
         * 개발자 지정 P를 제거한다.
         * @param name P 이름
         */
        remove(name: string) : any;

        /**
         * 개발자 지정 P 값을 설정한다. 이름이 중복되면 값을 갱신한다.
         * @param name P 이름
         * @param value P 값
         */
        set(name: string, value: object) : void;

        /**
         * 이벤트 타입으로 등록된 리스너를 해제한다.
         * @param type 이벤트 타입
         * @param listener 리스너 함수
         */
        un(type: string, listener: Function) : void;

        /**
         * on(), once()에서 반환된 키로 이벤트 리스너를 해제한다.
         * @param key on(), once()에서 반환된 키값
         */
        unByKey(key: object) : void;
    }
}