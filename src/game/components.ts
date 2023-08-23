import { mat4, vec3 } from "gl-matrix";
import { GL } from "../core/webgl2-stateless";

export const CompPhysics: ((dt: number) => void)[] = [];

export const CompInit: ((gl: GL) => void)[] = [];

export const CompRender: ((gl: GL, mat: mat4, eye: vec3) => void)[] = [];
