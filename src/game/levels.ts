import { setForts } from "./objects/fort";
import { setPaths } from "./objects/path";

export const loadLevel = () => {
    setForts([{x: 0, y: 0, color: 0 }]);
    setPaths([{x: 3, y: 0, size: 2, angle: 0 }]);
};
