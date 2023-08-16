/**
* Global UI state
*/

import { loadLevel } from "./levels";
import { HUD, levels, pauseScreen, titleScreen, uiBase } from "./screens";

export const showLevelsScreen = () => {
    uiBase.replaceChildren(...levels(() => {
        loadLevel();
        resumeGame();
    }));
};

export const showMainScreen = () => {
    uiBase.replaceChildren(...titleScreen(showLevelsScreen));
};

export const pauseGame = () => {
    uiBase.replaceChildren(...pauseScreen(resumeGame, showLevelsScreen));
};

export const resumeGame = () => {
    uiBase.replaceChildren(...HUD(pauseGame));
};
