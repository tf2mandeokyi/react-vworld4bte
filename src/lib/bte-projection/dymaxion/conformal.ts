import { DymaxionProjection } from "./dymaxion";
import { V2d, Vec3Array, Vec6Array } from "../types";
import { ROOT3 } from "../math";

import conformalTextFile from './conformal.txt'


const VECTOR_SCALE_FACTOR = 1.0 / 1.1473979730192934;
const SIDE_LENGTH = 256;


class InvertableVectorField {
    vx: number[][];
    vy: number[][];

    constructor(vx: number[][], vy: number[][]) {
        this.vx = vx;
        this.vy = vy;
    }

    getInterpolatedVector(coord: V2d) : Vec6Array {
        let { x, y } = coord;

        //scale up triangle to be triangleSize across
        x *= SIDE_LENGTH;
        y *= SIDE_LENGTH;

        //convert to triangle units
        let v = 2 * y / ROOT3;
        let u = x - v * 0.5;

        let u1 = Math.floor(u);
        let v1 = Math.floor(v);

        if (u1 < 0) {
            u1 = 0;
        } else if (u1 >= SIDE_LENGTH) {
            u1 = SIDE_LENGTH - 1;
        }

        if (v1 < 0) {
            v1 = 0;
        } else if (v1 >= SIDE_LENGTH - u1) {
            v1 = SIDE_LENGTH - u1 - 1;
        }

        let valx1: number;
        let valy1: number;
        let valx2: number;
        let valy2: number;
        let valx3: number;
        let valy3: number;
        let y3: number;
        let x3: number;

        let flip = 1;

        if (y < -ROOT3 * (x - u1 - v1 - 1) || v1 === SIDE_LENGTH - u1 - 1) {
            valx1 = this.vx[u1][v1];
            valy1 = this.vy[u1][v1];
            valx2 = this.vx[u1][v1 + 1];
            valy2 = this.vy[u1][v1 + 1];
            valx3 = this.vx[u1 + 1][v1];
            valy3 = this.vy[u1 + 1][v1];

            y3 = 0.5 * ROOT3 * v1;
            x3 = (u1 + 1) + 0.5 * v1;
        } else {
            valx1 = this.vx[u1][v1 + 1];
            valy1 = this.vy[u1][v1 + 1];
            valx2 = this.vx[u1 + 1][v1];
            valy2 = this.vy[u1 + 1][v1];
            valx3 = this.vx[u1 + 1][v1 + 1];
            valy3 = this.vy[u1 + 1][v1 + 1];

            flip = -1;
            y = -y;

            y3 = -(0.5 * ROOT3 * (v1 + 1));
            x3 = (u1 + 1) + 0.5 * (v1 + 1);
        }

        //TODO: not sure if weights are right (but weirdly mirrors stuff so there may be simplifcation yet)
        let w1 = -(y - y3) / ROOT3 - (x - x3);
        let w2 = 2 * (y - y3) / ROOT3;
        let w3 = 1 - w1 - w2;

        return [
            valx1 * w1 + valx2 * w2 + valx3 * w3,
            valy1 * w1 + valy2 * w2 + valy3 * w3,
            (valx3 - valx1) * SIDE_LENGTH, SIDE_LENGTH * flip * (2 * valx2 - valx1 - valx3) / ROOT3,
            (valy3 - valy1) * SIDE_LENGTH, SIDE_LENGTH * flip * (2 * valy2 - valy1 - valy3) / ROOT3 
        ];
    }

    applyNewtonsMethod(expectedf: number, expectedg: number, est: V2d, iter: number) : V2d {
        let newEst: V2d = { ...est };

        for (let i = 0; i < iter; i++) {
            let c = this.getInterpolatedVector(newEst);

            let f = c[0] - expectedf;
            let g = c[1] - expectedg;
            let dfdx = c[2];
            let dfdy = c[3];
            let dgdx = c[4];
            let dgdy = c[5];

            let determinant = 1 / (dfdx * dgdy - dfdy * dgdx);

            newEst.x -= determinant * (dgdy * f - dfdy * g);
            newEst.y -= determinant * (-dgdx * f + dfdx * g);
        }

        return newEst;
    }
}


async function getInverseData() : Promise<InvertableVectorField> {
    let vx = new Array<number[]>(SIDE_LENGTH + 1);
    let vy = new Array<number[]>(SIDE_LENGTH + 1);

    for(let i = 0; i < SIDE_LENGTH + 1; i++) {
        vx[i] = new Array<number>(SIDE_LENGTH + 1 - i);
        vy[i] = new Array<number>(SIDE_LENGTH + 1 - i);
    }

    let conformalText = await (await fetch(conformalTextFile)).text();
    let conformalData: [ number, number ][] = conformalText.split('\n').map(line => {
        let split = line.split(' ');
        return [ parseFloat(split[0]), parseFloat(split[1]) ]
    });

    let line = 0;
    for (let v = 0; v < SIDE_LENGTH + 1; v++) {
        for (let u = 0; u < SIDE_LENGTH + 1 - v; u++) {
            vx[u][v] = conformalData[line][0] * VECTOR_SCALE_FACTOR;
            vy[u][v] = conformalData[line][1] * VECTOR_SCALE_FACTOR;
            line++;
        }
    }

    return new InvertableVectorField(vx, vy);
}


let INVERSE : InvertableVectorField;
(async () => {
    if(typeof window !== 'undefined') INVERSE = await getInverseData();
})(); 


/**
 * Implementation of the Dynmaxion like conformal projection.
 * Slightly modifies the Dynmaxion projection to make it (almost) conformal.
 *
 * @see DymaxionProjection
 */
export class ConformalDymaxionProjection extends DymaxionProjection {

    
    triangleTransform(vec: Vec3Array) {
        let { ARC } = DymaxionProjection;
        let c = super.triangleTransform(vec);

        let x = c.x;
        let y = c.y;

        c.x /= ARC;
        c.y /= ARC;

        c.x += 0.5;
        c.y += ROOT3 / 6;

        //use another interpolated vector to have a really good guess before using Newton's method
        //Note: foward was removed for now, will need to be added back if this improvement is ever re-implemented
        //c = forward.getInterpolatedVector(c);
        //c = inverse.applyNewtonsMethod(x, y, [ c[0]/ARC + 0.5, c[1]/ARC + ROOT3/6 ], 1);

        //just use newtons method: slower
        c = INVERSE.applyNewtonsMethod(x, y, c, 5);//c[0]/ARC + 0.5, c[1]/ARC + ROOT3/6

        c.x -= 0.5;
        c.y -= ROOT3 / 6;

        c.x *= ARC;
        c.y *= ARC;

        return c;
    }


    inverseTriangleTransform(coord: V2d) : Vec3Array {
        let { ARC } = DymaxionProjection;

        coord.x /= ARC;
        coord.y /= ARC;

        coord.x += 0.5;
        coord.y += ROOT3 / 6;

        let c = INVERSE.getInterpolatedVector(coord);
        return super.inverseTriangleTransform({ x: c[0], y: c[1] });
    }

    
    metersPerUnit() {
        return (40075017.0 / (2.0 * Math.PI)) / VECTOR_SCALE_FACTOR;
    }

}