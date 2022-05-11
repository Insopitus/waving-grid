precision mediump float ;
uniform vec3 color;
varying float depth;
uniform vec3 fogColor;
uniform float fogDensity;
#define LOG2 1.442695
void main(){
    float fogAmount = 1. - exp2(-fogDensity * fogDensity * depth * depth * LOG2);
    fogAmount = clamp(fogAmount, 0., 1.);
    gl_FragColor = vec4(mix(color,fogColor,fogAmount),1.0);
}