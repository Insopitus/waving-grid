import { Renderer, Camera, Transform, Orbit, Program, Mesh, Geometry, OGLRenderingContext, Color, Vec3 } from 'ogl'
import fsSource from '/src/shaders/wave.frag?raw'
import vsSource from '/src/shaders/wave.vert?raw'
const renderer = new Renderer()
const gl = renderer.gl
document.body.appendChild(gl.canvas)

const camera = new Camera(gl)
camera.position.set(3, 1, 3)
camera.lookAt(new Vec3(0, 0, 0))

const controls = new Orbit(camera)

function resize() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	camera.perspective({
		aspect: gl.canvas.width / gl.canvas.height
	})
}
window.addEventListener('resize', resize, false)
resize()

const scene = new Transform()

const SEGMENTS = 100
const SIZE = 50
const geometry = generateGridGeometry(gl, SIZE, SIZE, SEGMENTS, SEGMENTS)

const program = new Program(gl, {
	vertex: vsSource,
	fragment: fsSource,
	uniforms: {
		color: { value: new Color(0x1e90ff) },
		time: { value: 0 },
		fogColor: { value: new Color(0) },
		fogDensity: { value: 0.05 }
	}
})
const startTime = Date.now()
const mesh = new Mesh(gl, { geometry, program, mode: gl.LINES })
// mesh.position.set(-SIZE / 2, -SIZE / 2, 0)
mesh.rotation.x = -Math.PI / 2
mesh.setParent(scene)

requestAnimationFrame(update)
function update(t) {
	requestAnimationFrame(update)

	// mesh.rotation.y -= 0.04
	// mesh.rotation.x += 0.03
	controls.update()
	program.uniforms.time.value = (Date.now() - startTime) / 1000
	renderer.render({ scene, camera })
}
function generateGridGeometry(gl: OGLRenderingContext, width: number, height: number, widthSegment: number, heightSegment: number) {
	const tile_width = width / widthSegment
	const tile_height = height / heightSegment
	const vertices_count = (widthSegment + 1) * (heightSegment + 1) * 3
	const vertices = new Float32Array(vertices_count)
	let indices: Uint16Array
	let line_segments = widthSegment * (heightSegment + 1) + heightSegment * (widthSegment + 1)
	// if (vertices_count > 0xffff) {
	// indices = new Uint32Array(line_segments * 2)
	// } else {
	indices = new Uint16Array(line_segments * 2)
	// }
	// vertices
	for (let i = 0; i <= widthSegment; i++) {
		for (let j = 0; j <= heightSegment; j++) {
			vertices[i * (heightSegment + 1) * 3 + j * 3] = i * tile_width - width / 2
			vertices[i * (heightSegment + 1) * 3 + j * 3 + 1] = j * tile_height - height / 2
			vertices[i * (heightSegment + 1) * 3 + j * 3 + 2] = 0
		}
	}
	//indices
	for (let i = 0; i < widthSegment; i++) {
		for (let j = 0; j < heightSegment; j++) {
			indices[(i * heightSegment + j) * 4] = i * (heightSegment + 1) + j
			indices[(i * heightSegment + j) * 4 + 1] = i * (heightSegment + 1) + j + 1
			indices[(i * heightSegment + j) * 4 + 2] = i * (heightSegment + 1) + j
			indices[(i * heightSegment + j) * 4 + 3] = (i + 1) * (heightSegment + 1) + j
			// console.log(`i:${i},j:${j}; index:${indices.slice((i*heightSegment+j)*4,(i*heightSegment+j)*4+4)}`)
		}
	}
	// for (let i = 0; i < widthSegment; i++) {}
	// for (let i = 0; i < heightSegment; i++) {}
	indices[4] = 1
	indices[5] = 3
	indices[6] = 2
	indices[7] = 3
	const geometry = new Geometry(gl, {
		position: { size: 3, data: vertices }
	})
	// @ts-expect-error
	geometry.setIndex({ size: 1, data: indices })
	return geometry
}
