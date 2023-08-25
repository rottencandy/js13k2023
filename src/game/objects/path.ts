import { bindVAO, mesh, shaderProgram, uniformFns, useProgram } from "../../core/webgl2-stateless";
import { CompInit, CompRender } from "../components";
import vertex from './path.vert';
import frag from './path.frag';
import { Plane } from "./vertices";

let prg: WebGLProgram, vao: WebGLVertexArrayObject, draw: () => void, uniform: any;

type Path = {
    x: number;
    y: number;
    size: number;
    angle: number;
}

let paths: Path[] = [];

export const setPaths = (p: Path[]) => {
    paths = p;
};

CompInit.push((gl) => {
    prg = shaderProgram(gl, vertex, frag);
    [vao, draw] = mesh(
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

    uniform('uMat').m4fv(mat);
    uniform('uColor').u3f(.5, .4, .4);

    for (let i = 0; i < paths.length; i++) {
        let p = paths[i];
        uniform('uPos').u4f(p.x, p.y, 0, 0);
        uniform('uSize').u1f(p.size);
        draw();
    }
});
