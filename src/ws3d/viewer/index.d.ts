namespace ws3d {
    const viewer: Viewer;
}

class Viewer {
    map: ws3d.common.map.Map;
    scene: Scene;
    objectManager: ws3d.controller.ObjectManager
}