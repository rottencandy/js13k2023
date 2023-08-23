import { mat4, vec3 } from "gl-matrix";
import { GL } from "../core/webgl2-stateless";
import { WatchedKeys } from "../components/input";
import { CamState } from "../core/cam";

export const CompPhysics: ((dt: number, k: WatchedKeys, cam: CamState) => void)[] = [];

export const CompInit: ((gl: GL) => void)[] = [];

export const CompRender: ((gl: GL, mat: mat4, eye: vec3) => void)[] = [];

export const CompDebug: (() => void)[] = [];
