import { GeographicCoordinate } from "./types";

export class OutOfProjectionBoundsError extends Error {

    /**
     * @throws {@link OutOfProjectionBoundsError} if <code> Math.abs(x) > maxX || Math.abs(y) > maxY </code>
     */
    public static checkInRange(x: number, y: number, maxX: number, maxY: number) {
        if (Math.abs(x) > maxX || Math.abs(y) > maxY) {
            throw new OutOfProjectionBoundsError();
        }
    }

    /**
     * @throws {@link OutOfProjectionBoundsError} if <code> Math.abs(longitude) > 180 || Math.abs(latitude) > 90 </code>
     */
    static checkLongitudeLatitudeInRange(coord: GeographicCoordinate) {
        this.checkInRange(coord.lon, coord.lat, 180, 90);
    }

}