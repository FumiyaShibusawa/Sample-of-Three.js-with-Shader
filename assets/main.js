var scene, camera, control, renderer, geometry, material, mesh, time;

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var triangles = 500;

scene = new THREE.Scene();
camera = new THREE.OrthographicCamera( WIDTH / -2.0, WIDTH / 2.0, HEIGHT / 2.0, HEIGHT / -2.0, 0.1, 1000 );
camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
camera.position.set(0, 0, 240.0);
camera.lookAt(scene.position);
controls = new THREE.OrbitControls(camera);
controls.autoRotate = true;

renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xffffff, 0.0);
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
}

var pointSizeRange = renderer.context.getParameter( renderer.context.ALIASED_POINT_SIZE_RANGE );
console.log( 'pointSizeRange: ' + pointSizeRange[ 0 ] + ' to ' + pointSizeRange[ 1 ] );


var ParamsShaderMaterial = {
  uniforms: {
    "time": {value: 1.0}
  },
  vertexShader: [
    "attribute vec4 color;",
    "varying vec4 vColor;",
    "void main() {",
    "vColor = color;",
    "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join( "\n" ),
  fragmentShader: [
    "precision mediump float;",
    "uniform float time;",
    "varying vec4 vColor;",
    "void main() {",
    "float t = time * 0.001;",
    "gl_FragColor = vec4( vColor.r * abs(sin(t)), vColor.g * abs(cos(t)), vColor.b * abs(sin(t)), 1.0 );",
    "}"
  ].join( "\n" ),
  side: THREE.DoubleSide,
  transparent: true
}

init();
animate();

function init(){
  geometry = new THREE.BufferGeometry();
  let positions = [];
  let colors = [];
  for(let i = 0; i < triangles; i++){
    positions.push(Math.random() * 200.0 - 100.0);
    positions.push(Math.random() * 200.0 - 100.0);
    positions.push(Math.random() * 200.0 - 100.0);
    colors.push(Math.random() * 255.0);
    colors.push(Math.random() * 255.0);
    colors.push(Math.random() * 255.0);
    colors.push(Math.random() * 255.0);
  }
  let positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
  let colorAttribute = new THREE.Uint8BufferAttribute(colors, 4);
  colorAttribute.normalized = true;
  geometry.addAttribute( 'position', positionAttribute );
  geometry.addAttribute( 'color', colorAttribute );
  material = new THREE.ShaderMaterial(ParamsShaderMaterial);
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function createBox(){

}

function animate(){
  requestAnimationFrame(animate);
  render();
}

function render(){
  time = performance.now();
  material.uniforms.time.value = time;
  // mesh.rotation.x += Math.PI / 180;
  // mesh.rotation.y += Math.PI / 180;
  renderer.render(scene, camera);
}
