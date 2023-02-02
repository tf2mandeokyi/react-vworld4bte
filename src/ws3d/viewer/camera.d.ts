class Camera {

    constrainedAxis: ws3d.common.Cartesian3
    defaultLookAmount: number
    defaultMoveAmount: number
    defaultRotateAmount: number
    defaultZoomAmount: number
    direction: ws3d.common.Cartesian3
    frustum
    maximumZoomFactor: number
    percentageChanged: number
    position: ws3d.common.Cartesian3
    positionWCDeltaMagnitude: number
    positionWCDeltaMagnitudeLastFrame: number
    right: ws3d.common.Cartesian3
    timeSinceMoved: number
    up: ws3d.common.Cartesian3
    wsFarDistanceFactorOnChangingViewByInput: number
    wsFarDistanceFor3DTiles: number
    wsFarDistanceValueFor3DTilesAtUndergroundModeStateFalse: number
    wsFarDistanceValueFor3DTilesAtUndergroundModeStateTrue: number

    constructor(e)

    readonly changed: ws3d.common.Event
    readonly directionWC: ws3d.common.Cartesian3
    readonly heading: number
    readonly inverseTransform: ws3d.common.Matrix4
    readonly inverseViewMatrix: ws3d.common.Matrix4
    readonly moveEnd: ws3d.common.Event
    readonly moveStart: ws3d.common.Event
    readonly pitch: number
    readonly positionCartographic: ws3d.common.Cartographic
    readonly positionWC: ws3d.common.Cartesian3
    readonly rightWC: ws3d.common.Cartesian3
    readonly roll: number
    readonly transform: ws3d.common.Matrix4
    readonly upWC: ws3d.common.Cartesian3
    readonly viewMatrix: ws3d.common.Matrix4

    cameraToWorldCoordinates(e,t)
    cameraToWorldCoordinatesPoint(e,t)
    cameraToWorldCoordinatesVector(e,t)
    canPreloadFlight()
    cancelFlight()
    completeFlight()
    computeViewRectangle(e,t)
    createCorrectPositionTween(e)
    distanceToBoundingSphere(e)
    flyHome(e)
    flyTo(e)
    flyToBoundingSphere(e,t)
    getMagnitude()
    getPickRay(e,t)
    getPixelSize(e,t,i)
    getRectangleCameraCoordinates(e,t)
    look(e,t)
    lookAt(e,t)
    lookAtTransform(e,t)
    lookDown(e)
    lookLeft(e)
    lookRight(e)
    lookUp(e)
    move(e,t)
    moveBackward(e)
    moveDown(e)
    moveForward(e)
    moveLeft(e)
    moveRight(e)
    moveUp(e)
    pickEllipsoid(e,t,i)
    rotate(e,t)
    rotateDown(e)
    rotateLeft(e)
    rotateRight(e)
    rotateUp(e)
    setView(e)
    switchToOrthographicFrustum()
    switchToPerspectiveFrustum()
    twistLeft(e)
    twistRight(e)
    update(e)
    viewBoundingSphere(e,t)
    worldToCameraCoordinates(e,t)
    worldToCameraCoordinatesPoint(e,t)
    worldToCameraCoordinatesVector(e,t)
    zoomIn(e)
    zoomOut(e)
}