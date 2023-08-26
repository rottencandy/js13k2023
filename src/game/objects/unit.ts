import { draw, shaderProgram, uniformFns, useProgram } from "../../core/webgl2-stateless";
import { CompInit, CompRender } from "../components";
import vertex from './unit.vert';
import frag from './unit.frag';
import { FortColor } from "./fort";
import { GL_POINTS } from "../../core/gl-constants";

let prg: WebGLProgram, uColor: any, uPos: any, uMat: any;

export type Unit = {
    x: number;
    y: number;
    // lerp duration
    dur: number;
    col: FortColor;
}

let units: Unit[] = [{x: 3, y: 0, dur: 0, col: 0}];

export const setUnits = () => {
    units = [];
};

CompInit.push((gl) => {
    prg = shaderProgram(gl, vertex, frag);
    const uniform = uniformFns(gl, prg);
    uMat = uniform('uMat').m4fv;
    uColor = uniform('uColor').u3f;
    uPos = uniform('uPos').u4f;
});

CompRender.push((gl, mat) => {
    useProgram(gl, prg);

    uMat(mat);

    for (let i = 0; i < units.length; i++) {
        let u = units[i];
        uColor(1., .4, .4);
        uPos(u.x, .1, u.y, 1);
        draw(gl, 1, GL_POINTS);
    }
});
