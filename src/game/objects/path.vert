#version 300 es
precision mediump float;

layout(location=0)in vec4 aPos;

uniform float uLen, uRot;
uniform mat4 uMat;
uniform vec4 uPos;

void main() {
    // scale x axis
    vec4 atr = aPos * vec4(1., 1., uLen, 1.);

    // rotate along Y axis
    vec4 atrPos = vec4(
        atr.z * sin(uRot) + atr.x * cos(uRot),
        atr.y,
        atr.z * cos(uRot) - atr.x * sin(uRot),
        1.
    );

    gl_Position = uMat * (uPos + atrPos);
}
