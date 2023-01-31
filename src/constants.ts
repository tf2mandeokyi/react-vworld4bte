import { BTEDymaxionProjection } from "./lib/bte-projection/dymaxion/bte";
import { FlipVerticalProjectionTransform } from "./lib/bte-projection/transform/flipVertical";
import { ScaleProjectionTransform } from "./lib/bte-projection/transform/scale";

export const bteProjection = new ScaleProjectionTransform(
    new FlipVerticalProjectionTransform(
        new BTEDymaxionProjection()
    ), 7318261.522857145, 7318261.522857145
);

window.bteProjection = bteProjection;