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
    let signum = Math.sign(decimal); decimal = Math.abs(decimal);
    let deg = Math.floor(decimal), ms = (decimal - deg) * 60;
    let min = Math.floor(ms)
    let sec = (ms - min) * 60;

    return { signum, deg, min, sec };
}


export function dmsStructToString({ signum, deg, min, sec }: DMSStruct, [ positive, negative ]: [string, string]) {
    return `${
        signum === 1 ? positive : negative
    } ${
        deg.toString().padStart(2, '0')
    }° ${
        min.toString().padStart(2, '0')
    }' ${
        (Math.floor(sec * 100) / 100).toFixed(2).toString().padStart(5, '0')
    }"`
}


export function degreeToDMSString(decimal: number, pn: [string, string]) {
    return dmsStructToString(degreeToDMSStruct(decimal), pn);
}