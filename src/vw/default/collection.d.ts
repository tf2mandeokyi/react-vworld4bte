namespace vw {
    /**
     * 배열을 확장한 컬렉션으로 아이템을 다루는 메소드와 이벤트를 제공한다.
     */
    class Collection<T> extends vw.Object {

        /** 컬렉션이 보유한 아이템의 개수 */
        count: number;

        /**
         * Collection 클래스의 생성자
         */
        constructor();

        /**
         * Collection 클래스의 생성자
         * @param items 추가할 아이템을 가지고 있는 배열
         */
        constructor(items: Array<T>);

        /**
         * Collection 클래스의 생성자
         * @param items 추가할 아이템을 가지고 있는 배열
         */
        constructor(items: Array<T>, type: new (...args: any[]) => T);

        /**
         * 컬렉션의 마지막에 주어진 아이템을 추가하고, 컬렉션의 길이를 반환한다.
         * @param item 추가할 아이템
         */
        add(item: any): number;

        /**
         * 컬렉션의 모든 아이템을 제거한다.
         */
        clear(): void;

        /**
         * 주어진 배열의 아이템을 컬렉션의 아이템으로 추가하여 컬렉션을 확장한다.
         * @param items 추가할 아이템을 가지고 있는 배열
         */
        extend(items: Array<any>): void;

        /**
         * 아이템 전체를 담은 배열을 반환한다.
         */
        getArray(): Array<any>;

        /**
         * 주어진 값으로 인덱스를 반환한다. 없으면 -1을 반환한다. 값이 동일한 것이 있으면 첫번째 발견된 인덱스를 반환한다.
         * @param item 찾을 아이템의 값
         */
        indexOf(item: any): number;

        /**
         * 주어진 인덱스에 아이템을 추가한다. index >= count일 경우 마지막에 추가하고 index < 0일 경우 처음에 추가한다.
         * @param index 아이템을 추가할 위치
         */
        insert(index: number, item: any): void;

        /**
         * 주어진 인덱스의 아이템을 반환한다. 무효 인덱스가 입력되면 NULL을 반환한다.
         * @param index 아이템의 인덱스
         */
        item(index: number): any | null;

        /**
         * from 인덱스에 있는 item을 to 인덱스 위치로 이동한다. 그에 따라 from, to 사이의 item index는 변경된다.
         * @param from 현재 인덱스
         * @param to 대상 인덱스
         */
        move(from: number, to: number): void;

        /**
         * 컬렉션의 마지막 아이템을 제거하여 반환한다. 컬렉션이 비어 있으면 NULL을 반환한다.
         */
        pop(): any | null;

        /**
         * 컬렉션에서 주어진 아이템이 첫번째로 나타나는 경우를 제거하고, 제거한 아이템을 반환한다. 아이템을 찾지 못한 경우에는 NULL을 반환한다.
         * @param item 제거할 아이템
         */
        remove(item: any): any | null;

        /**
         * 주어진 인덱스의 아이템을 제거하고 반환한다. 컬렉션에서 인덱스에 아이템이 없는 경우에는 NULL을 반환한다.
         * @param index 제거할 아이템의 인덱스
         */
        removeAt(index: number): any | null;

        /**
         * index1의 item과 index2의 item을 맞바꾼다.
         * @param index1 맞바꿀 첫번째 인덱스
         * @param index2 맞바꿀 두번째 인덱스
         */
        switch(index1: number, index2: number): void;

        /**
         * 주어진 인덱스에 아이템을 설정하여 교체한다. 무효 인덱스가 입력되면 실행하지 않는다.(index < 0 또는 index >= count)
         * @param index 교체할 아이템의 인덱스
         * @param item 교체할 아이템
         */
        update(index: number, item: any): void;
    }
}