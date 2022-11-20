namespace vw.cameraMover {

    class CameraMover extends vw.Object {
        /** 이동 유지시간(m/sec) */
        duration: number;
        /** 가속도 조절 상수 */
        easing: "INOUT";

        constructor();
    }

}