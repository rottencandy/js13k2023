import { bindVAO, mesh, shaderProgram, uniformFns, useProgram } from "../../core/webgl2-stateless";
import { CompInit, CompRender } from "../components";
import vertex from './path.vert';
import frag from './path.frag';
import { Plane } from "./vertices";

let prg: WebGLProgram, vao: WebGLVertexArrayObject, draw: () => void, uniform: any;

CompInit.push((gl) => {
    prg = shaderProgram(gl, vertex, frag);
    [ vao, draw ] = mesh(
        gl,
        Plane,
        // aPos
        [[0, 3]]
    );
    uniform = uniformFns(gl, prg);
});

CompRender.push((gl, mat) => {
    bindVAO(gl, vao);
    useProgram(gl, prg);

    uniform('uPos').u4f(3, 0, 0, 0);
    uniform('uMat').m4fv(mat);
    uniform('uColor').u3f(.5, .4, .4);
    draw();
});
