import { GL } from "../core/webgl2-stateless";

export const CompPhysics: ((dt: number) => void)[] = [];

export const CompInit: ((gl: GL) => void)[] = [];

export const CompRender: ((gl: GL) => void)[] = [];
