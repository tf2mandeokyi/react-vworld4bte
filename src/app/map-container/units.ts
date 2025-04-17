export function prettifyMeter(m: number) {
    if(m < 1000) return Math.round(m) + " m";

    const km = m / 1000;
    if(km < 149597) return km.toFixed(2) + " km";
    
    const au = km / 149598000;
    return au.toFixed(3) + " AU";
}

/**
 * "Degree minute second" struct
 */
interface DMSStruct {
    signum: number;
    deg: number;
    min: number;
    sec: number;
}


export function degreeToDMSStruct(decimal: number) : DMSStruct {
    const signum = Math.sign(decimal); decimal = Math.abs(decimal);
    const deg = Math.floor(decimal), ms = (decimal - deg) * 60;
    const min = Math.floor(ms)
    const sec = (ms - min) * 60;

    return { signum, deg, min, sec };
}


export function dmsStructToString({ signum, deg, min, sec }: DMSStruct, [ positive, negative ]: [string, string]) {
    const sign = signum === 1 ? positive : negative;
    const degStr = deg.toString().padStart(2, '0');
    const minStr = min.toString().padStart(2, '0');
    const secStr = (Math.floor(sec * 100) / 100).toFixed(2).toString().padStart(5, '0');
    return `${sign} ${degStr}° ${minStr}' ${secStr}"`;
}


export function degreeToDMSString(decimal: number, pn: [string, string]) {
    return dmsStructToString(degreeToDMSStruct(decimal), pn);
}