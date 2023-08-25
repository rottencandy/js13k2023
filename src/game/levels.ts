import { Fort, setForts } from "./objects/fort";
import { setPaths } from "./objects/path";

const LEVELS: [
    forts: Fort[],
    paths: { frm: number, to: number }[]
][] = [
        // 1
        [[{ x: 0, y: 0, col: 0 }, { x: 4, y: 4, col: 0 }], [{ frm: 0, to: 1 }]]
    ];

export const loadLevel = (l: number) => {
    const [forts, paths] = LEVELS[l - 1];
    setForts(forts);
    setPaths(paths, forts);
};
