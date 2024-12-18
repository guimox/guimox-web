import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js'
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js'

// Scene and Render Targets
let scene = new THREE.Scene()
let shadowGroup,
  renderTarget,
  renderTargetBlur,
  shadowCamera,
  cameraHelper,
  depthMaterial,
  horizontalBlurMaterial,
  verticalBlurMaterial
let plane, blurPlane, fillPlane

// Constants
const PLANE_WIDTH = 0.5
const PLANE_HEIGHT = 0.5
const CAMERA_HEIGHT = 0.3

// State Configuration
const state = {
  shadow: {
    blur: 9,
    darkness: 0.4,
    opacity: 1,
    color: '#C0D6E4',
  },
  plane: {
    opacity: 0,
  },
  showWireframe: false,
}

// Shadow Group Setup
shadowGroup = new THREE.Group()
shadowGroup.position.y = -0.12
scene.add(shadowGroup)

// Render Targets
renderTarget = new THREE.WebGLRenderTarget(512, 512)
renderTarget.texture.generateMipmaps = false
renderTargetBlur = new THREE.WebGLRenderTarget(512, 512)
renderTargetBlur.texture.generateMipmaps = false

// Plane Geometry and Material
const planeGeometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT).rotateX(Math.PI / 2)
const planeMaterial = new THREE.MeshBasicMaterial({
  map: renderTarget.texture,
  opacity: state.shadow.opacity,
  color: state.shadow.color,
  transparent: true,
  depthWrite: false,
})

plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.renderOrder = 1
shadowGroup.add(plane)
plane.scale.y = -1

// Blur Plane
blurPlane = new THREE.Mesh(planeGeometry)
blurPlane.visible = false
shadowGroup.add(blurPlane)

// Fill Plane Material
const fillPlaneMaterial = new THREE.MeshBasicMaterial({
  color: state.plane.color,
  opacity: state.plane.opacity,
  transparent: true,
  depthWrite: false,
})

fillPlane = new THREE.Mesh(planeGeometry, fillPlaneMaterial)
fillPlane.rotateX(Math.PI)
shadowGroup.add(fillPlane)

// Shadow Camera
shadowCamera = new THREE.OrthographicCamera(
  -PLANE_WIDTH / 2,
  PLANE_WIDTH / 2,
  PLANE_HEIGHT / 2,
  -PLANE_HEIGHT / 2,
  0,
  CAMERA_HEIGHT,
)
shadowCamera.rotation.x = Math.PI / 2
shadowGroup.add(shadowCamera)

// Camera Helper
cameraHelper = new THREE.CameraHelper(shadowCamera)

// Depth Material Configuration
depthMaterial = new THREE.MeshDepthMaterial()
depthMaterial.userData.darkness = { value: state.shadow.darkness }
depthMaterial.onBeforeCompile = function (shader) {
  shader.uniforms.darkness = depthMaterial.userData.darkness
  shader.fragmentShader = `
    uniform float darkness;
    ${shader.fragmentShader.replace(
      'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
      'gl_FragColor = vec4( vec3( 0.0 ), ( 1.0 - fragCoordZ ) * darkness );',
    )}
  `
}
depthMaterial.depthTest = false
depthMaterial.depthWrite = false

// Blur Materials
horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader)
horizontalBlurMaterial.depthTest = false

verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader)
verticalBlurMaterial.depthTest = false

// Camera and Renderer Setup
const duckContainer = document.querySelector('#duck')
const camera = new THREE.PerspectiveCamera(11, duckContainer.clientWidth / duckContainer.clientHeight, 1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas: duckContainer })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(duckContainer.clientWidth, duckContainer.clientHeight)

// Controls
const controls = new OrbitControls(camera, duckContainer)
controls.enableZoom = false
controls.enablePan = false
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.autoRotate = true

// Draco Loader Setup
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderConfig({ type: 'js' })
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')

// GLTF Loader Setup
const loadingManager = new THREE.LoadingManager(() => {
  const loadingScreen = document.getElementById('loader')
  loadingScreen.classList.add('fade-out')
})

const loader = new GLTFLoader(loadingManager)
loader.setDRACOLoader(dracoLoader)

// Duck Model
let duckModel

loader.load(
  '/duck.glb',
  (gltf) => {
    duckModel = gltf.scene

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 10, 0)
    scene.add(hemiLight)

    const dirLight = new THREE.DirectionalLight(0xffffff)
    dirLight.castShadow = true
    dirLight.position.set(75, 300, -75)
    scene.add(dirLight)

    // Center Duck Model
    const box = new THREE.Box3().setFromObject(gltf.scene)
    const center = box.getCenter(new THREE.Vector3())
    gltf.scene.position.x += gltf.scene.position.x - center.x
    gltf.scene.position.y += gltf.scene.position.y - center.y + 0.05
    gltf.scene.position.z += gltf.scene.position.z - center.z

    // Camera Adjustments
    camera.rotateY(Math.PI / 9)

    // Add Objects to Scene
    scene.add(duckModel)
    scene.add(new THREE.AmbientLight(0xffffff, 2))
    duckModel.scale.set(1.25, 1.25, 1.25)

    // Update Controls
    controls.update()

    // Depth Material & Rendering Setup
    cameraHelper.visible = false
    scene.overrideMaterial = depthMaterial
    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, shadowCamera)

    scene.overrideMaterial = null
    cameraHelper.visible = true

    // Apply Shadow Blur
    blurShadow(state.shadow.blur)
    blurShadow(state.shadow.blur * 0.4)

    renderer.setRenderTarget(null)
    renderer.render(scene, camera)
  },
  undefined,
  (error) => {
    console.error('Error loading GLB model:', error)
  },
)

// Set clear color and camera position
renderer.setClearColor(0xffffff, 0)
camera.position.z = 3
camera.position.set(0, 1, 3) // Set the camera slightly above and further back
camera.lookAt(new THREE.Vector3(0, 0, 0))

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  renderer.setSize(duckContainer.clientWidth, duckContainer.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  camera.aspect = duckContainer.clientWidth / duckContainer.clientHeight
  camera.updateProjectionMatrix()
}

// Shadow Blurring Function
function blurShadow(amount) {
  blurPlane.visible = true

  // Horizontal Blur
  blurPlane.material = horizontalBlurMaterial
  blurPlane.material.uniforms.tDiffuse.value = renderTarget.texture
  horizontalBlurMaterial.uniforms.h.value = (amount * 1) / 256

  renderer.setRenderTarget(renderTargetBlur)
  renderer.render(blurPlane, shadowCamera)

  // Vertical Blur
  blurPlane.material = verticalBlurMaterial
  blurPlane.material.uniforms.tDiffuse.value = renderTargetBlur.texture
  verticalBlurMaterial.uniforms.v.value = (amount * 1) / 256

  renderer.setRenderTarget(renderTarget)
  renderer.render(blurPlane, shadowCamera)

  blurPlane.visible = false
}

// Animation Loop
function animate() {
  if (duckModel) {
    controls.update()
  }

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)
