import { bindVAO, mesh, shaderProgram, uniformFns, useProgram } from "../../core/webgl2-stateless";
import { CompInit, CompRender } from "../components";
import { Fort } from "./vertices";
import vertex from './fort.vert';
import frag from './fort.frag';

let prg: WebGLProgram, vao: WebGLVertexArrayObject, draw: () => void, uniform: any;

export const enum FortColor {
    Gray,
};

type Fort = {
    x: number;
    y: number;
    color: FortColor;
};

let forts: Fort[] = [];

export const setForts = (f: Fort[]) => {
    forts = f;
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
    uniform = uniformFns(gl, prg);
});

CompRender.push((gl, mat, eye) => {
    bindVAO(gl, vao);
    useProgram(gl, prg);

    uniform('uMat').m4fv(mat);
    uniform('uLightPos').u3f(1, 5, 1);
    uniform('uCam').u3f(eye[0], eye[1], eye[2]);

    for (let i = 0; i < forts.length; i++) {
        let f = forts[i];
        uniform('uPos').u4f(f.x, f.y, 0, 0);
        uniform('uColor').u3f(.3, .4, .5);
        draw();
    }
});
