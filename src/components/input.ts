export type WatchedKeys = {
    esc: boolean,
    clk: boolean,
    justClk: boolean,
    X: number,
    Y: number,
};

const Keys: WatchedKeys = {
    esc: false,
    clk: false,
    justClk: false,
    X: 0,
    Y: 0,
};

let justClicked = false;

/**
 * Initialize onkey listeners
*/
export const setupKeyListener = (canvas: HTMLCanvasElement) => {
    const setKeyState = (value: boolean) => ({ key }: { key: string }) => {
        switch (key) {
            case 'Escape':
                Keys.esc = value;
                break;
        }
    }

    window.onkeydown = setKeyState(true);
    window.onkeyup = setKeyState(false);

    canvas.onpointerdown = () => (Keys.clk = justClicked = true);
    canvas.onpointerup = () => Keys.clk = false;
    canvas.onpointermove = e => {
        Keys.X = e.offsetX / canvas.clientWidth;
        Keys.Y = e.offsetY / canvas.clientHeight;
    };

    canvas.ontouchstart = canvas.ontouchmove = canvas.ontouchend = canvas.ontouchcancel = e => {
        e.preventDefault();
        Keys.clk = justClicked = e.touches.length > 0;
        if (Keys.clk) {
            const offset = canvas.getBoundingClientRect();
            Keys.X = (e.touches[0].clientX - offset.left) / canvas.clientWidth;
            // offset.top is not needed this time since canvas is always stuck to top
            Keys.Y = e.touches[0].clientY / canvas.clientHeight;
        }
    };
};

export const getFrameKeys = () => {
    if (justClicked) {
        justClicked = false;
        Keys.justClk = true;
    } else {
        Keys.justClk = false;
    }

    return Keys;
};
