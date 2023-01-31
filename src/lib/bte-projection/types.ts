export type Vec2Array = [ number, number ];
export type Vec3Array = [ number, number, number ];
export type Vec6Array = [ number, number, number, number, number, number ];
export type RotationMatrix = [ Vec3Array, Vec3Array, Vec3Array ];

export type GeographicCoordinate = { lat: number; lon: number; }
export type V2d = { x: number; y: number; }
export type Spherical = { lambda: number, phi: number }
export type Cartesian = { x: number, y: number, z: number }

export type Bounds = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}

/**
 * @see {@link https://en.wikipedia.org/wiki/Tissot's_indicatrix Wikipedia's article on Tissot's indicatrix}
 */
export type TissotIndicatrix = {
    areaInflation: number;
    maxAngularDistortion: number;
    maxScaleFactor: number;
    minScaleFactor: number;
}