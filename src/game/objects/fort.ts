import { create as v2new } from 'gl-matrix/vec2';
import { bindVAO, mesh, shaderProgram, uniformFns, useProgram } from "../../core/webgl2-stateless";
import { CompInit, CompRender } from "../components";
import { Fort } from "./vertices";
import vertex from './fort.vert';
import frag from './fort.frag';
import { HEIGHT, WIDTH } from '../state';
import { transformMat4 } from '../../core/math';

let prg: WebGLProgram, vao: WebGLVertexArrayObject, draw: () => void;
let uMat: any, uLightPos: any, uCam: any, uPos: any, uColor: any;

export const enum FortColor {
    Gray,
};

export type Fort = {
    x: number;
    y: number;
    col: FortColor;
    u: number;
};

let forts: Fort[] = [];

export const setForts = (f: Fort[]) => {
    forts = f;
};

export const handleUnitPathEnd = (f: number, uCol: FortColor) => {
    // todo resolve unit intent & fort status
    forts[f].u++;
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

    //ctx.save();
    //ctx.translate(xPos, yPos);
    //ctx.restore();
    ctx.font = '8px sans-serif';
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';

    for (let i = 0; i < forts.length; i++) {
        let f = forts[i];
        uPos(f.x, 0, f.y, 0);
        uColor(.3, .4, .5);
        draw();

        transformMat4(trVec, f.x, f.y, mat);
        const xPos = (trVec[0] * .5 + .5) * WIDTH;
        const yPos = (trVec[1] * -.5 + .5) * HEIGHT;
        ctx.fillText(`${f.u}`, xPos, yPos);
    }
});
