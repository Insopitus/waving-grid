precision highp float;
uniform vec3 color;
varying float depth;
uniform vec3 fogColor;
uniform float fogDensity;
uniform float time;
#define LOG2 1.442695
void main() {
    float fogAmount = 1. - exp2(-fogDensity * fogDensity * depth * depth * LOG2);
    fogAmount = clamp(fogAmount, 0., 1.);
    // a bright line that sweeps through
    vec3 c = vec3(0.5) * smoothstep(0.99, 1.0, sin(time * 2.0 + depth * 0.2));
    gl_FragColor = vec4(mix(color + c, fogColor, fogAmount), 1.0);
}