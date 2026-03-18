#version 300 es
precision mediump float;
precision highp int;

in vec2 a_position;
in vec2 a_uv;

uniform highp float uTime;
uniform float uMorphAmount;
uniform vec2 uMouse;
uniform float uHoverIntensity;

out vec2 vUv;
out vec2 vPosition;
out float vMorphOffset;

vec2 computeMorphDisplacement(vec2 pos, float time, float amount) {
    float wave1 = sin(pos.x * 3.0 + time * 0.5) * 0.03;
    float wave2 = cos(pos.y * 2.5 + time * 0.4) * 0.025;
    float wave3 = sin((pos.x + pos.y) * 2.0 + time * 0.6) * 0.02;
    return vec2(wave1 + wave3, wave2 + wave3) * amount;
}

vec2 computeMouseDisplacement(vec2 pos, vec2 mousePos, float intensity) {
    vec2 mouseNDC = mousePos * 2.0 - 1.0;
    vec2 toMouse = mouseNDC - pos;
    float dist = length(toMouse);
    float influence = smoothstep(0.8, 0.0, dist);
    return toMouse * influence * intensity * 0.05;
}

void main() {
    vUv = a_uv;
    vec2 morphOffset = computeMorphDisplacement(a_position, uTime, uMorphAmount);
    vec2 mouseOffset = computeMouseDisplacement(a_position, uMouse, uHoverIntensity);
    vec2 totalOffset = morphOffset + mouseOffset;
    vec2 morphedPosition = a_position + totalOffset;
    vPosition = morphedPosition;
    vMorphOffset = length(totalOffset);
    gl_Position = vec4(morphedPosition, 0.0, 1.0);
}
