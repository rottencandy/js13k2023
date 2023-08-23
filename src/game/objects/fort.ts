import { bindVAO, mesh, shaderProgram, uniformFns, useProgram } from "../../core/webgl2-stateless";
import { CompInit, CompRender } from "../components";
import { Fort } from "./vertices";
import vertex from './fort.vert';
import frag from './fort.frag';

let prg: WebGLProgram, vao: WebGLVertexArrayObject, draw: () => void, uniform: any;

let forts = [];

export const setForts = () => {
};

CompInit.push((gl) => {
    prg = shaderProgram(gl, vertex, frag);
    [ vao, draw ] = mesh(
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

    uniform('uPos').u4f(0, 0, 0, 0);
    uniform('uMat').m4fv(mat);
    uniform('uCam').u3f(eye[0], eye[1], eye[2]);
    uniform('uLightPos').u3f(1, 5, 1);
    uniform('uColor').u3f(.3, .4, .5);
    draw();
});
