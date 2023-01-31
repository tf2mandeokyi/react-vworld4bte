import { GeographicProjection } from "../geographic";
import { GeographicCoordinate, V2d } from "../types";
import { ProjectionTransform } from "./transform";

export class FlipVerticalProjectionTransform extends ProjectionTransform {

    constructor(delegate: GeographicProjection) {
        super(delegate);
    }

    toGeo(coord: V2d) {
        return this.delegate.toGeo({ x: coord.x, y: -coord.y });
    }

    fromGeo(coord: GeographicCoordinate) {
        let p = this.delegate.fromGeo(coord);
        return { x: p.x, y: -p.y };
    }

    upright() {
        return !this.delegate.upright();
    }

    bounds() {
        let b = this.delegate.bounds();
        return { 
            minX:  b.minX,
            minY: -b.maxY,
            maxX:  b.maxX,
            maxY: -b.minY
        };
    }

}