precision mediump float ;
uniform vec3 color;
varying float depth;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
void main(){
    float fogAmout = smoothstep(fogNear,fogFar,depth);
    gl_FragColor = vec4(mix(color,fogColor,fogAmout),1.0);
}