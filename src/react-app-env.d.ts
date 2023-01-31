import { GeographicProjection } from "./lib/bte-projection/geographic";

declare global {
    interface Window { bteProjection: GeographicProjection; }
}
window.bteProjection = window.bteProjection || {};
