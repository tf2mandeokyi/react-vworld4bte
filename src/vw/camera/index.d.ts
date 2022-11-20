namespace vw {
    /**
     * 카메라 객체. 맵의 뷰를 설정하고 조정한다. 맵 객체 내에서 생성되고, 개발자가 직접 생성하지 않는다.
     */
     declare class Camera extends vw.Object {
        action: any;
        bound: any;
        canMoveUnderTerrain: boolean;
        device: any;
        deviceBase: boolean;
        home: vw.CoordZ;
        maxAltitude: number;
        minAltitude: number;
        mover: vw.cameraMover.CameraMover;
        target: any;

        reset() : void;
    }



    /**
     * 카메라의 위치를 결정하는 객체. 카메라의 위치에 따라 맵의 뷰가 결정된다.
     */
    declare class CameraPosition extends vw.Object {
        direction: vw.Direction;
        location: vw.CoordZ;
        constructor(coordZ: vw.CoordZ, direction: vw.Direction);
    }



    /**
     * 카메라의 위치와 방향을 나타내는 구조체
     */
    interface DevicePosition {
        direction: vw.Direction;
        location: vw.CoordZ;
    }



    /**
     * 카메라가 가리키는 방향 또는 목표물에서의 카메라 방향을 나타내는 클래스(DeviceCamera, Targetcamera에 모두 적용)
     */
    class Direction extends vw.Object {
        heading: number; tilt: number; roll: number;
        constructor(heading: number, tilt: number, roll: number);
    }
}