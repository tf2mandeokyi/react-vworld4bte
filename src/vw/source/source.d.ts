namespace vw.source {

    enum State {
        /* 에러 */
        ERROR,
        /* 로딩중 */
        LOADING,
        /* 로딩 완료 후 준비 */
        READY,
        /* 정의되지 않음 */
        UNDEFINED
    }

    class Source extends Object {
        /* 소스의 좌표체계 */
        crs: CRS;
        /* 소스의 Extent */
        extent: Extent;
        /* 소스의 상태 */
        state: State;
        /* 소스의 위치 */
        url: string;
        /* 세계를 수평으로 반복할 것인지를 결정한다. */
        wrapX: boolean;

        /**
         * 주어진 좌표로 피쳐 정보를 가져온다.
         */
        getFeatureInfo(point: Coord): Feature[];
    }

}