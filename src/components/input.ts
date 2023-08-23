export type WatchedKeys = {
    esc: boolean,
    clicked: boolean,
    justClicked: boolean,
    ptrX: number,
    ptrY: number,
};

const Keys: WatchedKeys = {
    esc: false,
    clicked: false,
    justClicked: false,
    ptrX: 0,
    ptrY: 0,
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

    canvas.onpointerdown = () => (Keys.clicked = justClicked = true);
    canvas.onpointerup = () => Keys.clicked = false;
    canvas.onpointermove = e => {
        Keys.ptrX = e.offsetX / canvas.clientWidth;
        Keys.ptrY = e.offsetY / canvas.clientHeight;
    };

    canvas.ontouchstart = canvas.ontouchmove = canvas.ontouchend = canvas.ontouchcancel = e => {
        e.preventDefault();
        Keys.clicked = justClicked = e.touches.length > 0;
        if (Keys.clicked) {
            const offset = canvas.getBoundingClientRect();
            Keys.ptrX = (e.touches[0].clientX - offset.left) / canvas.clientWidth;
            // offset.top is not needed since canvas is always stuck to top
            Keys.ptrY = e.touches[0].clientY / canvas.clientHeight;
        }
    };
};

export const getFrameKeys = () => {
    if (justClicked) {
        justClicked = false;
        Keys.justClicked = true;
    } else {
        Keys.justClicked = false;
    }

    return Keys;
};
