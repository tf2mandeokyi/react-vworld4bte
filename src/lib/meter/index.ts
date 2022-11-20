export function prettifyMeter(m: number) {
    if(m < 1000) return Math.round(m) + " m";

    let km = m / 1000;
    if(km < 149597) return km.toFixed(2) + " km";
    
    let au = km / 149598000;
    return au.toFixed(3) + " AU";
}