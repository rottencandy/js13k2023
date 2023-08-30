import { CameraOrtho } from "../core/cam";
import { createLoop } from "../core/loop";
import { clear, createGLContext, resize } from "../core/webgl2-stateless";
import { CompInit, CompPhysics, CompRender } from "./components";
import { loadLevel } from "./levels";
import { HUD, levels, pauseScreen, titleScreen, uiBase } from "./screens";
import './init';
import { getFrameKeys, setupKeyListener } from "../components/input";
import { clear2d, create2dContext, resize2d } from "../core/canvas";

export const WIDTH = 400, HEIGHT = 300;
const S = 40;
const canvas = document.getElementById('b') as HTMLCanvasElement;
const canv2d = document.getElementById('f') as HTMLCanvasElement;
const gl = createGLContext(canvas, WIDTH, HEIGHT);
const ctx = create2dContext(canv2d, WIDTH, HEIGHT);
setupKeyListener(canvas, WIDTH, HEIGHT);
onresize = () => {
    // todo: this is repeated
    resize(gl, canvas, WIDTH, HEIGHT);
    resize2d(canv2d, WIDTH, HEIGHT);
};

const cam = CameraOrtho(-WIDTH / S, WIDTH / S, -HEIGHT / S, HEIGHT / S, 1, 100)
    .moveTo(0, 10, .1)
    .lookAt(0, 0, 0);

const [startLoop, stopLoop] = createLoop(
    (dt) => {
        const keys = getFrameKeys();
        for (let i = 0; i < CompPhysics.length; i++) {
            CompPhysics[i](dt, keys, cam);
        }
    },
    () => {
        cam.recalculate();
        clear(gl);
        clear2d(ctx, WIDTH, HEIGHT);

        //ctx.save();
        //ctx.translate(xPos, yPos);
        //ctx.restore();
        ctx.font = '8px sans-serif';
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';

        for (let i = 0; i < CompRender.length; i++) {
            CompRender[i](gl, cam.matrix, cam.eye, ctx);
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
        loadLevel(1);
        resumeGame();
    }));
};

export const showMainScreen = () => {
    uiBase.replaceChildren(...titleScreen(showLevelsScreen));
};
