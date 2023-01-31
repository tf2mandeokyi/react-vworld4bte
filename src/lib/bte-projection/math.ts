import { Cartesian, GeographicCoordinate, RotationMatrix, Spherical, TissotIndicatrix } from "./types";

export const ROOT3 = Math.sqrt(3);

export function toRadians(param: number | { [x: string]: number }) : number {
    if(typeof param === 'number') {
        return param * (Math.PI / 180);
    } else {
        for(let key of Object.keys(param)) {
            param[key] = param[key] * (Math.PI / 180);
        }
        return 0;
    }
}

export function toDegrees(param: number | { [x: string]: number }) : number {
    if(typeof param === 'number') {
        return param * (180 / Math.PI);
    } else {
        for(let key of Object.keys(param)) {
            param[key] = param[key] * (180 / Math.PI);
        }
        return 0;
    }
}

export function geo2Spherical(geo: GeographicCoordinate) : Spherical {
    return {
        lambda: toRadians(geo.lon),
        phi:    toRadians(90 - geo.lat)
    }
}

export function spherical2Geo(spherical: Spherical) : GeographicCoordinate {
    return {
        lon: toDegrees(spherical.lambda),
        lat: 90 - toDegrees(spherical.phi)
    }
}

export function spherical2Cartesian(spherical: Spherical) : Cartesian {
    let sinphi = Math.sin(spherical.phi);
    return {
        x: sinphi * Math.cos(spherical.lambda),
        y: sinphi * Math.sin(spherical.lambda),
        z: Math.cos(spherical.phi)
    }
}

export function cartesian2Spherical(cartesian: Cartesian) : Spherical {
    return {
        lambda: Math.atan2(cartesian.y, cartesian.x),
        phi:    Math.atan2(Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y), cartesian.z)
    };
}

export function produceZYZRotationMatrix(a: number, b: number, c: number) : RotationMatrix {

    let sina = Math.sin(a);
    let cosa = Math.cos(a);
    let sinb = Math.sin(b);
    let cosb = Math.cos(b);
    let sinc = Math.sin(c);
    let cosc = Math.cos(c);

    return [
        [
            cosa * cosb * cosc - sinc * sina,
            -sina * cosb * cosc - sinc * cosa,
            cosc * sinb
        ],
        [
            sinc * cosb * cosa + cosc * sina,
            cosc * cosa - sinc * cosb * sina,
            sinc * sinb
        ],
        [
            -sinb * cosa,
            sinb * sina,
            cosb
        ]
    ];
}

export function matVecProdD<T extends number[]>(matrix: number[][], vector: number[]) : T {
    let result = new Array<number>(vector.length).fill(0) as T;
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            result[i] += matrix[i][j] * vector[j];
        }
    }
    return result;
}

export function getDistortionAmount(tissot: TissotIndicatrix) {
    return {
        value: (tissot.maxScaleFactor + tissot.minScaleFactor) / 2,
        error: (tissot.maxScaleFactor - tissot.minScaleFactor) / 2
    }
}