import { CameraOrtho } from "../core/cam";
import { createLoop } from "../core/loop";
import { clear, createGLContext, resize } from "../core/webgl2-stateless";
import { CompInit, CompPhysics, CompRender } from "./components";
import { loadLevel } from "./levels";
import { HUD, levels, pauseScreen, titleScreen, uiBase } from "./screens";
import './init';

const WIDTH = 400, HEIGHT = 300, S = 40 // scale;
const canvas = document.getElementById('b') as HTMLCanvasElement;
//const canv2d = document.getElementById('f') as HTMLCanvasElement;
//const ctx = create2dContext(canv2d, width, height);
//setupKeyListener(canvas);
const gl = createGLContext(canvas, WIDTH, HEIGHT);
onresize = () => {
    // todo: this is repeated
    resize(gl, canvas, WIDTH, HEIGHT);
    //resize2d(canv2d, width, height);
};

const cam = CameraOrtho(-WIDTH / S, WIDTH / S, -HEIGHT / S, HEIGHT / S, 1, 100)
    .moveTo(0, 10, .1)
    .lookAt(0, 0, 0);

const [startLoop, stopLoop] = createLoop(
    (dt) => {
        for (let i = 0; i < CompPhysics.length; i++) {
            CompPhysics[i](dt);
        }
    },
    () => {
        cam.recalculate();
        clear(gl);
        for (let i = 0; i < CompRender.length; i++) {
            CompRender[i](gl, cam.matrix, cam.eye);
        }
    },
);

for (let i = 0; i < CompInit.length; i++) {
    CompInit[i](gl);
}

const pauseGame = () => {
    uiBase.replaceChildren(...pauseScreen(resumeGame, showLevelsScreen));
    stopLoop();
};

const resumeGame = () => {
    uiBase.replaceChildren(...HUD(pauseGame));
    startLoop();
};

const showLevelsScreen = () => {
    uiBase.replaceChildren(...levels(() => {
        loadLevel();
        resumeGame();
    }));
};

export const showMainScreen = () => {
    uiBase.replaceChildren(...titleScreen(showLevelsScreen));
};
