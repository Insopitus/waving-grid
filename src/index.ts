import { AmbientLight, AxesHelper, DirectionalLight, Mesh, MeshLambertMaterial, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer } from 'three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import fsSource from '/src/wave.frag?raw'
import vsSource from '/src/wave.vert?raw'
const scene = new Scene()
const renderer = new WebGLRenderer({ antialias: true })
const dom: HTMLElement = document.querySelector('#container')
dom.appendChild(renderer.domElement)
const ambientLight = new AmbientLight(0x333333)
const directionalLight = new DirectionalLight(0xffffff)
directionalLight.position.set(2, 2, 3)
directionalLight.target.position.set(0, 0, 0)
const width = Math.floor(dom.clientWidth)
const height = Math.floor(dom.clientHeight)
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio)
const camera = new PerspectiveCamera(45, width / height, 1, 10000)
camera.position.set(5, 3, 5)
camera.lookAt(0, 0, 0)
const controls = new MapControls(camera, renderer.domElement)

const axes = new AxesHelper(10000)
scene.add(ambientLight, directionalLight, axes)
renderer.render(scene, camera)



const geometry = new PlaneGeometry(100,100,100,100)
const uniforms = {
    time:{
        value:Date.now()
    }
}
const material = new ShaderMaterial({fragmentShader:fsSource,vertexShader:vsSource,wireframe:true,uniforms})
const mesh = new Mesh(geometry,material)
mesh.rotateX(-Math.PI/2)
scene.add(mesh)




function animate(deltaTime:number) {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    controls.update()
    material.uniforms.time.value = Date.now()
    material.needsUpdate = true
   
}

requestAnimationFrame(animate)









export { scene, camera, controls, renderer }



// const boxGeometry = new BoxBufferGeometry(10,10,10)
// const boxMaterial = new MeshBasicMaterial({color:'dodgerblue',wireframe:true})
// const box = new Mesh(boxGeometry,boxMaterial)
// scene.add(box)