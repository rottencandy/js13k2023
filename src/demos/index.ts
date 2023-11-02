import { setupKeyListener } from "../components/input";
import { bindVAO, buffer, clear, createGLContext, makeShader, mesh, resize, setBufferData, setTextureFilter, setTextureImage, setTextureWrap, setVAOPtr, shader, texture, useProgram } from "../core/webgl2-stateless";
import { startLoop } from "../core/loop";
import { clear2d, create2dContext, makeCanvasTexture, resize2d } from "../core/canvas";
import { clamp } from "../core/math";
import { CameraOrtho } from "../core/cam";
import { Cube, Plane, planeTexCoords } from "../vertices";

const vertSh = makeShader`
    layout(location=0)in vec4 aPos;
    layout(location=1)in vec4 aNorm;
    uniform mat4 uMat;
    uniform vec4 uPos;
    out vec4 vNorm;

    void main() {
        gl_Position = uMat * (uPos + aPos);
        vNorm = aNorm;
    }`;

const fragStatic = makeShader`
    in vec4 vNorm;
    uniform vec3 uColor;
    out vec4 outColor;

    void main() {
        outColor = vec4(uColor * abs(vNorm.xyz), 1.);
    }`;

const vertTex = makeShader`
    layout(location=0)in vec4 aPos;
    layout(location=1)in vec2 aTex;
    uniform mat4 uMat;
    uniform vec4 uPos;
    out vec2 vTex;

    void main() {
        gl_Position = uMat * (uPos + aPos);
        vTex = aTex;
    }`;

const fragTex = makeShader`
    in vec2 vTex;
    uniform sampler2D uTex;
    out vec4 outColor;

    void main() {
        outColor = texture(uTex, vTex);
    }`;

export const runDemo = () => {
    const canv2d = document.getElementById('f') as HTMLCanvasElement;
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const width = 400, height = 300;
    setupKeyListener(canvas, false);

    const ctx = create2dContext(canv2d, width, height);
    const gl = createGLContext(canvas, width, height);

    onresize = () => {
        // todo this is repeated
        resize2d(canv2d, width, height);
        resize(gl, canvas, width, height);
    };

    // 2d stuff
    const text = { x: 100, y: 100 };
    let xSpd = .05;
    let ySpd = .05;

    // 3d stuff
    const cam = CameraOrtho(-width/8, width/8, -height/8, height/8, 1, 100)
        .moveTo(0, 2.5, 10);
    const [cubePrg, cubeUni] = shader(gl, vertSh, fragStatic);
    const [cubeVao, drawCube] = mesh(
        gl,
        Cube(5),
        [
            // aPos
            [0, 3, 24],
            // aNorm
            [1, 3, 24, 12],
        ]
    );

    const [planePrg, planeUni] = shader(gl, vertTex, fragTex);
    const [planeVao, drawPlane] = mesh(
        gl,
        Plane(5),
        [[0, 2]],
    );
    // aTex
    setBufferData(gl, buffer(gl), planeTexCoords);
    setVAOPtr(gl, planeVao, 1, 2);
    const img = makeCanvasTexture(2, 2);
    const tex = texture(gl);
    setTextureImage(gl, tex, img);
    setTextureFilter(gl);
    setTextureWrap(gl);

    startLoop(
        (dt) => {
            // 50 is to accomodate for text width/height
            if (text.x <= 0 || text.x + 50 >= width) {
                xSpd *= -1;
                text.x = clamp(text.x, 0, width)
            }
            if (text.y - 20 <= 0 || text.y >= height) {
                ySpd *= -1;
                text.y = clamp(text.y, 0, height)
            }
            text.x += dt * xSpd;
            text.y += dt * ySpd;

            cam.move(
                .0001,
                0,
                0,
            );
            // look at center of obj
            cam.lookAt(2.5, 0, 2.5);
        },
        () => {
            clear2d(ctx, width, height);
            ctx.font = '18px sans-serif';
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.fillText('HELLO', text.x, text.y);

            cam.recalculate();
            clear(gl);
            bindVAO(gl, cubeVao);
            useProgram(gl, cubePrg);
            cubeUni('uMat').m4fv(cam.matrix);
            cubeUni('uPos').u4f(0, 0, 0, 0);
            cubeUni('uColor').u3f(1, 1, 1);
            drawCube();

            bindVAO(gl, planeVao);
            useProgram(gl, planePrg);
            planeUni('uMat').m4fv(cam.matrix);
            planeUni('uPos').u4f(10, 0, 0, 0);
            planeUni('uColor').u3f(1, 0, 1);
            drawPlane();
        },
    );
};
