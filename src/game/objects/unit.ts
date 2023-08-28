import { draw, shaderProgram, uniformFns, useProgram } from "../../core/webgl2-stateless";
import { CompInit, CompPhysics, CompRender } from "../components";
import vertex from './unit.vert';
import frag from './unit.frag';
import { Fort, handleUnitPathEnd } from "./fort";
import { GL_POINTS } from "../../core/gl-constants";
import { lerp } from "../../core/interpolation";

export type Unit = {
    // source
    xs: number;
    ys: number;
    // destination
    xd: number;
    yd: number;
    // lerp duration
    dur: number;

    src: number;
    dst: number;
}

let units: Unit[][] = [[]];
let prg: WebGLProgram, uColor: any, uPos: any, uMat: any;
const SPEED = 0.7;

export const clearUnits = () => {
    units = [[]];
};

export const spawnUnit = (frm: number, to: number, forts: Fort[]) => {
    const f1 = forts[frm];
    const f2 = forts[to];
    units[f1.col].push({
        xs: f1.x,
        ys: f1.y,
        xd: f2.x,
        yd: f2.y,
        dur: 0,
        src: frm,
        dst: to
    });
};

CompInit.push((gl) => {
    prg = shaderProgram(gl, vertex, frag);
    const uniform = uniformFns(gl, prg);
    uMat = uniform('uMat').m4fv;
    uColor = uniform('uColor').u3f;
    uPos = uniform('uPos').u4f;
});

CompPhysics.push((dt) => {
    for (let c = 0; c < units.length; c++) {
        const unitSet = units[c];
        for (let i = 0; i < unitSet.length; i++) {
            const unit = unitSet[i];
            unit.dur += SPEED * dt;
            if (unit.dur > 1) {
                unitSet.splice(i, 1);
                c--;
                handleUnitPathEnd(unit.dst, c);
            }
        }
    }
});

CompRender.push((gl, mat) => {
    useProgram(gl, prg);

    uMat(mat);

    for (let c = 0; c < units.length; c++) {
        const unitSet = units[c];
        for (let i = 0; i < unitSet.length; i++) {
            const u = unitSet[i];
            const x = lerp(u.xs, u.xd, u.dur);
            const y = lerp(u.ys, u.yd, u.dur);
            uPos(x, .1, y, 1);
            uColor(1., .4, .4);
            draw(gl, 1, GL_POINTS);
        }
    }
});
