import { BufferAttribute, BufferGeometry, Color, FogExp2, Line, LineBasicMaterial, LineSegments, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer } from 'three/src/Three'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'

// import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
// import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
// import { ShaderMaterial } from 'three/src/materials/ShaderMaterial'
// import { Color } from 'three/src/math/Color'
// import { Mesh } from 'three/src/objects/Mesh'
// import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
// import { FogExp2 } from 'three/src/scenes/FogExp2'
// import { Scene } from 'three/src/scenes/Scene'
import fsSource from '/src/shaders/wave.frag?raw'
import vsSource from '/src/shaders/wave.vert?raw'
const BACKGROUND_COLOR = 0x0
const scene = new Scene()
scene.fog = new FogExp2(BACKGROUND_COLOR,.06)
const renderer = new WebGLRenderer({ antialias: true })
const dom: HTMLElement = document.querySelector('#container')
dom.appendChild(renderer.domElement)
// const ambientLight = new AmbientLight(0x333333)
// const directionalLight = new DirectionalLight(0xffffff)
// directionalLight.position.set(2, 2, 3)
// directionalLight.target.position.set(0, 0, 0)
const width = Math.floor(dom.clientWidth)
const height = Math.floor(dom.clientHeight)
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio)
const camera = new PerspectiveCamera(45, width / height, 1, 10000)
camera.position.set(5, 3, 5)
camera.lookAt(0, 0, 0)
const controls = new MapControls(camera, renderer.domElement)

// const axes = new AxesHelper(10000)
// scene.add(ambientLight, directionalLight,)
renderer.render(scene, camera)




const beginTime = Date.now()
const uniforms = {
    time:{
        value:beginTime
    },
    color:{
        value:new Color('dodgerblue')
    },
    fogColor:{
        value:new Color(BACKGROUND_COLOR)
    },
    fogDensity:{
        value:.3
    },
}
const SEGMENTS = 100
const SIZE = 100
// const geometry = new PlaneGeometry(100,100,100,100)
const geometry = generateGridGeometry(SIZE,SIZE,SEGMENTS,SEGMENTS)
geometry.translate(-SIZE/2,-SIZE/2,0)

const material = new ShaderMaterial({fragmentShader:fsSource,vertexShader:vsSource,uniforms,fog:true})
// const material = new LineBasicMaterial({color:'red'})
const mesh = new LineSegments(geometry,material)
mesh.rotateX(-Math.PI/2)
scene.add(mesh)




function animate(deltaTime:number) {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    // controls.update()
    material.uniforms.time.value = Date.now() - beginTime
    // material.uniforms.color.value = new Color(Math.random(),Math.random(),Math.random())
    // material.needsUpdate = true
    // console.log(material.uniforms.time.value)
   
}

requestAnimationFrame(animate)




function generateGridGeometry(width:number,height:number,widthSegment:number,heightSegment:number){
    const tile_width = width / widthSegment
    const tile_height = height / heightSegment
    const vertices_count = (widthSegment+1)*(heightSegment+1)*3
    const vertices = new Float32Array(vertices_count)
    let indices : Uint16Array | Uint32Array
    let line_segments = widthSegment*(heightSegment+1) + heightSegment*(widthSegment+1)
    if(vertices_count>0xffff){
        indices = new Uint32Array(line_segments*2)
    }else{
        indices = new Uint16Array(line_segments*2)
    }
    // vertices
    for (let i=0;i<=widthSegment;i++){
        for(let j=0;j<=heightSegment;j++){
            vertices[i*(heightSegment+1)*3+j*3] = i*tile_width
            vertices[i*(heightSegment+1)*3+j*3+1] = j*tile_height
            vertices[i*(heightSegment+1)*3+j*3+2] = 0
        }
    }
    //indices
    for (let i=0;i<widthSegment;i++){
        for(let j=0;j<heightSegment;j++){
            indices[(i*heightSegment+j)*4] = i*(heightSegment+1)+j
            indices[(i*heightSegment+j)*4+1] = i*(heightSegment+1)+j+1
            indices[(i*heightSegment+j)*4+2] = i*(heightSegment+1)+j
            indices[(i*heightSegment+j)*4+3] = (i+1)*(heightSegment+1)+j
            // console.log(`i:${i},j:${j}; index:${indices.slice((i*heightSegment+j)*4,(i*heightSegment+j)*4+4)}`)
        }
    }
    for (let i=0;i<widthSegment;i++){

    }
    for(let i=0;i<heightSegment;i++){

    }
    indices[4] = 1
    indices[5] = 3
    indices[6] = 2
    indices[7] = 3
    const geometry = new BufferGeometry()
    geometry.setAttribute('position',new BufferAttribute(vertices,3))
    geometry.setIndex(new BufferAttribute(indices,1))
    console.log(vertices,indices)
    return geometry
}




export { scene, camera, renderer }



// const boxGeometry = new BoxBufferGeometry(10,10,10)
// const boxMaterial = new MeshBasicMaterial({color:'dodgerblue',wireframe:true})
// const box = new Mesh(boxGeometry,boxMaterial)
// scene.add(box)