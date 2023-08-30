import mat4 from "gl-matrix/mat4";
import vec2 from "gl-matrix/vec2";

export const FLOOR = (x: number) => ~~x;

export const radians = (a: number) => a * Math.PI / 180;

export const rand = (a = 0, b = 1) => b + (a - b) * Math.random();

export const clamp = (value: number, min: number, max: number) => {
    return value < min ? min : value > max ? max : value;
};

// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
export const AABB = (
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number,
) => (
    x1 < x2 + w2 &&
    x1 + w1 > x2 &&
    y1 < y2 + h2 &&
    y1 + h1 > y2
);

export const v2dist = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

export const circleCollision = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    r: number,
) => v2dist(x1, y1, x2, y2) - r > 0;

export const v2angle = (x1: number, y1: number, x2: number, y2: number) =>
    Math.atan2((y2 - y1), (x2 - x1));

/**
* Adapted from gl-matrix/vec3/transformMat4 to always assume y as 0
*/
export const transformMat4 = (out: vec2, x: number, z: number, m: mat4) => {
    out[0] = m[0] * x + m[8] * z + m[12];
    out[1] = m[1] * x + m[9] * z + m[13];
    return out;
};
