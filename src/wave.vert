uniform float time;
void main(){
    vec4 pos = vec4(position,1.0);
    pos.z = 2.0*sin(pos.x+time * 0.001);
    gl_Position = projectionMatrix * modelViewMatrix * pos;
}