import { create as v2new } from 'gl-matrix/vec2';
import { bindVAO, mesh, shaderProgram, uniformFns, useProgram } from "../../core/webgl2-stateless";
import { CompInit, CompPhysics, CompRender } from "../components";
import { Fort } from "./vertices";
import vertex from './fort.vert';
import frag from './fort.frag';
import { HEIGHT, WIDTH } from '../state';
import { circleCollision, transformMat4 } from '../../core/math';

let prg: WebGLProgram, vao: WebGLVertexArrayObject, draw: () => void;
let uMat: any, uLightPos: any, uCam: any, uPos: any, uColor: any;

export const enum FortColor {
    Player,
    Red,
};

export const fortColors = {
    [FortColor.Player]: { r: .3, g: .4, b: .5 },
    [FortColor.Red]: { r: .6, g: .3, b: .2 },
};

export type Fort = {
    x: number;
    y: number;

    // x, y in screen co-ords
    sx: number;
    sy: number;

    col: FortColor;

    /** units */
    u: number;
};

let forts: Fort[] = [];

export const setForts = (f: Omit<Fort, 'sx' | 'sy'>[]) => {
    forts = f.map(x => ({ ...x, sx: 0, sy: 0 }));
};

export const handleUnitPathEnd = (f: number, col: FortColor) => {
    if (forts[f].col === col) {
        forts[f].u++;
    } else {
        forts[f].u--;
        if (forts[f].u < 0) {
            forts[f].col = col;
        }
    }
};

CompInit.push((gl) => {
    prg = shaderProgram(gl, vertex, frag);
    [vao, draw] = mesh(
        gl,
        Fort,
        [
            // aPos
            [0, 3, 24],
            // aNorm
            [1, 3, 24, 12],
        ]
    );
    const uniform = uniformFns(gl, prg);
    uMat = uniform('uMat').m4fv;
    uLightPos = uniform('uLightPos').u3f;
    uCam = uniform('uCam').u3f;
    uPos = uniform('uPos').u4f;
    uColor = uniform('uColor').u3f;
});

const trVec = v2new();
CompRender.push((gl, mat, eye, ctx) => {
    bindVAO(gl, vao);
    useProgram(gl, prg);

    uMat(mat);
    uLightPos(1, 5, 1);
    uCam(eye[0], eye[1], eye[2]);

    for (let i = 0; i < forts.length; i++) {
        const f = forts[i];
        uPos(f.x, 0, f.y, 0);
        const col = fortColors[f.col];
        uColor(col.r, col.g, col.b);
        draw();

        // todo this needs to happen in update component
        // but cam mat is only available here for now
        // and I don't want to increase computations for
        // now by calculating it there
        transformMat4(trVec, f.x, f.y, mat);
        f.sx = (trVec[0] * .5 + .5) * WIDTH;
        f.sy = (trVec[1] * -.5 + .5) * HEIGHT;

        ctx.fillText(f.u as unknown as string, f.sx, f.sy);
    }
});
