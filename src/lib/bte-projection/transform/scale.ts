import { GeographicProjection } from "../geographic";
import { GeographicCoordinate, V2d } from "../types";
import { ProjectionTransform } from "./transform";

export class ScaleProjectionTransform extends ProjectionTransform {
    x: number;
    y: number;

    constructor(delegate: GeographicProjection, x: number, y: number) {
        super(delegate);
        this.x = x;
        this.y = y;
    }

    toGeo(coord: V2d) {
        return this.delegate.toGeo({ x: coord.x / this.x, y: coord.y / this.y });
    }

    fromGeo(coord: GeographicCoordinate) {
        let p = this.delegate.fromGeo(coord);
        return { x: p.x * this.x, y: p.y * this.y };
    }

    upright() {
        return (this.y < 0) !== this.delegate.upright();
    }

    bounds() {
        let b = this.delegate.bounds();
        return {
            minX: b.minX * this.x,
            minY: b.minY * this.y,
            maxX: b.maxX * this.x,
            maxY: b.maxY * this.y
        };
    }

    metersPerUnit() {
        return this.delegate.metersPerUnit() / Math.sqrt((this.x * this.x + this.y * this.y) / 2); //TODO: better transform
    }

}