namespace ws3d.common {

    class BoundingSphere {
        static readonly packedLength: number

        static clone(e: BoundingSphere, t?: BoundingSphere)
        static computePlaneDistances(e,t,i,n)
        static distanceSquaredTo(e,t)
        static equals(e,t)
        static expand(e,t,i)
        static fromBoundingSpheres(e,t)
        static fromCornerPoints(e,t,i)
        static fromEllipsoid(e,t)
        static fromEncodedCartesianVertices(e,t,i)
        static fromOrientedBoundingBox(e,t)
        static fromPoints(e,t)
        static fromRectangle2D(e,t,i)
        static fromRectangle3D(e,t,i,n)
        static fromRectangleWithHeights2D(e,t,i,n,r)
        static fromVertices(e,t,i,n)
        static intersectPlane(e,t)
        static isOccluded(e,t)
        static pack(e,t,i)
        static projectTo2D(e,t,i)
        static transform(e,t,i)
        static transformWithoutScale(e,t,i)
        static union(e,t,i)
        static unpack(e,t,i)

        constructor(e,t);

        clone(e?: BoundingSphere)
        computePlaneDistances(e,t,i)
        distanceSquaredTo(e)
        equals(e)
        intersectPlane(e)
        isOccluded(e)
        volume()
    }

    class AbstractCartesian<T> {
        static abs(e,t);
        static add(e,t,i);
        static clone(e, t?);
        static distance(e,t);
        static distanceSquared(e,t);
        static divideByScalar(e,t,i);
        static divideComponents(e,t,i);
        static dot(e,t);
        static equals(e,t);
        static equalsArray(e,t,i);
        static equalsEpsilon(e,t,i,n);
        static fromArray(e,t,i);
        static lerp(e,t,i,n);
        static magnitude(e);
        static magnitudeSquared(e);
        static maximumByComponent(e,t,i);
        static maximumComponent(e);
        static minimumByComponent(e,t,i);
        static minimumComponent(e);
        static mostOrthogonalAxis(e,t);
        static multiplyByScalar(e,t,i);
        static multiplyComponents(e,t,i);
        static negate(e,t);
        static normalize(e,t);
        static pack(e,t,i);
        static packArray(e,t);
        static subtract(e,t,i);
        static unpack(e,t,i);
        static unpackArray(e,t);

        static readonly packedLength: number;

        clone(e?: T);
        equals(e: T);
        equalsEpsilon(e,t,i);
        toString();
    }

    class Cartesian2 extends AbstractCartesian<Cartesian2> {
        static readonly ZERO: Cartesian2;
        static readonly UNIT_X: Cartesian2;
        static readonly UNIT_Y: Cartesian2;

        static angleBetween(e,t);
        static fromCartesian3(e,t);
        static fromCartesian4(e,t);
        static fromElements(e,t,i);

        x: number;
        y: number;

        constructor(x?: number, y?: number);
    }

    class Cartesian3 extends AbstractCartesian<Cartesian3> {
        static readonly UNIT_X: Cartesian3;
        static readonly UNIT_Y: Cartesian3;
        static readonly UNIT_Z: Cartesian3;
        static readonly ZERO: Cartesian3;

        static angleBetween(e,t);
        static cross(e,t,i);
        static fromCartesian4(e,t);
        static fromDegrees(e,t,i,n,r);
        static fromDegreesArray(e,t,i);
        static fromDegreesArrayHeights(e,t,i);
        static fromElements(e,t,i,n);
        static fromRadians(e,t,i,n,r);
        static fromRadiansArray(e,t,i);
        static fromRadiansArrayHeights(e,t,i);
        static fromSpherical(e,t);
        static midpoint(e,t,i);
        static projectVector(e,t,i);

        x: number;
        y: number;
        z: number;

        constructor(x?: number, y?: number, z?: number);
    }

    class Cartesian4 extends AbstractCartesian<Cartesian4> {
        static readonly UNIT_W: Cartesian4;
        static readonly UNIT_X: Cartesian4;
        static readonly UNIT_Y: Cartesian4;
        static readonly UNIT_Z: Cartesian4;
        static readonly ZERO: Cartesian4;

        static fromColor(e,t);
        static fromElements(e,t,i,n,r);
        static packFloat(e,t);
        static unpackFloat(e);

        x: number;
        y: number;
        z: number;
        w: number;

        constructor(x?: number, y?: number, z?: number, w?: number);
    }

    class Cartographic {
        static readonly ZERO: Cartographic

        static clone(e: Cartographic, t?: Cartographic);
        static equals(e: Cartographic, t: Cartographic);
        static equalsEpsilon(e: Cartographic, t: Cartographic, i: number);
        static fromCartesian(e: Cartesian3, t?: any, i?: any);
        static fromDegrees(e,t,i,n);
        static fromRadians(e,t,i,n);
        static toCartesian(e: Cartographic, t?: any, i?: any);

        /** In radians */
        latitude: number;
        /** In degrees */
        readonly latitudeDD: number;

        /** In radians */
        longitude: number;
        /** In degrees */
        readonly longitudeDD: number;

        /** In radians */
        height: number;
        
        /**
         * @param latitude in radians
         * @param longitude in radians
         * @param height in meter
         */
        constructor(latitude?: number, longitude?: number, height?: number);


        clone(e?: Cartographic)
        equals(e: Cartographic)
        equalsEpsilon(e: Cartographic, t: number)
        toString()
    }

    class CesiumMath {
        static readonly DEGREES_PER_RADIAN: number;
        static readonly EPSILON1: number;
        static readonly EPSILON2: number;
        static readonly EPSILON3: number;
        static readonly EPSILON4: number;
        static readonly EPSILON5: number;
        static readonly EPSILON6: number;
        static readonly EPSILON7: number;
        static readonly EPSILON8: number;
        static readonly EPSILON9: number;
        static readonly EPSILON10: number;
        static readonly EPSILON11: number;
        static readonly EPSILON12: number;
        static readonly EPSILON13: number;
        static readonly EPSILON14: number;
        static readonly EPSILON15: number;
        static readonly EPSILON16: number;
        static readonly EPSILON17: number;
        static readonly EPSILON18: number;
        static readonly EPSILON19: number;
        static readonly EPSILON20: number;
        static readonly EPSILON21: number;
        static readonly FOUR_GIGABYTES: number;
        static readonly GRAVITATIONALPARAMETER: number;
        static readonly LUNAR_RADIUS: number;
        static readonly ONE_OVER_PI: number;
        static readonly ONE_OVER_TWO_PI: number;
        static readonly PI: number;
        static readonly PI_OVER_FOUR: number;
        static readonly PI_OVER_SIX: number;
        static readonly PI_OVER_THREE: number;
        static readonly PI_OVER_TWO: number;
        static readonly RADIANS_PER_ARCSECOND: number;
        static readonly RADIANS_PER_DEGREE: number;
        static readonly SIXTY_FOUR_KILOBYTES: number;
        static readonly SOLAR_RADIUS: number;
        static readonly THREE_PI_OVER_TWO: number;
        static readonly TWO_PI: number;

        static acosClamped(e)
        static asinClamped(e)
        static cbrt()
        static chordLength(e,t)
        static clamp(e,t,i)
        static clampToLatitudeRange(e)
        static convertLongitudeRange(e)
        static cosh()
        static equalsEpsilon(e,t,i,n)
        static factorial(e)
        static fastApproximateAtan(e)
        static fastApproximateAtan2(e,t)
        static fog(e,t)
        static fromSNorm(e,t)
        static greaterThan(e,t,i)
        static greaterThanOrEquals(e,t,i)
        static incrementWrap(e,t,i)
        static isPowerOfTwo(e)
        static lerp(e,t,i)
        static lessThan(e,t,i)
        static lessThanOrEquals(e,t,i)
        static log2()
        static logBase(e,t)
        static mod(e,t)
        static negativePiToPi(e)
        static nextPowerOfTwo(e)
        static nextRandomNumber()
        static normalize(e,t,i)
        static randomBetween(e,t)
        static setRandomNumberSeed(e)
        static sign()
        static signNotZero(e)
        static sinh()
        static toDegrees(e)
        static toRadians(e)
        static toSNorm(e,t)
        static zeroToTwoPi(e)
    }

    class Color {
        red: number;
        green: number;
        blue: number;
        alpha: number;

        constructor(red: number, green: number, blue: number, alpha: number);
    }

    enum ElementChangeType {
        ADD, HIDE, MOVE, OTHER, REMOVE, RENAME, SHOW, UPDATE
    }

    class Event <F extends (...args: any[]) => void> {
        addEventListener(listener: F): () => void;
        raiseEvent(): void;
        removeEventListener(listener: F): void; 
    }

    // TODO: fill rest of these
    class GeometryGraphics {
        constructor(e,t,i);
    }
    class HeadingPitchRange {
        constructor(e,t,i);
    }
    class HeadingPitchRoll {
        constructor(e,t,i);
    }
    enum HorizontalOrigin {
        CENTER, LEFT, RIGHT
    }
    class IntersectionTests {
        static grazingAltitudeLocation(e,t)
        static lineSegmentPlane(e,t,i,n)
        static lineSegmentSphere(e,t,i,n)
        static lineSegmentTriangle(e,t,i,n,r,o,a)
        static rayEllipsoid(e,t)
        static rayPlane(e,t,i)
        static raySphere(e,t,i)
        static rayTriangle(e,t,i,n,r,o)
        static rayTriangleParametric(e,t,i,n,r)
        static trianglePlaneIntersection(e,t,i,n)
    }
    class JulianDate {
        constructor(e,t,i);
    }
    enum LabelStyle {
        FILL, OUTLINE, FILL_AND_OUTLINE
    }
    class Logger {
        constructor();
    }
    class Matrix3 {
        constructor(e,t,i,n,r,o,a,s,l);
    }
    class Matrix4 {
        constructor(e,t,i,n,r,o,a,s,l,u,c,h,d,p,f,m);
    }
    class OgcExtent {
        constructor(e,t,i,n,r,o);
    }
    class OgcGeometry {
        constructor();
    }
    class OgcGeometryCollection {
        constructor(e);
    }
    class OgcLineString {
        constructor(e);
    }
    class OgcLinearRing {
        constructor(e);
    }
    class OgcMultiLineString {
        constructor(e);
    }
    class OgcMultiPoint {
        constructor(e);
    }
    class OgcMultiPolygon {
        constructor(e);
    }
    class OgcPoint {
        constructor(e,t,i);
    }
    class OgcPolygon {
        constructor(e,t);
    }
    class Quaternion {
        constructor(e,t,i,n);
    }
    class Ray {
        constructor(e,t);
    }
    class ShapeFileReader {
        constructor();
    }
    enum VerticalOrigin {
        CENTER, BOTTOM, BASELINE, TOP
    }
}