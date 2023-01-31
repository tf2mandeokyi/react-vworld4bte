import { OutOfProjectionBoundsError } from "../errors";
import { GeographicProjection } from "../geographic";
import { cartesian2Spherical, geo2Spherical, matVecProdD, produceZYZRotationMatrix, ROOT3, spherical2Cartesian, spherical2Geo } from "../math";
import { Bounds, Cartesian, GeographicCoordinate, RotationMatrix, Spherical, V2d, Vec2Array, Vec3Array } from "../types";

    
/**
 * This contains the vertices of the icosahedron,
 * identified by their geographic longitude and latitude in degrees.
 * When the class is loaded, a static block below converts all these coordinates
 * to the equivalent spherical coordinates (longitude and colatitude), in radians.
 *
 * @see {@link https://en.wikipedia.org/wiki/Regular_icosahedron#Spherical_coordinates Wikipedia}
 */
const VERTICES_GEOCOORD : GeographicCoordinate[] = [
    { lon: 10.536199,   lat: 64.700000 },
    { lon: -5.245390,   lat: 2.300882 },
    { lon: 58.157706,   lat: 10.447378 },
    { lon: 122.300000,  lat: 39.100000 },
    { lon: -143.478490, lat: 50.103201 },
    { lon: -67.132330,  lat: 23.717925 },
    { lon: 36.521510,   lat: -50.103200 },
    { lon: 112.867673,  lat: -23.717930 },
    { lon: 174.754610,  lat: -2.300882 },
    { lon: -121.842290, lat: -10.447350 },
    { lon: -57.700000,  lat: -39.100000 },
    { lon: -169.463800, lat: -64.700000 },
];


export class DymaxionProjection extends GeographicProjection {


    protected static readonly ARC = 2 * Math.asin(Math.sqrt(5 - Math.sqrt(5)) / Math.sqrt(10));
    protected static readonly Z = Math.sqrt(5 + 2*Math.sqrt(5)) / Math.sqrt(15);
    protected static readonly EL = Math.sqrt(8) / Math.sqrt(5 + Math.sqrt(5));
    protected static readonly EL6 = this.EL / 6;
    protected static readonly DVE = Math.sqrt(3 + Math.sqrt(5)) / Math.sqrt(5 + Math.sqrt(5));
    protected static readonly R = - this.EL / (2 * this.DVE);
    
    /**
     * Number of iterations for Newton's method
     */
    protected static readonly NEWTON = 5;

    /**
     * This contains the vertices of the icosahedron,
     * identified by their geographic longitude and latitude in degrees.
     * When the class is loaded, a static block below converts all these coordinates
     * to the equivalent spherical coordinates (longitude and colatitude), in radians.
     *
     * @see {@link https://en.wikipedia.org/wiki/Regular_icosahedron#Spherical_coordinates Wikipedia}
     */
    protected static readonly VERTICES : Spherical[] = new Array<Spherical>(VERTICES_GEOCOORD.length);
    
    /**
     * Indicates the vertices forming each face of the icosahedron.
     * Each entry refers to the index of a vertex in {@link VERTICES}
     */
    protected static readonly ISO : Vec3Array[] = [
            [ 2, 1, 6 ],
            [ 1, 0, 2 ],
            [ 0, 1, 5 ],
            [ 1, 5, 10 ],
            [ 1, 6, 10 ],
            [ 7, 2, 6 ],
            [ 2, 3, 7 ],
            [ 3, 0, 2 ],
            [ 0, 3, 4 ],
            [ 4, 0, 5 ], //9, qubec
            [ 5, 4, 9 ],
            [ 9, 5, 10 ],
            [ 10, 9, 11 ],
            [ 11, 6, 10 ],
            [ 6, 7, 11 ],
            [ 8, 3, 7 ],
            [ 8, 3, 4 ],
            [ 8, 4, 9 ],
            [ 9, 8, 11 ],
            [ 7, 8, 11 ],
            [ 11, 6, 7 ], //child of 14
            [ 3, 7, 8 ] //child of 15
    ];
    
    protected static readonly CENTER_MAP : Vec2Array[] = [
            [ -3, 7 ],
            [ -2, 5 ],
            [ -1, 7 ],
            [ 2, 5 ],
            [ 4, 5 ],
            [ -4, 1 ],
            [ -3, -1 ],
            [ -2, 1 ],
            [ -1, -1 ],
            [ 0, 1 ],
            [ 1, -1 ],
            [ 2, 1 ],
            [ 3, -1 ],
            [ 4, 1 ],
            [ 5, -1 ], //14, left side, right to be cut
            [ -3, -5 ],
            [ -1, -5 ],
            [ 1, -5 ],
            [ 2, -7 ],
            [ -4, -7 ],
            [ -5, -5 ], //20, pseudo triangle, child of 14
            [ -2, -7 ] //21 , pseudo triangle, child of 15
    ];
    
    /**
     * Indicates for each face if it needs to be flipped after projecting
     */
    protected static readonly FLIP_TRIANGLE = [
            true, false, true, false, false,
            true, false, true, false, true, false, true, false, true, false,
            true, true, true, false, false,
            true, false
    ];
    
    /**
     * This contains the Cartesian coordinates the centroid
     * of each face of the icosahedron.
     */
    protected static readonly CENTROIDS : Cartesian[] = [];
    
    /**
     * Rotation matrices to move the triangles to the reference coordinates from the original positions.
     * Indexed by the face's indices.
     */
    protected static readonly ROTATION_MATRICES : RotationMatrix[] = [];
    
    /**
     * Rotation matrices to move the triangles from the reference coordinates to their original positions.
     * Indexed by the face's indices.
     */
    protected static readonly INVERSE_ROTATION_MATRICES : RotationMatrix[] = [];
    
    protected static readonly FACE_ON_GRID = [
            -1, -1, 0, 1, 2, -1, -1, 3, -1, 4, -1,
            -1, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
            20, 19, 15, 21, 16, -1, 17, 18, -1, -1, -1,
    ];


    static init() {
        for(let i = 0; i < 22; ++i) {
            this.CENTER_MAP[i][0] *= 0.5 * this.ARC;
            this.CENTER_MAP[i][1] *= this.ARC * ROOT3 / 12;
        }
    
        // Will contain the list of vertices in Cartesian coordinates
        let verticesCartesian = new Array<Cartesian>(VERTICES_GEOCOORD.length);
    
        // Convert the geographic vertices to spherical in radians
        for (let i = 0; i < VERTICES_GEOCOORD.length; i++) {
            let vertexSpherical = geo2Spherical(VERTICES_GEOCOORD[i]);
            let vertex = spherical2Cartesian(vertexSpherical);
            verticesCartesian[i] = vertex;
            this.VERTICES[i] = vertexSpherical;
        }
    
        for(let i = 0; i < 22; ++i) {
    
            // Vertices of the current face
            let vec1 = verticesCartesian[this.ISO[i][0]];
            let vec2 = verticesCartesian[this.ISO[i][1]];
            let vec3 = verticesCartesian[this.ISO[i][2]];
    
            // Find the centroid's projection onto the sphere
            let xsum = vec1.x + vec2.x + vec3.x;
            let ysum = vec1.y + vec2.y + vec3.y;
            let zsum = vec1.z + vec2.z + vec3.z;
            let mag = Math.sqrt(xsum * xsum + ysum * ysum + zsum * zsum);
            this.CENTROIDS[i] = { x: xsum / mag, y: ysum / mag, z: zsum / mag };
    
            let centroidSpherical = cartesian2Spherical(this.CENTROIDS[i]);
            let centroidLambda = centroidSpherical.lambda;
            let centroidPhi = centroidSpherical.phi;
    
            let vertex = this.VERTICES[this.ISO[i][0]];
            let v: Spherical = { lambda: vertex.lambda - centroidLambda, phi: vertex.phi };
            v = this.yRot(v, -centroidPhi);
    
            this.ROTATION_MATRICES[i] = produceZYZRotationMatrix(-centroidLambda, -centroidPhi, (Math.PI / 2) - v.lambda);
            this.INVERSE_ROTATION_MATRICES[i] = produceZYZRotationMatrix(v.lambda - (Math.PI / 2), centroidPhi, centroidLambda);
        }
    }


    protected static findTriangleGrid(coord: V2d) : number {

        //cast equilateral triangles to 45 degrees right triangles (side length of root2)
        let xp = coord.x / this.ARC;
        let yp = coord.y / (this.ARC * ROOT3);

        let row: number;
        if (yp > -0.25) {
            if (yp < 0.25) { //middle
                row = 1;
            } else if (yp <= 0.75) { //top
                row = 0;
                yp = 0.5 - yp; //translate to middle and flip
            } else {
                return -1;
            }
        } else if (yp >= -0.75) { //bottom
            row = 2;
            yp = -yp - 0.5; //translate to middle and flip
        } else {
            return -1;
        }

        yp += 0.25; //change origin to vertex 4, to allow grids to align

        //rotate coords 45 degrees so left and right sides of the triangle become the x/y axies (also side lengths are now 1)
        let xr = xp - yp;
        let yr = xp + yp;

        //assign a order to what grid along the y=x line it is
        let gx = Math.floor(xr);
        let gy = Math.floor(yr);

        let col = 2 * gx + (gy != gx ? 1 : 0) + 6;

        //out of bounds
        if (col < 0 || col >= 11) {
            return -1;
        }

        return this.FACE_ON_GRID[row * 11 + col]; //get face at this position
    }


    static yRot(spherical: Spherical, rot: number) : Spherical {
        let c = spherical2Cartesian(spherical);

        let x = c.x;
        c.x = c.z * Math.sin(rot) + x * Math.cos(rot);
        c.z = c.z * Math.cos(rot) - x * Math.sin(rot);

        let mag = Math.sqrt(c.x * c.x + c.y * c.y + c.z * c.z);
        c.x /= mag;
        c.y /= mag;
        c.z /= mag;

        return {
            lambda: Math.atan2(c.y, c.x),
            phi:    Math.atan2(Math.sqrt(c.x * c.x + c.y * c.y), c.z)
        };
    }


    /**
     * Finds the face of the icosahedron on which to project a point.
     * In practice, it works by finding the face with the closest centroid to the point.
     *
     * @param vector - position vector as Cartesian coordinates
     * @return an integer identifying the face on which to project the point
     */
    protected findTriangle(vector: Cartesian) {

        let { CENTROIDS } = DymaxionProjection;

        let min = Infinity, face = 0;

        for (let i = 0; i < 20; i++) {
            let xd = CENTROIDS[i].x - vector.x;
            let yd = CENTROIDS[i].y - vector.y;
            let zd = CENTROIDS[i].z - vector.z;

            let dissq = xd * xd + yd * yd + zd * zd;
            if (dissq < min) {

                if (dissq < 0.1) //TODO: enlarge radius
                {
                    return i;
                }

                face = i;
                min = dissq;
            }
        }

        return face;
    }


    protected triangleTransform(vec: Vec3Array) : V2d {

        let { Z, EL6, DVE } = DymaxionProjection;

        let S = Z / vec[2];

        let xp = S * vec[0];
        let yp = S * vec[1];

        let a = Math.atan((2 * yp / ROOT3 - EL6) / DVE); //ARC/2 terms cancel
        let b = Math.atan((xp - yp / ROOT3 - EL6) / DVE);
        let c = Math.atan((-xp - yp / ROOT3 - EL6) / DVE);

        return { x: 0.5 * (b - c), y: (2 * a - b - c) / (2 * ROOT3) };
    }


    protected inverseTriangleTransformNewton(pp: V2d) : Vec3Array {

        let { NEWTON, Z, R, EL6, DVE } = DymaxionProjection;

        //a & b are linearly related to c, so using the tan of sum formula we know: tan(c+off) = (tanc + tanoff)/(1-tanc*tanoff)
        let tanaoff = Math.tan(ROOT3 * pp.y + pp.x); // a = c + root3*y'' + x''
        let tanboff = Math.tan(2 * pp.x); // b = c + 2x''

        let anumer = tanaoff * tanaoff + 1;
        let bnumer = tanboff * tanboff + 1;

        //we will be solving for tanc, starting at t=0, tan(0) = 0
        let tana = tanaoff;
        let tanb = tanboff;
        let tanc = 0;

        let adenom = 1;
        let bdenom = 1;

        //double fp = anumer + bnumer + 1; //derivative relative to tanc

        //int i = newton;
        for (let i = 0; i < NEWTON; i++) {
            let f = tana + tanb + tanc - R; //R = tana + tanb + tanc
            let fp = anumer * adenom * adenom + bnumer * bdenom * bdenom + 1; //derivative relative to tanc

            //TODO: fp could be simplified on first loop: 1 + anumer + bnumer

            tanc -= f / fp;

            adenom = 1 / (1 - tanc * tanaoff);
            bdenom = 1 / (1 - tanc * tanboff);

            tana = (tanc + tanaoff) * adenom;
            tanb = (tanc + tanboff) * bdenom;
        }

        //simple reversal algebra based on tan values
        let yp = ROOT3 * (DVE * tana + EL6) / 2;
        let xp = DVE * tanb + yp / ROOT3 + EL6;

        //x = z*xp/Z, y = z*yp/Z, x^2 + y^2 + z^2 = 1
        let xpoZ = xp / Z;
        let ypoZ = yp / Z;

        let z = 1 / Math.sqrt(1 + xpoZ * xpoZ + ypoZ * ypoZ);

        return [ z * xpoZ, z * ypoZ, z ];
    }


    protected inverseTriangleTransform(coord: V2d) : Vec3Array {
        return this.inverseTriangleTransformNewton(coord);
    }


    fromGeo(coord: GeographicCoordinate) : V2d {
    	
    	OutOfProjectionBoundsError.checkLongitudeLatitudeInRange(coord);

        let vector = spherical2Cartesian(geo2Spherical(coord));

        let face = this.findTriangle(vector);

        //apply rotation matrix (move triangle onto template triangle)
        let pvec = matVecProdD<Vec3Array>(DymaxionProjection.ROTATION_MATRICES[face], [ vector.x, vector.y, vector.z ]);
        let projectedVec = this.triangleTransform(pvec);

        //flip triangle to correct orientation
        if (DymaxionProjection.FLIP_TRIANGLE[face]) {
            projectedVec.x = -projectedVec.x;
            projectedVec.y = -projectedVec.y;
        }

        vector.x = projectedVec.x;
        //deal with special snowflakes (child faces 20, 21)
        if (((face === 15 && vector.x > projectedVec.y * ROOT3) || face === 14) && vector.x > 0) {
            projectedVec.x = 0.5 * vector.x - 0.5 * ROOT3 * projectedVec.y;
            projectedVec.y = 0.5 * ROOT3 * vector.x + 0.5 * projectedVec.y;
            face += 6; //shift 14->20 & 15->21
        }

        projectedVec.x += DymaxionProjection.CENTER_MAP[face][0];
        projectedVec.y += DymaxionProjection.CENTER_MAP[face][1];

        return projectedVec;
    }

    
    toGeo(coord: V2d) : GeographicCoordinate {
        let { x, y } = coord;
        let face = DymaxionProjection.findTriangleGrid(coord);

        if (face === -1) {
            throw new OutOfProjectionBoundsError();
        }

        x -= DymaxionProjection.CENTER_MAP[face][0];
        y -= DymaxionProjection.CENTER_MAP[face][1];

        //deal with bounds of special snowflakes
        switch (face) {
            case 14:
                if (x > 0) {
                    throw new OutOfProjectionBoundsError();
                }
                break;
            case 20:
                if (-y * ROOT3 > x) {
                    throw new OutOfProjectionBoundsError();
                }
                break;
            case 15:
                if (x > 0 && x > y * ROOT3) {
                    throw new OutOfProjectionBoundsError();
                }
                break;
            case 21:
                if (x < 0 || -y * ROOT3 > x) {
                    throw new OutOfProjectionBoundsError();
                }
                break;
        }

        //flip triangle to upright orientation (if not already)
        if (DymaxionProjection.FLIP_TRIANGLE[face]) {
            x = -x;
            y = -y;
        }

        //invert triangle transform
        let c = this.inverseTriangleTransform({ x, y });
        x = c[0];
        y = c[1];
        let z = c[2];

        let vec = [ x, y, z ];
        //apply inverse rotation matrix (move triangle from template triangle to correct position on globe)
        let vecp = matVecProdD<Vec3Array>(DymaxionProjection.INVERSE_ROTATION_MATRICES[face], vec);

        //convert back to geo coordinates
        return spherical2Geo(cartesian2Spherical({ x: vecp[0], y: vecp[1], z: vecp[2] }));
    }


    bounds() : Bounds {
        let { ARC } = DymaxionProjection;
        return { 
            minX: -3 * ARC,
            minY: -0.75 * ARC * ROOT3,
            maxX: 2.5 * ARC,
            maxY: 0.75 * ARC * ROOT3
        };
    }


    upright() : boolean {
        return false;
    }


    metersPerUnit() : number {
        let { ARC } = DymaxionProjection;
        return Math.sqrt(510100000000000.0 / (20 * ROOT3 * ARC * ARC / 4));
    }
};

DymaxionProjection.init();