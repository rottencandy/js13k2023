import { bindVAO, mesh, shaderProgram, uniformFns, useProgram } from "../../core/webgl2-stateless";
import { CompInit, CompRender } from "../components";
import vertex from './path.vert';
import frag from './path.frag';
import { Plane } from "./vertices";
import { Fort } from "./fort";
import { v2angle, v2dist } from "../../core/math";

let prg: WebGLProgram, vao: WebGLVertexArrayObject, draw: () => void, uniform: any;

export type Path = {
    x: number;
    y: number;
    len: number;
    rot: number;
}

let paths: Path[] = [];

export const setPaths = (p: { frm: number, to: number }[], forts: Fort[]) => {
    paths = [];
    for (let i = 0; i < p.length; i++) {
        const { frm, to } = p[i];
        const v1 = forts[frm];
        const v2 = forts[to];
        const len = v2dist(v1.x, v1.y, v2.x, v2.y);
        const rot = v2angle(v1.x, v1.y, v2.x, v2.y);
        paths.push({ x: v1.x, y: v1.y, len, rot });
    }
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
        uniform('uLen').u1f(p.len);
        uniform('uRot').u1f(p.rot);
        draw();
    }
});
