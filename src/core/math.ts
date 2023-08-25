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
    Math.hypot(x2 - x1, y2 - y1)

export const v2angle = (x1: number, y1: number, x2: number, y2: number) =>
    Math.atan2((y2 - y1), (x2 - x1))
