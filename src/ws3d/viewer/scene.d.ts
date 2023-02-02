class Scene {
    globe: Globe;
    camera: Camera;

    pickPosition(coord: ws3d.common.Cartesian2): ws3d.common.Cartesian3 | undefined;
}