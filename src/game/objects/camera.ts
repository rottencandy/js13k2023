import { lerp } from "../../core/interpolation";
import { CompPhysics } from "../components";

let oldX = 0, oldY = 0, dx = 0, dy = 0, PRECISION = 1e-3;

CompPhysics.push((_dt, k, cam) => {
    if (k.clk) {
        dx = (oldX - k.X) * 20;
        dy = (oldY - k.Y) * 16;
    } else {
        dx = lerp(dx, 0, .1);
        dy = lerp(dy, 0, .1);

        if (Math.abs(dx) < PRECISION) dx = 0;
        if (Math.abs(dy) < PRECISION) dy = 0;
    }
    oldX = k.X;
    oldY = k.Y;

    if (dx || dy) {
        cam.move(dx, 0, -dy);
    }
});
