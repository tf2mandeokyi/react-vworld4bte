import { OutOfProjectionBoundsError } from "../errors";
import { ROOT3, toRadians } from "../math";
import { GeographicCoordinate, V2d } from "../types";
import { ConformalDymaxionProjection } from "./conformal";


const THETA = toRadians(-150);
const SIN_THETA = Math.sin(THETA);
const COS_THETA = Math.cos(THETA);
const BERING_X = -0.3420420960118339;//-0.3282152608138795;
const BERING_Y = -0.322211064085279;//-0.3281491467713469;
const ARCTIC_Y = -0.2;//-0.3281491467713469;
const ALEUTIAN_Y = -0.5000446805492526;//-0.5127463765943157;
const ALEUTIAN_XL = -0.5149231279757507;//-0.4957832938238718;
const ALEUTIAN_XR = -0.45;
const ALEUTIAN_M = (BERING_Y - ALEUTIAN_Y) / (BERING_X - ALEUTIAN_XR);
const ALEUTIAN_B = BERING_Y - ALEUTIAN_M * BERING_X;


/**
 * Implementation of the BTE modified Dynmaxion projection.
 *
 * @see {@link DymaxionProjection}
 * @see {@link ConformalDymaxionProjection}
 */
export class BTEDymaxionProjection extends ConformalDymaxionProjection {


    protected static readonly ARCTIC_M = (ARCTIC_Y - ROOT3 * this.ARC / 4) / (BERING_X - -0.5 * this.ARC);
    protected static readonly ARCTIC_B = ARCTIC_Y - this.ARCTIC_M * BERING_X;

    
    fromGeo(coord: GeographicCoordinate) : V2d {

        let { ARC } = BTEDymaxionProjection;

        let c = super.fromGeo(coord);
        let easia = this.isEurasianPart(c);

        let { x, y } = c;

        y -= 0.75 * ARC * ROOT3;

        if (easia) {
            x += ARC;

            let t = x;
            x = COS_THETA * x - SIN_THETA * y;
            y = SIN_THETA * t + COS_THETA * y;

        } else {
            x -= ARC;
        }

        return { x: y, y: -x };
    }

    
    toGeo(coord: V2d) : GeographicCoordinate{

        let { ARC } = BTEDymaxionProjection;
        let { x, y } = coord;

        let easia: boolean;

        if (y < 0) {
            easia = x > 0;
        } else if (y > ARC / 2) {
            easia = x > -ROOT3 * ARC / 2;
        } else {
            easia = y * -ROOT3 < x;
        }

        let t = x;
        x = -y;
        y = t;

        if (easia) {
            t = x;
            x = COS_THETA * x + SIN_THETA * y;
            y = COS_THETA * y - SIN_THETA * t;
            x -= ARC;

        } else {
            x += ARC;
        }

        y += 0.75 * ARC * ROOT3;

        coord = { x, y };

        //check to make sure still in right part
        if (easia !== this.isEurasianPart(coord)) {
            throw new OutOfProjectionBoundsError();
        }

        return super.toGeo(coord);
    }

    isEurasianPart(coord: V2d) : boolean {

        let { ARC, ARCTIC_B, ARCTIC_M } = BTEDymaxionProjection;
        let { x, y } = coord;

        //catch vast majority of cases in not near boundary
        if (x > 0) {
            return false;
        }
        if (x < -0.5 * ARC) {
            return true;
        }

        if (y > ROOT3 * ARC / 4) //above arctic ocean
        {
            return x < 0;
        }

        if (y < ALEUTIAN_Y) //below bering sea
        {
            return y < (ALEUTIAN_Y + ALEUTIAN_XL) - x;
        }

        if (y > BERING_Y) { //boundary across arctic ocean

            if (y < ARCTIC_Y) {
                return x < BERING_X; //in strait
            }

            return y < ARCTIC_M * x + ARCTIC_B; //above strait
        }

        return y > ALEUTIAN_M * x + ALEUTIAN_B;
    }

    bounds() {
        let { ARC } = BTEDymaxionProjection;
        return {
            minX: -1.5 * ARC * ROOT3, 
            minY: -1.5 * ARC,
            maxX: 3 * ARC, 
            maxY: ROOT3 * ARC 
        };
    }
}