import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loading Textures
const textureLoader = new THREE.TextureLoader()

const normalTexture = textureLoader.load('/textures/NormalMap.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(.5, 64, 64)

// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.normalMap = normalTexture

material.color = new THREE.Color(0x292929)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

// PointLight2
const light1 = gui.addFolder('light1')

const pointLight2 = new THREE.PointLight(0xff0000, 2)
pointLight2.position.set(1,1,1)
pointLight2.intensity = 2
scene.add(pointLight2)

light1.add(pointLight2.position, 'x').min(-6).max(6).step(.5)
light1.add(pointLight2.position, 'y').min(-3).max(3).step(.5)
light1.add(pointLight2.position, 'z').min(-3).max(3).step(.5)
light1.add(pointLight2, 'intensity').min(0).max(10).step(.1)

const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1)
scene.add(pointLightHelper)

// PointLight3
const light2 = gui.addFolder('light2')

const pointLight3 = new THREE.PointLight(0x0000ff, 2)
pointLight3.position.set(1,1,1)
pointLight3.intensity = 2
scene.add(pointLight3)

light2.add(pointLight3.position, 'x').min(-6).max(6).step(.5)
light2.add(pointLight3.position, 'y').min(-3).max(3).step(.5)
light2.add(pointLight3.position, 'z').min(-3).max(3).step(.5)
light2.add(pointLight3, 'intensity').min(0).max(10).step(.1)

const light2color = {
    color: 0xff0000
}

light2.addColor(light2color, 'color').onChange(()=>pointLight3.color.set(light2color.color))

const pointLightHelper2 = new THREE.PointLightHelper(pointLight3, 1)
scene.add(pointLightHelper2)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowX = window.innerWidth / 2
const windowY = window.innerHeight / 2

const onDocumentMouseMove = (event) => {
    mouseX = (event.clientX - windowX)
    mouseY = (event.clientY - windowY)
}

document.addEventListener('mousemove', onDocumentMouseMove)

const updateSphere = (event) => {
    sphere.position.y = window.scrollY * .001
}

document.addEventListener('scroll', updateSphere)

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .5 * (targetY - sphere.rotation.x)
    sphere.position.z += -.05 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()