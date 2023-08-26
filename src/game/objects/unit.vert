#version 300 es
precision mediump float;

uniform mat4 uMat;
uniform vec4 uPos;

void main() {
    gl_PointSize = 5.;
    gl_Position = uMat * uPos;
}
