#version 300 es
precision mediump float;

layout(location=0)in vec4 aPos;
layout(location=1)in vec4 aNorm;

uniform mat4 uMat;
uniform vec4 uPos;

out vec3 vNormal, vFragPos;

void main() {
    gl_Position = uMat * (uPos + aPos);
    vFragPos = aPos.xyz;
    vNormal = aNorm.xyz;
}
