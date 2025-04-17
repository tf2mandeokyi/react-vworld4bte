/* eslint-disable  @typescript-eslint/no-explicit-any */

namespace ws3d.controller {
    class ObjectManager {
        constructor(e);

        addedEntityObjectArray: any[];
        addedPrimitiveObjectArray: any[];
        scene: Scene;
        viewer: Viewer;

        colorForDrawingCircle: ws3d.common.Color;
        colorForDrawingCircleEndPoint: ws3d.common.Color;
        colorForDrawingCircleStartPoint: ws3d.common.Color;
        colorForDrawingPolyLine: ws3d.common.Color;
        colorForDrawingPolyLineStartPoint: ws3d.common.Color;
        colorForDrawingPolygon: ws3d.common.Color;
        colorForDrawingPolygonEndPoint: ws3d.common.Color;
        colorForDrawingPolygonStartPoint: ws3d.common.Color;
        colorForDrawingPolylineEndPoint: ws3d.common.Color;
    }
}