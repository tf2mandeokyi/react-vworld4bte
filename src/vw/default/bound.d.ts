namespace vw {
    /** 
     * 값이 변할 수 있는 범위를 지정 
     * */
    class Bound {
        /** Bound를 적용할지 여부 */
        apply: boolean;
        /** 최대 값 */
        max: number;
        /** 최소 값 */
        min: number;
    }
}