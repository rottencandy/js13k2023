#version 300 es
precision mediump float;

layout(location=0)in vec4 aPos;

uniform float uSize;
uniform mat4 uMat;
uniform vec4 uPos;

void main() {
    // scale x axis
    vec4 atrPos = aPos * vec4(uSize, 1., 1., 1.);
    gl_Position = uMat * (uPos + atrPos);
}
