export function getCameraPositionFromStorage() {
    let result: vw.CameraPosition;
    const storageData = localStorage.getItem('cameraPosition');
    if (storageData === null) {
        result = new vw.CameraPosition(
            new vw.CoordZ(127.54386023094492, 37.78567449411702, 2000000),
            new vw.Direction(0, -90, 0)
        );
        localStorage.setItem('cameraPosition', JSON.stringify(result));
    }
    else {
        const { location: { x, y, z }, direction: { heading, tilt, roll } } = JSON.parse(storageData);
        result = new vw.CameraPosition(
            new vw.CoordZ(x, y, z), 
            new vw.Direction(heading, tilt, roll)
        );
    }
    return result;
}