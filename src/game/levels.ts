import { Fort, FortColor, setForts } from "./objects/fort";
import { setPaths } from "./objects/path";
import { clearUnits } from "./objects/unit";

const LEVELS: [
    forts: Fort[],
    paths: { frm: number, to: number }[]
][] = [
        // 1
        [[
            { x: 0, y: 0, col: FortColor.Player, u: 5 },
            { x: 4, y: 4, col: FortColor.Red, u: 1 }
        ], [{ frm: 0, to: 1 }]]
    ];

export const loadLevel = (l: number) => {
    const [forts, paths] = LEVELS[l - 1];
    clearUnits();
    setForts(forts);
    setPaths(paths, forts);
};
