import { nullValidate } from "../validate";


export function getCameraPositionFromStorage() {
    let result: vw.CameraPosition;
    try {
        let storageData = nullValidate(localStorage.getItem('cameraPosition'));
        let { location: { x, y, z }, direction: { heading, tilt, roll } } = JSON.parse(storageData);
        result = new vw.CameraPosition(
            new vw.CoordZ(x, y, z), 
            new vw.Direction(heading, tilt, roll)
        );
    } catch(e) {
        console.error(e);
        result = new vw.CameraPosition(
            new vw.CoordZ(127.54386023094492, 37.78567449411702, 2000000),
            new vw.Direction(0, -90, 0)
        );
        localStorage.setItem('cameraPosition', JSON.stringify(result));
    }
    return result;
}