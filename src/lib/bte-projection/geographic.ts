import { EARTH_CIRCUMFERENCE, EARTH_POLAR_CIRCUMFERENCE } from "./constants";
import { toDegrees, toRadians } from "./math";
import { Bounds, GeographicCoordinate, V2d, TissotIndicatrix } from "./types";


export abstract class GeographicProjection {


    /**
     * Converts map coordinates to geographic coordinates
     */
    abstract toGeo(coord: V2d) : GeographicCoordinate;


    /**
     * Converts geographic coordinates to map coordinates
     */
    abstract fromGeo(coord: GeographicCoordinate) : V2d;


    /**
     * Gives an estimation of the scale of this projection.
     * This is just an estimation, as distortion is inevitable when projecting a sphere onto a flat surface,
     * so this value varies from places to places in reality.
     *
     * @return an estimation of the scale of this projection
     */
    abstract metersPerUnit() : number;


    /**
     * Indicates the minimum and maximum X and Y coordinates on the projected space.
     */
    bounds() : Bounds {
        try {
            let bounds = {
                minX: this.fromGeo({ lon: -180, lat: 0 }).x,
                minY: this.fromGeo({ lon: 0, lat: -90 }).y,
                maxX: this.fromGeo({ lon: 180, lat: 0 }).x,
                maxY: this.fromGeo({ lon: 0, lat: 90 }).y
            }

            if (bounds.minX > bounds.maxX) [ bounds.minX, bounds.maxX ] = [ bounds.maxX, bounds.minX ]
            if (bounds.minY > bounds.maxY) [ bounds.minY, bounds.maxY ] = [ bounds.maxY, bounds.minY ]

            return bounds;
        } catch(e) {
            return {
                minX: 0, minY: 0,
                maxX: 1, maxY: 1
            }
        }
    }


    /**
     * Indicates whether or not the north pole is projected to the north of the south pole on the projected space,
     * assuming Minecraft's coordinate system cardinal directions for the projected space (north is negative Z).
     *
     * @return north pole Z <= south pole Z
     */
    upright() : boolean {
        try {
            return this.fromGeo({ lon: 0, lat: 90 }).y <= this.fromGeo({ lon: 0, lat: -90 }).y;
        } catch(e) {
            return false;
        }
    }


    /**
     * Calculates the vector that goes a given distance north and a given distance east from the given point in the projected space.
     * This is useful to get a direction in the projected space, e.g. it is used to calculate the north vector used when sending eyes of ender.
     */
    vector(coord: V2d, vector: { north: number, east: number }) : V2d {
        let geo = this.toGeo(coord);

        //TODO: east may be slightly off because earth not a sphere
        let off = this.fromGeo({
            lon: geo.lon + vector.east  * 360.0 / (Math.cos(toRadians(geo.lat)) * EARTH_CIRCUMFERENCE),
            lat: geo.lat + vector.north * 360.0 / EARTH_POLAR_CIRCUMFERENCE
        });

        return { x: off.x - coord.x, y: off.y - coord.y };
    }


    private tissot_d(coord: GeographicCoordinate, d: number) : TissotIndicatrix {
        let R = EARTH_CIRCUMFERENCE / (2 * Math.PI);

        let ddeg = toDegrees(d);

        let base = this.fromGeo(coord);
        let lonoff = this.fromGeo({ lon: coord.lon + ddeg, lat: coord.lat });
        let latoff = this.fromGeo({ lon: coord.lon, lat: coord.lat + ddeg });

        let dxdl = (lonoff.x - base.x) / d;
        let dxdp = (latoff.x - base.x) / d;
        let dydl = (lonoff.y - base.y) / d;
        let dydp = (latoff.y - base.y) / d;

        let cosp = Math.cos(toRadians(coord.lat));

        let h = Math.sqrt(dxdp * dxdp + dydp * dydp) / R;
        let k = Math.sqrt(dxdl * dxdl + dydl * dydl) / (cosp * R);

        let sint = Math.abs(dydp * dxdl - dxdp * dydl) / (R * R * cosp * h * k);
        let ap = Math.sqrt(h * h + k * k + 2 * h * k * sint);
        let bp = Math.sqrt(h * h + k * k - 2 * h * k * sint);

        let a = (ap + bp) / 2;
        let b = (ap - bp) / 2;

        return {
            areaInflation: h * k * sint,
            maxAngularDistortion: 2 * Math.asin(bp / ap),
            maxScaleFactor: a,
            minScaleFactor: b
        };
    }
    

    /**
     * Computes the Tissot's indicatrix of this projection at the given point (i.e. the distortion).
     */
    tissot(coord: GeographicCoordinate) {
        return this.tissot_d(coord, 1E-7);
    }


    /**
     * Converts an angle in the projected space to an azimuth in the geographic space, at a specific point.
     * This is useful to get the direction an entity is looking at, i.e. it will be used by Terramap to show the direction entities are facing.
     * With conformal projections, this should be equivalent to using {@link GeographicProjection.vector()} and computing the facing azimuth in the projected space,
     * but on non-conformal projections angles are not preserved when projecting and this will be right when using {@link GeographicProjection.vector()} is likely to be wrong.
     * 
     * @returns the corresponding azimuth, in degrees, counted positively clockwise, between 0° and 360°.
     */
    private azimuth_d(coord: V2d, angle: number, d: number) : number {
        let coord2 : V2d = {
            x: coord.x - d * Math.sin(toRadians(angle)),
            y: coord.y + d * Math.cos(toRadians(angle))
        }
        let geo1 = this.toGeo(coord);
        let geo2 = this.toGeo(coord2);
        toRadians(geo1);
        toRadians(geo2);
        let dlon = geo2.lon - geo1.lon;
        let dlat = geo2.lat - geo1.lat;
        let a = toDegrees(Math.atan2(dlat, dlon * Math.cos(geo1.lat)));
        a = 90 - a;
        if (a < 0) a += 360;
        return a;
    }


    /**
     * Converts an angle in the projected space to an azimuth in the geographic space, at a specific point.
     * This is useful to get the direction an entity is looking at, i.e. it will be used by Terramap to show the direction entities are facing.
     * With conformal projections, this should be equivalent to using {@link GeographicProjection.vector()} and computing the facing azimuth in the projected space,
     * but on non-conformal projections angles are not preserved when projecting and this will be right when using {@link GeographicProjection.vector()} is likely to be wrong.
     * 
     * @returns the corresponding azimuth, in degrees, counted positively clockwise, between 0° and 360°.
     */
    azimuth(coord: V2d, angle: number) : number {
        return this.azimuth_d(coord, angle, 1E-5);
    }
}