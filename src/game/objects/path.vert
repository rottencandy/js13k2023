#version 300 es
precision mediump float;

layout(location=0)in vec4 aPos;

uniform mat4 uMat;
uniform vec4 uPos;

void main() {
    gl_Position = uMat * (uPos + aPos);
}
