import { GeographicProjection } from "../geographic";

export abstract class ProjectionTransform extends GeographicProjection {

    delegate: GeographicProjection;

    constructor(delegate: GeographicProjection) {
        super();
        this.delegate = delegate;
    }

    upright() { return this.delegate.upright(); }
    bounds() { return this.delegate.bounds(); }
    metersPerUnit() { return this.delegate.metersPerUnit(); }
}